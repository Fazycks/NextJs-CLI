import * as fs from "fs-extra";
import * as path from "path";
import simpleGit from "simple-git";
import { CloneOptions } from "../types";
import { ValidationService } from "./validation.service";

export class GitService {
    /**
     * Clone un dépôt GitHub avec options avancées
     */
    static async cloneRepository(
        options: CloneOptions,
    ): Promise<{ success: boolean; message: string }> {
        const { repository, targetPath, user } = options;

        try {
            // Validation du chemin de destination
            if (!ValidationService.validateDestinationPath(targetPath)) {
                return {
                    success: false,
                    message: "Chemin de destination invalide",
                };
            }

            // Vérifier si le dossier cible existe déjà
            if (await fs.pathExists(targetPath)) {
                return {
                    success: false,
                    message: `Le dossier ${targetPath} existe déjà`,
                };
            }

            // Créer le dossier parent si nécessaire
            await fs.ensureDir(path.dirname(targetPath));

            const git = simpleGit();
            let cloneUrl = repository.url;

            // Si c'est un dépôt privé, utiliser le token d'authentification
            if (repository.isPrivate && user?.githubToken) {
                cloneUrl = this.addTokenToUrl(repository.url, user.githubToken);
            }

            console.log(`Clonage de ${repository.name}...`);

            // Options de clonage
            const cloneOptions = [
                "--depth",
                "1", // Clone shallow pour plus de rapidité
                "--single-branch",
            ];

            await git.clone(cloneUrl, targetPath, cloneOptions);

            // Nettoyer l'historique Git si souhaité
            await this.cleanGitHistory(targetPath);

            return { success: true, message: "Clonage réussi" };
        } catch (error: any) {
            console.error("Erreur lors du clonage:", error?.message || error);
            return {
                success: false,
                message: error?.message || "Erreur inconnue lors du clonage",
            };
        }
    }

    /**
     * Nettoie l'historique Git pour un nouveau projet
     */
    private static async cleanGitHistory(targetPath: string): Promise<void> {
        try {
            const gitDir = path.join(targetPath, ".git");
            if (await fs.pathExists(gitDir)) {
                await fs.remove(gitDir);
                console.log("Historique Git nettoyé");
            }
        } catch (error) {
            console.warn("Impossible de nettoyer l'historique Git");
        }
    }

    /**
     * Ajoute le token GitHub à l'URL pour l'authentification
     */
    private static addTokenToUrl(url: string, token: string): string {
        // Convertir l'URL HTTPS pour inclure le token
        if (url.startsWith("https://github.com/")) {
            return url.replace(
                "https://github.com/",
                `https://${token}@github.com/`,
            );
        }
        return url;
    }

    /**
     * Vérifie si Git est installé sur le système
     */
    static async isGitInstalled(): Promise<boolean> {
        try {
            const git = simpleGit();
            await git.version();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Initialise un nouveau dépôt Git dans le dossier cible
     */
    static async initRepository(targetPath: string): Promise<boolean> {
        try {
            const git = simpleGit(targetPath);
            await git.init();
            return true;
        } catch (error) {
            console.error("Erreur lors de l'initialisation Git:", error);
            return false;
        }
    }
}
