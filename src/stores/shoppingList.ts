import { defineStore } from 'pinia'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore'

export const useShoppingListStore = defineStore('shoppingList', {
  state: () => ({
    lists: [],
    currentList: null,
    loading: false,
    error: null
  }),

  actions: {
    async createList(listName, items) {
      const { $firebase } = useNuxtApp()
      const { user } = useAuthStore()

      try {
        this.loading = true
        const docRef = await addDoc(collection($firebase.db, 'shoppingLists'), {
          userId: user.uid,
          name: listName,
          items,
          createdAt: Timestamp.now(),
          isCompleted: false,
          total: 0
        })
        return docRef.id
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getLists() {
      const { $firebase } = useNuxtApp()
      const { user } = useAuthStore()

      try {
        this.loading = true
        const q = query(
          collection($firebase.db, 'shoppingLists'),
          where('userId', '==', user.uid)
        )
        const querySnapshot = await getDocs(q)
        this.lists = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateList(listId, data) {
      const { $firebase } = useNuxtApp()

      try {
        this.loading = true
        const listRef = doc($firebase.db, 'shoppingLists', listId)
        await updateDoc(listRef, data)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})