import { Repository } from "../types";
import { DataService } from "./data.service";

export class RepositoryService {
    /**
     * Récupère tous les dépôts disponibles
     */
    static async getAllRepositories(): Promise<Repository[]> {
        return await DataService.getRepositories();
    }

    /**
     * Récupère les dépôts publics
     */
    static async getPublicRepositories(): Promise<Repository[]> {
        const repositories = await DataService.getRepositories();
        return repositories.filter((repo) => !repo.isPrivate);
    }

    /**
     * Récupère les dépôts privés
     */
    static async getPrivateRepositories(): Promise<Repository[]> {
        const repositories = await DataService.getRepositories();
        return repositories.filter((repo) => repo.isPrivate);
    }

    /**
     * Récupère un dépôt par nom
     */
    static async getRepositoryByName(
        name: string,
    ): Promise<Repository | undefined> {
        const repositories = await DataService.getRepositories();
        return repositories.find((repo) =>
            repo.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    /**
     * Vérifie si un dépôt nécessite une authentification
     */
    static requiresAuthentication(repository: Repository): boolean {
        return repository.requiresAuth || repository.isPrivate;
    }
}
