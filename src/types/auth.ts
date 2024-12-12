export interface AuthContextType {
    token: string | null
    isLoggedIn: boolean
    login: (token: string) => void
    logout: () => void
  }