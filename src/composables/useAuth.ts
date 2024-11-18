import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { ref } from 'vue'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const user = ref<User | null>(null)
  const loading = ref(true)

  const init = () => {
    onAuthStateChanged($auth, (newUser) => {
      user.value = newUser
      loading.value = false
    })
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password)
      return userCredential.user
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword($auth, email, password)
      return userCredential.user
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut($auth)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  return {
    user,
    loading,
    init,
    signIn,
    signUp,
    signOut
  }
}