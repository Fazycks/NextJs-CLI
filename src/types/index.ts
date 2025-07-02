export interface User {
    id: string;
    username: string;
    email: string;
    hasPrivateAccess: boolean;
    githubToken?: string;
}

export interface Repository {
    name: string;
    url: string;
    description: string;
    isPrivate: boolean;
    requiresAuth: boolean;
}

export interface Component {
    name: string;
    displayName: string;
    description: string;
    category: string;
    files: ComponentFile[];
    dependencies?: string[];
    devDependencies?: string[];
    isPrivate: boolean;
    requiresAuth: boolean;
}

export interface ComponentFile {
    path: string;
    content: string;
    type: "file" | "directory";
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    message: string;
}

export interface CloneOptions {
    repository: Repository;
    targetPath: string;
    user?: User;
}

export interface AddComponentOptions {
    component: Component;
    targetPath: string;
    user?: User;
    packageManager?: string;
}

export interface ProjectPreferences {
    packageManager: "npm" | "pnpm" | "yarn" | "bun";
    installDependencies: boolean;
}
