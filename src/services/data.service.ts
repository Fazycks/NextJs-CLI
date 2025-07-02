import { Component, Repository, User } from "../types";
import { ConfigService } from "./config.service";

export class DataService {
    private static useConfigFile = true;

    // Données par défaut si le fichier de configuration n'est pas disponible
    private static defaultRepositories: Repository[] = [
        {
            name: "NextJS Clean",
            url: "https://github.com/vercel/next-learn-starter",
            description: "Un template NextJS minimal et propre",
            isPrivate: false,
            requiresAuth: false,
        },
        {
            name: "NextJS Advanced (Privé)",
            url: "https://github.com/your-org/nextjs-advanced-template",
            description:
                "Template NextJS avancé avec authentification, base de données, etc.",
            isPrivate: true,
            requiresAuth: true,
        },
    ];

    private static defaultUsers: User[] = [
        {
            id: "1",
            username: "admin",
            email: "admin@example.com",
            hasPrivateAccess: true,
            githubToken: "ghp_your_private_token_here",
        },
        {
            id: "2",
            username: "user1",
            email: "user1@example.com",
            hasPrivateAccess: false,
        },
        {
            id: "3",
            username: "developer",
            email: "dev@example.com",
            hasPrivateAccess: true,
            githubToken: "ghp_another_private_token",
        },
    ];

    /**
     * Récupère tous les dépôts
     */
    static async getRepositories(): Promise<Repository[]> {
        if (this.useConfigFile) {
            try {
                return await ConfigService.getRepositories();
            } catch (error) {
                console.warn(
                    "Utilisation des données par défaut car le fichier de configuration n'est pas accessible",
                );
                return this.defaultRepositories;
            }
        }
        return this.defaultRepositories;
    }

    /**
     * Récupère tous les utilisateurs
     */
    static async getUsers(): Promise<User[]> {
        if (this.useConfigFile) {
            try {
                return await ConfigService.getUsers();
            } catch (error) {
                console.warn(
                    "Utilisation des données par défaut car le fichier de configuration n'est pas accessible",
                );
                return this.defaultUsers;
            }
        }
        return this.defaultUsers;
    }

    /**
     * Récupère tous les composants
     */
    static async getComponents(): Promise<Component[]> {
        if (this.useConfigFile) {
            try {
                return await ConfigService.getComponents();
            } catch (error) {
                console.warn(
                    "Utilisation des composants par défaut car le fichier de configuration n'est pas accessible",
                );
                return [];
            }
        }
        return [];
    }

    /**
     * Configure le mode d'utilisation
     */
    static setUseConfigFile(useFile: boolean): void {
        this.useConfigFile = useFile;
    }
}
