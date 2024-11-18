import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

export const useSharing = () => {
  const { $db } = useNuxtApp()

  const shareList = async (listId: string, email: string) => {
    try {
      const listRef = doc($db, 'shoppingLists', listId)
      await updateDoc(listRef, {
        sharedWith: arrayUnion(email)
      })
    } catch (error) {
      console.error('Error sharing list:', error)
      throw error
    }
  }

  const removeSharing = async (listId: string, email: string) => {
    try {
      const listRef = doc($db, 'shoppingLists', listId)
      await updateDoc(listRef, {
        sharedWith: arrayRemove(email)
      })
    } catch (error) {
      console.error('Error removing sharing:', error)
      throw error
    }
  }

  return {
    shareList,
    removeSharing
  }
}