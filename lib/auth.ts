export interface User {
  id: string
  email: string
  name: string
  role: "admin"
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Mock authentication for demo - replace with MongoDB integration
let currentUser: User | null = null
const users: User[] = [
  {
    id: "1",
    email: "admin@leoni.com",
    name: "Administrateur Leoni",
    role: "admin",
    createdAt: new Date(),
  },
]

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = users.find((u) => u.email === credentials.email)
    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" }
    }

    const validPassword = user.email === "admin@leoni.com" ? "admin123" : "admin123"
    if (credentials.password !== validPassword) {
      return { success: false, error: "Mot de passe incorrect" }
    }

    currentUser = user
    return { success: true, user }
  },

  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validation
    if (data.password !== data.confirmPassword) {
      return { success: false, error: "Les mots de passe ne correspondent pas" }
    }

    if (data.password.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" }
    }

    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: "Cet email est déjà utilisé" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: "admin",
      createdAt: new Date(),
    }

    users.push(newUser)
    return { success: true, user: newUser }
  },

  async getCurrentUser(): Promise<User | null> {
    return currentUser
  },

  async logout(): Promise<void> {
    currentUser = null
  },
}
