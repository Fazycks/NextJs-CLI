import * as fs from "fs-extra";
import * as path from "path";
import { Component, Repository, User } from "../types";

interface Config {
    repositories: Repository[];
    users: User[];
    components: Component[];
}

export class ConfigService {
    private static configPath = path.join(__dirname, "../../config.json");
    private static _config: Config | null = null;

    /**
     * Charge la configuration depuis le fichier
     */
    static async loadConfig(): Promise<Config> {
        if (this._config) {
            return this._config;
        }

        try {
            const configExists = await fs.pathExists(this.configPath);
            if (!configExists) {
                throw new Error("Fichier de configuration non trouvé");
            }

            const configData = await fs.readJson(this.configPath);
            this._config = configData;
            return this._config!;
        } catch (error) {
            throw new Error(
                `Erreur lors du chargement de la configuration: ${error}`,
            );
        }
    }

    /**
     * Récupère tous les utilisateurs depuis la configuration
     */
    static async getUsers(): Promise<User[]> {
        const config = await this.loadConfig();
        return config.users;
    }

    /**
     * Récupère tous les dépôts depuis la configuration
     */
    static async getRepositories(): Promise<Repository[]> {
        const config = await this.loadConfig();
        return config.repositories;
    }

    /**
     * Récupère tous les composants depuis la configuration
     */
    static async getComponents(): Promise<Component[]> {
        const config = await this.loadConfig();
        return config.components || [];
    }

    /**
     * Sauvegarde la configuration
     */
    static async saveConfig(config: Config): Promise<void> {
        try {
            await fs.writeJson(this.configPath, config, { spaces: 2 });
            this._config = config;
        } catch (error) {
            throw new Error(`Erreur lors de la sauvegarde: ${error}`);
        }
    }

    /**
     * Ajoute un nouvel utilisateur
     */
    static async addUser(user: User): Promise<void> {
        const config = await this.loadConfig();
        config.users.push(user);
        await this.saveConfig(config);
    }

    /**
     * Ajoute un nouveau dépôt
     */
    static async addRepository(repository: Repository): Promise<void> {
        const config = await this.loadConfig();
        config.repositories.push(repository);
        await this.saveConfig(config);
    }

    /**
     * Ajoute un nouveau composant
     */
    static async addComponent(component: Component): Promise<void> {
        const config = await this.loadConfig();
        if (!config.components) {
            config.components = [];
        }
        config.components.push(component);
        await this.saveConfig(config);
    }
}
