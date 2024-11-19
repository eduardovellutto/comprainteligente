import { defineStore } from 'pinia'
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email
  },

  actions: {
    async init() {
      const { $auth } = useNuxtApp()
      
      // Set up auth state listener
      onAuthStateChanged($auth, (user) => {
        this.user = user
        this.loading = false
      })
    },

    async signInWithGoogle() {
      const { $auth } = useNuxtApp()
      this.error = null
      
      try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup($auth, provider)
        this.user = result.user
        return result.user
      } catch (error: any) {
        console.error('Error signing in:', error)
        this.error = this.getErrorMessage(error.code)
        throw error
      }
    },

    async signOut() {
      const { $auth } = useNuxtApp()
      
      try {
        await firebaseSignOut($auth)
        this.user = null
        this.error = null
        navigateTo('/login')
      } catch (error: any) {
        this.error = this.getErrorMessage(error.code)
        throw error
      }
    },

    getErrorMessage(code: string): string {
      switch (code) {
        case 'auth/popup-blocked':
          return 'Pop-up was blocked by your browser. Please enable pop-ups and try again.'
        case 'auth/cancelled-popup-request':
          return 'Authentication cancelled. Please try again.'
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection.'
        case 'auth/unauthorized-domain':
          return 'This domain is not authorized for Google sign-in. Please contact support.'
        default:
          return 'An error occurred. Please try again.'
      }
    }
  }
})