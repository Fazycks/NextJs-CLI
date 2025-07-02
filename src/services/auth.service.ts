import { AuthResponse, User } from "../types";
import { DataService } from "./data.service";

export class AuthService {
    /**
     * Authentifie un utilisateur par nom d'utilisateur
     */
    static async authenticateUser(username: string): Promise<AuthResponse> {
        try {
            // Simulation d'une requête à la base de données
            // await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            const users = await DataService.getUsers();
            const user = users.find(
                (u) => u.username.toLowerCase() === username.toLowerCase(),
            );

            if (!user) {
                return {
                    success: false,
                    message: "Utilisateur non trouvé",
                };
            }

            return {
                success: true,
                user,
                message: "Authentification réussie",
            };
        } catch (error) {
            return {
                success: false,
                message: "Erreur lors de l'authentification",
            };
        }
    }

    /**
     * Vérifie si un utilisateur a accès aux dépôts privés
     */
    static hasPrivateAccess(user: User): boolean {
        return user.hasPrivateAccess && !!user.githubToken;
    }

    /**
     * Obtient le token GitHub d'un utilisateur
     */
    static getGithubToken(user: User): string | null {
        return user.githubToken || null;
    }

    /**
     * Liste tous les utilisateurs (pour debug)
     */
    static async getAllUsers(): Promise<User[]> {
        const users = await DataService.getUsers();
        return users.map((user) => ({
            ...user,
            githubToken: user.githubToken ? "***masqué***" : undefined,
        }));
    }
}
