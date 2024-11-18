import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const firebaseConfig = config.public.firebaseConfig

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)

  return {
    provide: {
      firebase: app,
      auth,
      db
    }
  }
})