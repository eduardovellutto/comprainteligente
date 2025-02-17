import { defineStore } from 'pinia'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  actions: {
    async signInWithGoogle() {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      
      try {
        this.loading = true
        const result = await signInWithPopup(auth, provider)
        this.user = result.user
        return result.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const auth = getAuth()
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})