import * as fs from "fs-extra";
import * as path from "path";
import { Component } from "../types";

export class ComponentService {
    // Base de données fictive des composants/templates
    private static components: Component[] = [
        {
            name: "nextjs-clean",
            displayName: "NextJS Clean Setup",
            description:
                "Configuration NextJS propre avec TypeScript et Tailwind CSS",
            category: "setup",
            isPrivate: false,
            requiresAuth: false,
            dependencies: [
                "tailwindcss",
                "@types/node",
                "@types/react",
                "@types/react-dom",
            ],
            devDependencies: ["autoprefixer", "postcss"],
            files: [
                {
                    path: "tailwind.config.js",
                    type: "file",
                    content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
                },
                {
                    path: "postcss.config.js",
                    type: "file",
                    content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
                },
                {
                    path: "app/globals.css",
                    type: "file",
                    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`,
                },
            ],
        },
        {
            name: "auth-system",
            displayName: "Authentication System",
            description: "Système d'authentification complet avec NextAuth.js",
            category: "auth",
            isPrivate: true,
            requiresAuth: true,
            dependencies: ["next-auth", "@next-auth/prisma-adapter", "prisma"],
            devDependencies: ["@types/bcryptjs"],
            files: [
                {
                    path: "lib/auth.ts",
                    type: "file",
                    content: `import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Implémentez votre logique d'authentification ici
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  session: {
    strategy: 'jwt'
  }
}`,
                },
                {
                    path: "components/auth/LoginForm.tsx",
                    type: "file",
                    content: `'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/'
      })
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}`,
                },
            ],
        },
        {
            name: "ui-components",
            displayName: "UI Components Pack",
            description:
                "Pack de composants UI réutilisables avec Tailwind CSS",
            category: "ui",
            isPrivate: false,
            requiresAuth: false,
            dependencies: ["clsx", "tailwind-merge"],
            files: [
                {
                    path: "components/ui/Button.tsx",
                    type: "file",
                    content: `import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
            'bg-gray-600 text-white hover:bg-gray-700': variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
            'hover:bg-gray-100': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg'
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button`,
                },
                {
                    path: "components/ui/Card.tsx",
                    type: "file",
                    content: `import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  )
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardContent }`,
                },
                {
                    path: "lib/utils.ts",
                    type: "file",
                    content: `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
                },
            ],
        },
        {
            name: "database-setup",
            displayName: "Database Setup (Prisma)",
            description:
                "Configuration de base de données avec Prisma et PostgreSQL",
            category: "database",
            isPrivate: true,
            requiresAuth: true,
            dependencies: ["prisma", "@prisma/client"],
            devDependencies: ["prisma"],
            files: [
                {
                    path: "prisma/schema.prisma",
                    type: "file",
                    content: `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}`,
                },
                {
                    path: "lib/prisma.ts",
                    type: "file",
                    content: `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`,
                },
            ],
        },
    ];

    /**
     * Récupère tous les composants disponibles
     */
    static getAllComponents(): Component[] {
        return this.components;
    }

    /**
     * Récupère les composants publics
     */
    static getPublicComponents(): Component[] {
        return this.components.filter((comp) => !comp.isPrivate);
    }

    /**
     * Récupère les composants privés
     */
    static getPrivateComponents(): Component[] {
        return this.components.filter((comp) => comp.isPrivate);
    }

    /**
     * Récupère un composant par nom
     */
    static getComponentByName(name: string): Component | undefined {
        return this.components.find(
            (comp) =>
                comp.name.toLowerCase() === name.toLowerCase() ||
                comp.displayName.toLowerCase().includes(name.toLowerCase()),
        );
    }

    /**
     * Récupère les composants par catégorie
     */
    static getComponentsByCategory(category: string): Component[] {
        return this.components.filter(
            (comp) => comp.category.toLowerCase() === category.toLowerCase(),
        );
    }

    /**
     * Vérifie si un composant nécessite une authentification
     */
    static requiresAuthentication(component: Component): boolean {
        return component.requiresAuth || component.isPrivate;
    }

    /**
     * Installe un composant dans le projet courant
     */
    static async installComponent(
        component: Component,
        targetPath: string = process.cwd(),
    ): Promise<{ success: boolean; message: string }> {
        try {
            // Vérifier si nous sommes dans un projet NextJS
            const packageJsonPath = path.join(targetPath, "package.json");
            if (!(await fs.pathExists(packageJsonPath))) {
                return {
                    success: false,
                    message:
                        "Aucun package.json trouvé. Assurez-vous d'être dans un projet NextJS.",
                };
            }

            const packageJson = await fs.readJson(packageJsonPath);
            if (
                !packageJson.dependencies?.next &&
                !packageJson.devDependencies?.next
            ) {
                return {
                    success: false,
                    message:
                        "Ce n'est pas un projet NextJS. NextJS n'est pas détecté dans les dépendances.",
                };
            }

            // Créer les fichiers du composant
            for (const file of component.files) {
                const filePath = path.join(targetPath, file.path);

                if (file.type === "directory") {
                    await fs.ensureDir(filePath);
                } else {
                    await fs.ensureDir(path.dirname(filePath));
                    await fs.writeFile(filePath, file.content, "utf8");
                }
            }

            return {
                success: true,
                message: `Composant ${component.displayName} installé avec succès!`,
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Erreur lors de l'installation: ${error.message}`,
            };
        }
    }

    /**
     * Récupère les catégories disponibles
     */
    static getCategories(): string[] {
        const categories = new Set(
            this.components.map((comp) => comp.category),
        );
        return Array.from(categories);
    }
}
