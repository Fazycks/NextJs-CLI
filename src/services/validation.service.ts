import axios from "axios";

export class ValidationService {
    /**
     * Valide si une URL GitHub est accessible
     */
    static async validateGithubUrl(
        url: string,
        token?: string,
    ): Promise<boolean> {
        try {
            const headers: any = {
                "User-Agent": "NextJS-CLI",
            };

            if (token) {
                headers["Authorization"] = `token ${token}`;
            }

            const response = await axios.head(url, {
                headers,
                timeout: 5000,
            });

            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * Valide si un nom de projet est valide
     */
    static validateProjectName(name: string): {
        valid: boolean;
        message?: string;
    } {
        if (!name || name.trim() === "") {
            return {
                valid: false,
                message: "Le nom du projet ne peut pas être vide",
            };
        }

        if (name.length < 2) {
            return {
                valid: false,
                message: "Le nom du projet doit contenir au moins 2 caractères",
            };
        }

        if (name.length > 50) {
            return {
                valid: false,
                message: "Le nom du projet ne peut pas dépasser 50 caractères",
            };
        }

        // Caractères autorisés : lettres, chiffres, tirets, underscores
        const validNameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!validNameRegex.test(name)) {
            return {
                valid: false,
                message:
                    "Le nom du projet ne peut contenir que des lettres, chiffres, tirets et underscores",
            };
        }

        return { valid: true };
    }

    /**
     * Valide si un chemin de destination est valide
     */
    static validateDestinationPath(path: string): boolean {
        try {
            // Vérifier si le chemin contient des caractères interdits
            // Sur Windows, les deux-points sont autorisés pour les lettres de lecteur
            const invalidChars = /[<>"|?*]/;
            return !invalidChars.test(path);
        } catch (error) {
            return false;
        }
    }
}
