import { execSync } from "child_process";
import * as fs from "fs-extra";
import * as path from "path";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface PackageManagerInfo {
    name: PackageManager;
    displayName: string;
    installCommand: string;
    devInstallCommand: string;
    runCommand: string;
    lockFile: string;
    isAvailable: boolean;
    version?: string;
}

export class PackageManagerService {
    private static packageManagers: PackageManagerInfo[] = [
        {
            name: "pnpm",
            displayName: "pnpm (Fast, disk space efficient)",
            installCommand: "pnpm add",
            devInstallCommand: "pnpm add -D",
            runCommand: "pnpm",
            lockFile: "pnpm-lock.yaml",
            isAvailable: false,
        },
        {
            name: "yarn",
            displayName: "Yarn (Fast, reliable, secure)",
            installCommand: "yarn add",
            devInstallCommand: "yarn add -D",
            runCommand: "yarn",
            lockFile: "yarn.lock",
            isAvailable: false,
        },
        {
            name: "bun",
            displayName: "Bun (Ultra-fast JavaScript runtime)",
            installCommand: "bun add",
            devInstallCommand: "bun add -D",
            runCommand: "bun",
            lockFile: "bun.lockb",
            isAvailable: false,
        },
        {
            name: "npm",
            displayName: "npm (Node.js default)",
            installCommand: "npm install",
            devInstallCommand: "npm install -D",
            runCommand: "npm",
            lockFile: "package-lock.json",
            isAvailable: false,
        },
    ];

    /**
     * Vérifie quels gestionnaires de paquets sont disponibles sur le système
     */
    static async detectAvailablePackageManagers(): Promise<
        PackageManagerInfo[]
    > {
        const managers = [...this.packageManagers];

        for (const manager of managers) {
            try {
                const version = execSync(`${manager.name} --version`, {
                    encoding: "utf8",
                    stdio: "pipe",
                }).trim();

                manager.isAvailable = true;
                manager.version = version;
            } catch (error) {
                manager.isAvailable = false;
            }
        }

        return managers;
    }

    /**
     * Détecte le gestionnaire de paquets utilisé dans le projet courant
     */
    static async detectProjectPackageManager(
        projectPath: string = process.cwd(),
    ): Promise<PackageManager | null> {
        const managers = await this.detectAvailablePackageManagers();

        // Vérifier les lock files existants
        for (const manager of managers) {
            if (await fs.pathExists(path.join(projectPath, manager.lockFile))) {
                return manager.name;
            }
        }

        // Vérifier le package.json pour des indices
        const packageJsonPath = path.join(projectPath, "package.json");
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const packageJson = await fs.readJson(packageJsonPath);

                // Vérifier les scripts pour des indices
                if (packageJson.scripts) {
                    const scripts = JSON.stringify(packageJson.scripts);
                    if (scripts.includes("pnpm")) return "pnpm";
                    if (scripts.includes("yarn")) return "yarn";
                    if (scripts.includes("bun")) return "bun";
                }

                // Vérifier packageManager field (nouveau standard)
                if (packageJson.packageManager) {
                    const pmSpec = packageJson.packageManager;
                    if (pmSpec.startsWith("pnpm@")) return "pnpm";
                    if (pmSpec.startsWith("yarn@")) return "yarn";
                    if (pmSpec.startsWith("bun@")) return "bun";
                    if (pmSpec.startsWith("npm@")) return "npm";
                }
            } catch (error) {
                // Ignore les erreurs de lecture du package.json
            }
        }

        return null;
    }

    /**
     * Récupère les gestionnaires de paquets disponibles
     */
    static async getAvailablePackageManagers(): Promise<PackageManagerInfo[]> {
        const managers = await this.detectAvailablePackageManagers();
        return managers.filter((m) => m.isAvailable);
    }

    /**
     * Récupère le gestionnaire de paquets recommandé
     */
    static async getRecommendedPackageManager(): Promise<PackageManager> {
        const available = await this.getAvailablePackageManagers();

        // Ordre de préférence : pnpm > yarn > bun > npm
        const preferenceOrder: PackageManager[] = [
            "pnpm",
            "yarn",
            "bun",
            "npm",
        ];

        for (const preferred of preferenceOrder) {
            if (available.find((m) => m.name === preferred)) {
                return preferred;
            }
        }

        return "npm"; // Fallback
    }

    /**
     * Récupère les informations d'un gestionnaire de paquets
     */
    static async getPackageManagerInfo(
        name: PackageManager,
    ): Promise<PackageManagerInfo | null> {
        const managers = await this.detectAvailablePackageManagers();
        return managers.find((m) => m.name === name) || null;
    }

    /**
     * Installe des packages avec le gestionnaire choisi
     */
    static async installPackages(
        packages: string[],
        packageManager: PackageManager,
        isDev: boolean = false,
        cwd: string = process.cwd(),
    ): Promise<{ success: boolean; message: string }> {
        try {
            const manager = await this.getPackageManagerInfo(packageManager);
            if (!manager || !manager.isAvailable) {
                return {
                    success: false,
                    message: `${packageManager} n'est pas disponible sur ce système`,
                };
            }

            const command = isDev
                ? manager.devInstallCommand
                : manager.installCommand;
            const fullCommand = `${command} ${packages.join(" ")}`;

            execSync(fullCommand, {
                cwd,
                stdio: "inherit",
            });

            return {
                success: true,
                message: `Packages installés avec ${packageManager}`,
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Erreur lors de l'installation: ${error.message}`,
            };
        }
    }

    /**
     * Crée le lock file approprié si nécessaire
     */
    static async createLockFile(
        packageManager: PackageManager,
        projectPath: string,
    ): Promise<void> {
        const manager = await this.getPackageManagerInfo(packageManager);
        if (!manager) return;

        const lockFilePath = path.join(projectPath, manager.lockFile);

        // Ne pas créer si le lock file existe déjà
        if (await fs.pathExists(lockFilePath)) return;

        // Créer un lock file vide pour certains gestionnaires
        if (packageManager === "yarn" && !(await fs.pathExists(lockFilePath))) {
            await fs.writeFile(lockFilePath, "# Yarn lockfile v1\n\n");
        }
    }

    /**
     * Met à jour le package.json avec le gestionnaire choisi
     */
    static async updatePackageJsonWithManager(
        packageManager: PackageManager,
        projectPath: string,
    ): Promise<void> {
        const packageJsonPath = path.join(projectPath, "package.json");

        if (!(await fs.pathExists(packageJsonPath))) return;

        try {
            const packageJson = await fs.readJson(packageJsonPath);
            const manager = await this.getPackageManagerInfo(packageManager);

            if (manager && manager.version) {
                // Ajouter le champ packageManager (nouveau standard)
                packageJson.packageManager = `${packageManager}@${manager.version}`;

                await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            }
        } catch (error) {
            // Ignorer les erreurs de mise à jour
        }
    }
}
