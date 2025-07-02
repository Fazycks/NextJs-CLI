#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import * as path from "path";
import { AuthService } from "./services/auth.service";
import { ComponentService } from "./services/component.service";
import { GitService } from "./services/git.service";
import { PackageManagerService } from "./services/package-manager.service";
import { RepositoryService } from "./services/repository.service";
import { ValidationService } from "./services/validation.service";
import { Component, User } from "./types";

const program = new Command();

program
    .name("nextjs-cli")
    .description("CLI pour cloner des dépôts NextJS avec authentification")
    .version("1.0.0");

program
    .command("create")
    .description("Créer un nouveau projet NextJS")
    .argument("[name]", "Nom du projet")
    .option(
        "--pm, --package-manager <manager>",
        "Forcer l'utilisation d'un gestionnaire de paquets (npm, pnpm, yarn, bun)",
    )
    .option("--no-install", "Ne pas installer les dépendances automatiquement")
    .action(async (projectName?: string, options: any = {}) => {
        try {
            console.log(
                chalk.blue.bold("🚀 NextJS CLI - Créateur de projets\n"),
            );

            // Étape 1: Demander le nom du projet si non fourni
            if (!projectName) {
                const { name } = await inquirer.prompt([
                    {
                        type: "input",
                        name: "name",
                        message: "Nom du projet:",
                        validate: (input: string) => {
                            const validation =
                                ValidationService.validateProjectName(input);
                            return (
                                validation.valid ||
                                validation.message ||
                                "Nom invalide"
                            );
                        },
                    },
                ]);
                projectName = name;
            } else {
                // Valider le nom fourni en argument
                const validation =
                    ValidationService.validateProjectName(projectName);
                if (!validation.valid) {
                    console.error(chalk.red(`Erreur: ${validation.message}`));
                    process.exit(1);
                }
            }

            // Étape 2: Vérifier si Git est installé
            const gitSpinner = ora("Vérification de Git...").start();
            const isGitInstalled = await GitService.isGitInstalled();
            if (!isGitInstalled) {
                gitSpinner.fail("Git n'est pas installé sur votre système");
                process.exit(1);
            }
            gitSpinner.succeed("Git détecté");

            // Étape 3: Choisir le type de dépôt
            const repositories = await RepositoryService.getAllRepositories();
            const { selectedRepo } = await inquirer.prompt([
                {
                    type: "list",
                    name: "selectedRepo",
                    message: "Choisissez un template:",
                    choices: repositories.map((repo) => ({
                        name: `${repo.name} - ${repo.description}${
                            repo.isPrivate ? " 🔒" : ""
                        }`,
                        value: repo,
                    })),
                },
            ]);

            let authenticatedUser: User | undefined;

            // Étape 4: Authentification si nécessaire
            if (RepositoryService.requiresAuthentication(selectedRepo)) {
                console.log(
                    chalk.yellow(
                        "\n🔐 Ce dépôt nécessite une authentification\n",
                    ),
                );

                const { username } = await inquirer.prompt([
                    {
                        type: "input",
                        name: "username",
                        message: "Nom d'utilisateur:",
                        validate: (input: string) =>
                            input.trim() !== "" ||
                            "Le nom d'utilisateur est requis",
                    },
                ]);

                const authSpinner = ora("Authentification...").start();
                const authResult = await AuthService.authenticateUser(username);

                if (!authResult.success || !authResult.user) {
                    authSpinner.fail(authResult.message);
                    process.exit(1);
                }

                if (!AuthService.hasPrivateAccess(authResult.user)) {
                    authSpinner.fail("Vous n'avez pas accès aux dépôts privés");
                    process.exit(1);
                }

                authenticatedUser = authResult.user;
                authSpinner.succeed(
                    `Connecté en tant que ${authResult.user.username}`,
                );
            }

            // Étape 5: Cloner le dépôt
            const targetPath = path.resolve(process.cwd(), projectName!);
            const cloneSpinner = ora(
                `Clonage de ${selectedRepo.name}...`,
            ).start();

            const cloneResult = await GitService.cloneRepository({
                repository: selectedRepo,
                targetPath,
                user: authenticatedUser,
            });

            if (!cloneResult.success) {
                cloneSpinner.fail(cloneResult.message);
                process.exit(1);
            }

            cloneSpinner.succeed(`Projet créé avec succès dans ${targetPath}`);

            // Étape 6: Configuration du gestionnaire de paquets
            console.log(chalk.cyan("\n⚙️ Configuration du projet..."));

            const availableManagers =
                await PackageManagerService.getAvailablePackageManagers();
            const recommendedManager =
                await PackageManagerService.getRecommendedPackageManager();

            let selectedPackageManager = recommendedManager;

            // Si l'utilisateur a forcé un gestionnaire via --pm
            if (options.packageManager) {
                const forcedPM = options.packageManager.toLowerCase();
                const managerInfo =
                    await PackageManagerService.getPackageManagerInfo(
                        forcedPM as any,
                    );

                if (!managerInfo || !managerInfo.isAvailable) {
                    console.error(
                        chalk.red(
                            `❌ Gestionnaire de paquets "${forcedPM}" non disponible ou non installé.`,
                        ),
                    );
                    console.log(
                        chalk.yellow("\n💡 Gestionnaires disponibles:"),
                    );
                    availableManagers.forEach((m) => {
                        console.log(
                            chalk.cyan(`  • ${m.name} - v${m.version}`),
                        );
                    });
                    process.exit(1);
                }

                selectedPackageManager = forcedPM as any;
                console.log(
                    chalk.cyan(
                        `📦 Gestionnaire forcé: ${selectedPackageManager}`,
                    ),
                );
            }
            // Si plusieurs gestionnaires sont disponibles, demander à l'utilisateur
            else if (availableManagers.length > 1) {
                const { packageManager } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "packageManager",
                        message: "Choisissez votre gestionnaire de paquets:",
                        choices: availableManagers.map((manager) => ({
                            name: `${manager.displayName} ${
                                manager.name === recommendedManager
                                    ? "(recommandé)"
                                    : ""
                            } - v${manager.version}`,
                            value: manager.name,
                        })),
                        default: recommendedManager,
                    },
                ]);
                selectedPackageManager = packageManager;
            }

            // Mettre à jour le package.json avec le gestionnaire choisi
            await PackageManagerService.updatePackageJsonWithManager(
                selectedPackageManager,
                targetPath,
            );
            await PackageManagerService.createLockFile(
                selectedPackageManager,
                targetPath,
            );

            // Étape 7: Instructions finales
            console.log(chalk.green.bold("\n✅ Projet créé avec succès!\n"));
            console.log(chalk.cyan("Prochaines étapes:"));
            console.log(chalk.white(`  cd ${projectName}`));

            const managerInfo =
                await PackageManagerService.getPackageManagerInfo(
                    selectedPackageManager,
                );
            if (managerInfo) {
                console.log(chalk.white(`  ${managerInfo.installCommand}`));
                console.log(chalk.white(`  ${managerInfo.runCommand} run dev`));
            }

            console.log(
                chalk.gray(
                    `\n💡 Gestionnaire de paquets configuré: ${selectedPackageManager}`,
                ),
            );
            console.log("");
        } catch (error) {
            console.error(chalk.red("Erreur:", error));
            process.exit(1);
        }
    });

program
    .command("list-users")
    .description("Lister tous les utilisateurs (pour debug)")
    .action(async () => {
        console.log(chalk.blue.bold("👥 Liste des utilisateurs:\n"));
        try {
            const users = await AuthService.getAllUsers();
            users.forEach((user) => {
                console.log(chalk.cyan(`• ${user.username} (${user.email})`));
                console.log(chalk.gray(`  ID: ${user.id}`));
                console.log(
                    chalk.gray(
                        `  Accès privé: ${user.hasPrivateAccess ? "✅" : "❌"}`,
                    ),
                );
                console.log(
                    chalk.gray(
                        `  Token: ${user.githubToken || "Non défini"}\n`,
                    ),
                );
            });
        } catch (error) {
            console.error(
                chalk.red(
                    "Erreur lors de la récupération des utilisateurs:",
                    error,
                ),
            );
        }
    });

program
    .command("list-repos")
    .description("Lister tous les dépôts disponibles")
    .action(async () => {
        console.log(chalk.blue.bold("📦 Dépôts disponibles:\n"));
        try {
            const repos = await RepositoryService.getAllRepositories();
            repos.forEach((repo) => {
                console.log(
                    chalk.cyan(
                        `• ${repo.name} ${repo.isPrivate ? "🔒" : "🌐"}`,
                    ),
                );
                console.log(chalk.gray(`  ${repo.description}`));
                console.log(chalk.gray(`  URL: ${repo.url}`));
                console.log(
                    chalk.gray(`  Privé: ${repo.isPrivate ? "Oui" : "Non"}\n`),
                );
            });
        } catch (error) {
            console.error(
                chalk.red("Erreur lors de la récupération des dépôts:", error),
            );
        }
    });

program
    .command("validate")
    .description("Valider la configuration et les dépôts")
    .action(async () => {
        console.log(chalk.blue.bold("🔍 Validation de la configuration\n"));

        try {
            const repos = await RepositoryService.getAllRepositories();
            const users = await AuthService.getAllUsers();

            console.log(chalk.cyan("Validation des dépôts:"));
            for (const repo of repos) {
                const spinner = ora(`Validation de ${repo.name}...`).start();

                // Pour les dépôts privés, utiliser un token de test
                let token: string | undefined;
                if (repo.isPrivate) {
                    const adminUser = users.find((u) => u.username === "admin");
                    token = adminUser?.githubToken;
                }

                const isValid = await ValidationService.validateGithubUrl(
                    repo.url,
                    token,
                );
                if (isValid) {
                    spinner.succeed(`${repo.name} - ✅ Accessible`);
                } else {
                    spinner.warn(
                        `${repo.name} - ⚠️  Non accessible (URL invalide ou token requis)`,
                    );
                }
            }

            console.log(chalk.green("\n✅ Validation terminée"));
        } catch (error) {
            console.error(chalk.red("Erreur lors de la validation:", error));
        }
    });

program
    .command("add")
    .description("Ajouter un composant/template au projet courant")
    .argument("[component-name]", "Nom du composant à ajouter")
    .option(
        "--pm, --package-manager <manager>",
        "Forcer l'utilisation d'un gestionnaire de paquets (npm, pnpm, yarn, bun)",
    )
    .option("--no-install", "Ne pas installer les dépendances automatiquement")
    .action(async (componentName?: string, options: any = {}) => {
        try {
            console.log(
                chalk.blue.bold("📦 NextJS CLI - Ajout de composants\n"),
            );

            // Vérifier si nous sommes dans un projet NextJS
            const packageJsonPath = path.resolve(process.cwd(), "package.json");
            if (!(await require("fs-extra").pathExists(packageJsonPath))) {
                console.error(
                    chalk.red(
                        "❌ Aucun package.json trouvé. Assurez-vous d'être dans un projet NextJS.",
                    ),
                );
                process.exit(1);
            }

            // Détecter le gestionnaire de paquets du projet
            const detectedPM =
                await PackageManagerService.detectProjectPackageManager();
            const availableManagers =
                await PackageManagerService.getAvailablePackageManagers();

            let selectedPackageManager =
                detectedPM ||
                (await PackageManagerService.getRecommendedPackageManager());

            // Si l'utilisateur a forcé un gestionnaire via --pm
            if (options.packageManager) {
                const forcedPM = options.packageManager.toLowerCase();
                const managerInfo =
                    await PackageManagerService.getPackageManagerInfo(
                        forcedPM as any,
                    );

                if (!managerInfo || !managerInfo.isAvailable) {
                    console.error(
                        chalk.red(
                            `❌ Gestionnaire de paquets "${forcedPM}" non disponible ou non installé.`,
                        ),
                    );
                    console.log(
                        chalk.yellow("\n💡 Gestionnaires disponibles:"),
                    );
                    availableManagers.forEach((m) => {
                        console.log(
                            chalk.cyan(`  • ${m.name} - v${m.version}`),
                        );
                    });
                    process.exit(1);
                }

                selectedPackageManager = forcedPM as any;
                console.log(
                    chalk.cyan(
                        `📦 Gestionnaire forcé: ${selectedPackageManager}`,
                    ),
                );
            }
            // Si plusieurs gestionnaires sont disponibles et aucun n'est détecté, demander à l'utilisateur
            else if (!detectedPM && availableManagers.length > 1) {
                console.log(
                    chalk.yellow(
                        "🔍 Aucun gestionnaire de paquets détecté dans ce projet.",
                    ),
                );
                const { packageManager } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "packageManager",
                        message: "Choisissez votre gestionnaire de paquets:",
                        choices: availableManagers.map((manager) => ({
                            name: `${manager.displayName} - v${manager.version}`,
                            value: manager.name,
                        })),
                        default: selectedPackageManager,
                    },
                ]);
                selectedPackageManager = packageManager;
            } else if (detectedPM) {
                console.log(
                    chalk.cyan(`📦 Gestionnaire détecté: ${detectedPM}`),
                );
            }

            let selectedComponent: Component;

            if (componentName) {
                // Recherche directe par nom
                const component =
                    ComponentService.getComponentByName(componentName);
                if (!component) {
                    console.error(
                        chalk.red(
                            `❌ Composant "${componentName}" introuvable.`,
                        ),
                    );
                    console.log(chalk.yellow("\n💡 Composants disponibles:"));
                    const components = ComponentService.getAllComponents();
                    components.forEach((comp) => {
                        console.log(
                            chalk.cyan(
                                `  • ${comp.name} - ${comp.displayName}`,
                            ),
                        );
                    });
                    process.exit(1);
                }
                selectedComponent = component;
            } else {
                // Sélection interactive
                const components = ComponentService.getAllComponents();
                const { component } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "component",
                        message: "Choisissez un composant à ajouter:",
                        choices: components.map((comp) => ({
                            name: `${comp.displayName} - ${comp.description} ${
                                comp.isPrivate ? "🔒" : ""
                            }`,
                            value: comp,
                        })),
                        pageSize: 10,
                    },
                ]);
                selectedComponent = component;
            }

            let authenticatedUser: User | undefined;

            // Vérification de l'authentification si nécessaire
            if (ComponentService.requiresAuthentication(selectedComponent)) {
                console.log(
                    chalk.yellow(
                        "\n🔐 Ce composant nécessite une authentification\n",
                    ),
                );

                const { username } = await inquirer.prompt([
                    {
                        type: "input",
                        name: "username",
                        message: "Nom d'utilisateur:",
                        validate: (input: string) =>
                            input.trim() !== "" ||
                            "Le nom d'utilisateur est requis",
                    },
                ]);

                const authSpinner = ora("Authentification...").start();
                const authResult = await AuthService.authenticateUser(username);

                if (!authResult.success || !authResult.user) {
                    authSpinner.fail(authResult.message);
                    process.exit(1);
                }

                if (!AuthService.hasPrivateAccess(authResult.user)) {
                    authSpinner.fail(
                        "Vous n'avez pas accès aux composants privés",
                    );
                    process.exit(1);
                }

                authenticatedUser = authResult.user;
                authSpinner.succeed(
                    `Connecté en tant que ${authResult.user.username}`,
                );
            }

            // Installation du composant
            const installSpinner = ora(
                `Installation de ${selectedComponent.displayName}...`,
            ).start();

            const installResult = await ComponentService.installComponent(
                selectedComponent,
            );

            if (!installResult.success) {
                installSpinner.fail(installResult.message);
                process.exit(1);
            }

            installSpinner.succeed(installResult.message);

            // Affichage des dépendances à installer
            if (
                selectedComponent.dependencies ||
                selectedComponent.devDependencies
            ) {
                console.log(chalk.yellow("\n📋 Dépendances à installer:"));

                const managerInfo =
                    await PackageManagerService.getPackageManagerInfo(
                        selectedPackageManager,
                    );

                if (selectedComponent.dependencies?.length) {
                    console.log(chalk.cyan("Dependencies:"));
                    console.log(
                        chalk.white(
                            `  ${
                                managerInfo?.installCommand
                            } ${selectedComponent.dependencies.join(" ")}`,
                        ),
                    );
                }

                if (selectedComponent.devDependencies?.length) {
                    console.log(chalk.cyan("Dev Dependencies:"));
                    console.log(
                        chalk.white(
                            `  ${
                                managerInfo?.devInstallCommand
                            } ${selectedComponent.devDependencies.join(" ")}`,
                        ),
                    );
                }

                const { installDeps } = await inquirer.prompt([
                    {
                        type: "confirm",
                        name: "installDeps",
                        message:
                            "Voulez-vous installer les dépendances maintenant?",
                        default: !options.noInstall,
                    },
                ]);

                if (installDeps) {
                    // Installation des dépendances
                    if (selectedComponent.dependencies?.length) {
                        const depsSpinner = ora(
                            `Installation des dépendances avec ${selectedPackageManager}...`,
                        ).start();

                        const result =
                            await PackageManagerService.installPackages(
                                selectedComponent.dependencies,
                                selectedPackageManager,
                                false,
                            );

                        if (result.success) {
                            depsSpinner.succeed(result.message);
                        } else {
                            depsSpinner.fail(result.message);
                        }
                    }

                    if (selectedComponent.devDependencies?.length) {
                        const devDepsSpinner = ora(
                            `Installation des dépendances de développement avec ${selectedPackageManager}...`,
                        ).start();

                        const result =
                            await PackageManagerService.installPackages(
                                selectedComponent.devDependencies,
                                selectedPackageManager,
                                true,
                            );

                        if (result.success) {
                            devDepsSpinner.succeed(result.message);
                        } else {
                            devDepsSpinner.fail(result.message);
                        }
                    }
                }
            }

            console.log(
                chalk.green.bold("\n✅ Composant ajouté avec succès!\n"),
            );
        } catch (error) {
            console.error(chalk.red("Erreur:", error));
            process.exit(1);
        }
    });

program
    .command("list-components")
    .alias("list-comp")
    .description("Lister tous les composants disponibles")
    .option("-c, --category <category>", "Filtrer par catégorie")
    .action(async (options) => {
        console.log(chalk.blue.bold("📦 Composants disponibles:\n"));

        try {
            let components = ComponentService.getAllComponents();

            if (options.category) {
                components = ComponentService.getComponentsByCategory(
                    options.category,
                );
                console.log(chalk.cyan(`Catégorie: ${options.category}\n`));
            }

            if (components.length === 0) {
                console.log(
                    chalk.yellow(
                        "Aucun composant trouvé pour cette catégorie.",
                    ),
                );
                return;
            }

            // Grouper par catégories
            const componentsByCategory = components.reduce((acc, comp) => {
                if (!acc[comp.category]) {
                    acc[comp.category] = [];
                }
                acc[comp.category].push(comp);
                return acc;
            }, {} as Record<string, Component[]>);

            Object.entries(componentsByCategory).forEach(
                ([category, comps]) => {
                    console.log(
                        chalk.magenta.bold(`📂 ${category.toUpperCase()}`),
                    );
                    comps.forEach((comp) => {
                        const authIcon = comp.isPrivate ? "🔒" : "🌐";
                        console.log(chalk.cyan(`  • ${comp.name} ${authIcon}`));
                        console.log(chalk.gray(`    ${comp.displayName}`));
                        console.log(chalk.gray(`    ${comp.description}`));
                        if (comp.dependencies?.length) {
                            console.log(
                                chalk.gray(
                                    `    Dépendances: ${comp.dependencies.join(
                                        ", ",
                                    )}`,
                                ),
                            );
                        }
                        console.log("");
                    });
                },
            );

            console.log(chalk.green("💡 Utilisation:"));
            console.log(chalk.white("  nextjs-cli add <component-name>"));
            console.log(
                chalk.white(
                    "  nextjs-cli add  # pour une sélection interactive",
                ),
            );
        } catch (error) {
            console.error(
                chalk.red(
                    "Erreur lors de la récupération des composants:",
                    error,
                ),
            );
        }
    });

program
    .command("list-package-managers")
    .alias("list-pm")
    .description("Lister les gestionnaires de paquets disponibles")
    .action(async () => {
        console.log(
            chalk.blue.bold("📦 Gestionnaires de paquets disponibles:\n"),
        );

        try {
            const managers =
                await PackageManagerService.detectAvailablePackageManagers();
            const recommended =
                await PackageManagerService.getRecommendedPackageManager();

            managers.forEach((manager) => {
                const statusIcon = manager.isAvailable ? "✅" : "❌";
                const recommendedText =
                    manager.name === recommended ? " (recommandé)" : "";
                const versionText = manager.version
                    ? ` - v${manager.version}`
                    : "";

                console.log(
                    `${statusIcon} ${chalk.cyan(
                        manager.name,
                    )}${recommendedText}${versionText}`,
                );
                console.log(chalk.gray(`   ${manager.displayName}`));
                if (manager.isAvailable) {
                    console.log(
                        chalk.gray(
                            `   Install: ${manager.installCommand} <package>`,
                        ),
                    );
                    console.log(
                        chalk.gray(
                            `   Dev Install: ${manager.devInstallCommand} <package>`,
                        ),
                    );
                }
                console.log("");
            });

            // Détecter le gestionnaire du projet courant
            const currentPM =
                await PackageManagerService.detectProjectPackageManager();
            if (currentPM) {
                console.log(
                    chalk.green(
                        `💡 Gestionnaire détecté dans ce projet: ${currentPM}`,
                    ),
                );
            } else {
                console.log(
                    chalk.yellow(
                        "💡 Aucun gestionnaire détecté dans ce projet",
                    ),
                );
            }
        } catch (error) {
            console.error(
                chalk.red(
                    "Erreur lors de la détection des gestionnaires:",
                    error,
                ),
            );
        }
    });

// Gestion des erreurs non capturées
process.on("unhandledRejection", (reason, promise) => {
    console.error(chalk.red("Erreur non gérée:", reason));
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error(chalk.red("Exception non capturée:", error));
    process.exit(1);
});

program.parse();
