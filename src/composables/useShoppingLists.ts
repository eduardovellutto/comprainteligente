import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore'

export const useShoppingLists = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()

  const createList = async (name: string) => {
    if (!user.value) throw new Error('User not authenticated')
    
    try {
      const listRef = await addDoc(collection($db, 'shoppingLists'), {
        name,
        userId: user.value.uid,
        items: [],
        createdAt: serverTimestamp(),
        totalAmount: 0,
        completed: false,
        sharedWith: []
      })
      return listRef.id
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const addItemToList = async (listId: string, item: {
    name: string
    quantity: number
    purchased?: boolean
    unitPrice?: number
  }) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const listRef = doc($db, 'shoppingLists', listId)
      await updateDoc(listRef, {
        items: arrayUnion({
          ...item,
          id: crypto.randomUUID(),
          purchased: false,
          unitPrice: 0,
          addedAt: serverTimestamp()
        })
      })
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const updateItemInList = async (
    listId: string,
    itemId: string,
    updates: {
      purchased?: boolean
      unitPrice?: number
      quantity?: number
    }
  ) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const listRef = doc($db, 'shoppingLists', listId)
      const listDoc = await getDoc(listRef)
      const items = listDoc.data()?.items || []
      
      const itemIndex = items.findIndex((item: any) => item.id === itemId)
      if (itemIndex === -1) throw new Error('Item not found')
      
      items[itemIndex] = { ...items[itemIndex], ...updates }
      
      await updateDoc(listRef, { 
        items,
        lastUpdated: serverTimestamp()
      })
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const getUserLists = async () => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const q = query(
        collection($db, 'shoppingLists'),
        where('userId', '==', user.value.uid)
      )
      const sharedQ = query(
        collection($db, 'shoppingLists'),
        where('sharedWith', 'array-contains', user.value.email)
      )

      const [ownedLists, sharedLists] = await Promise.all([
        getDocs(q),
        getDocs(sharedQ)
      ])

      const owned = ownedLists.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isOwner: true
      }))

      const shared = sharedLists.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isOwner: false
      }))

      return [...owned, ...shared].sort((a, b) => 
        b.createdAt?.toMillis() - a.createdAt?.toMillis()
      )
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const calculateTotal = async (listId: string) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const listRef = doc($db, 'shoppingLists', listId)
      const listDoc = await getDoc(listRef)
      const items = listDoc.data()?.items || []
      
      const total = items.reduce((acc: number, item: any) => {
        return acc + (item.unitPrice * item.quantity)
      }, 0)

      await updateDoc(listRef, {
        totalAmount: total,
        completed: true,
        completedAt: serverTimestamp()
      })

      return total
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const deleteList = async (listId: string) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const listRef = doc($db, 'shoppingLists', listId)
      const listDoc = await getDoc(listRef)
      
      if (listDoc.data()?.userId !== user.value.uid) {
        throw new Error('Not authorized to delete this list')
      }

      await deleteDoc(listRef)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  return {
    createList,
    addItemToList,
    updateItemInList,
    getUserLists,
    calculateTotal,
    deleteList
  }
}