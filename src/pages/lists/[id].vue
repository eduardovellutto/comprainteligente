<template>
  <div v-if="list" class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">{{ list.name }}</h1>
      <div class="space-x-2">
        <button
          v-if="!list.completed"
          @click="showAddItemModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Adicionar Item
        </button>
        <button
          v-if="!list.completed"
          @click="showSuggestionsModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
        >
          Sugestão IA
        </button>
        <button
          v-if="list.isOwner"
          @click="showShareModal = true"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Share List
        </button>
      </div>
    </div>

    <!-- Items List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="item in list.items" :key="item.id" class="px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <input
                type="checkbox"
                :checked="item.purchased"
                @change="togglePurchased(item)"
                :disabled="list.completed"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div>
                <p class="text-sm font-medium text-gray-900" :class="{ 'line-through': item.purchased }">
                  {{ item.name }}
                </p>
                <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div v-if="!list.completed">
                <input
                  type="number"
                  v-model="item.unitPrice"
                  @change="updatePrice(item)"
                  placeholder="Price"
                  class="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
                  step="0.01"
                  min="0"
                />
              </div>
              <p v-else class="text-sm font-medium text-gray-900">
                {{ formatCurrency(item.unitPrice * item.quantity) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Total and Complete Button -->
    <div v-if="!list.completed" class="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
      <div class="text-lg font-medium text-gray-900">
        Total: {{ formatCurrency(calculateCurrentTotal()) }}
      </div>
      <button
        @click="completeList"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
      >
        Finalizar Compra
      </button>
    </div>

    <div v-else class="bg-green-50 p-4 rounded-lg">
      <div class="text-lg font-medium text-green-900">
        Total: {{ formatCurrency(list.totalAmount) }}
      </div>
      <div class="text-sm text-green-700">
        Finalizada em {{ formatDate(list.completedAt) }}
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddItemModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Adicionar</h3>
        
        <div class="mb-4">
          <button
            @click="showScanner = !showScanner"
            class="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {{ showScanner ? 'Hide Scanner' : 'Scan Barcode' }}
          </button>
        </div>

        <BarcodeScanner
          v-if="showScanner"
          @scanned="handleBarcodeScan"
          class="mb-4"
        />

        <form @submit.prevent="addNewItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              v-model="newItem.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              v-model.number="newItem.quantity"
              type="number"
              required
              min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeAddItemModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Share List</h3>
        <form @submit.prevent="shareListWithUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              v-model="shareEmail"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter email address"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showShareModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Suggestions Modal -->
    <div v-if="showSuggestionsModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">AI Suggestions</h3>
        <div v-if="loading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Generating suggestions...</p>
        </div>
        <div v-else class="space-y-4">
          <ul class="space-y-2">
            <li
              v-for="(suggestion, index) in suggestions"
              :key="index"
              class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <span class="text-gray-900">{{ suggestion }}</span>
              <button
                @click="addSuggestedItem(suggestion)"
                class="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Adicionar Item
              </button>
            </li>
          </ul>
          <div class="flex justify-end">
            <button
              @click="showSuggestionsModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale';
// import { useAI } from '~/composables/useAI'
import { useSharing } from '~/composables/useSharing'
import { useNotifications } from '~/composables/useNotifications'
import { doc, onSnapshot, arrayUnion, updateDoc, Timestamp } from 'firebase/firestore'

const route = useRoute()
const { $db } = useNuxtApp()
const { user } = useAuth()

const list = ref(null)
const showAddItemModal = ref(false)
const showScanner = ref(false)
const showShareModal = ref(false)
const showSuggestionsModal = ref(false)
const shareEmail = ref('')
const suggestions = ref([])
const loading = ref(false)
const newItem = ref({
  name: '',
  quantity: 1
})

const { shareList } = useSharing()
// const { generateShoppingListSuggestion } = useAI()
const { requestPermission, setupMessageListener } = useNotifications()
const { addItemToList, updateItemInList, calculateTotal } = useShoppingLists()

onMounted(async () => {
  await loadList()
  await requestPermission()
  setupMessageListener()
})

const loadList = async () => {
  try {
    const docRef = doc($db, 'shoppingLists', route.params.id)
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        list.value = {
          id: doc.id,
          ...doc.data(),
          isOwner: doc.data().userId === user.value?.uid
        }
      }
    })

  } catch (error) {
    console.error(error)
  }

  if (unsubscribe) {
    // Move para fora da função loadList
    onUnmounted(() => {
      unsubscribe()
    })
  }
}

const handleBarcodeScan = async (barcode) => {
  newItem.value.name = `Product (${barcode})`
  showScanner.value = false
}

const shareListWithUser = async () => {
  try {
    await shareList(list.value.id, shareEmail.value)
    showShareModal.value = false
    shareEmail.value = ''
  } catch (error) {
    console.error('Error sharing list:', error)
  }
}

// const getSuggestions = async () => {
//   loading.value = true
//   try {
//     const result = await generateShoppingListSuggestion(list.value)
//     suggestions.value = result.split('\n').filter(Boolean)
//   } catch (error) {
//     console.error('Error getting suggestions:', error)
//   } finally {
//     loading.value = false
//   }
// }

const addSuggestedItem = (suggestion) => {
  newItem.value = {
    name: suggestion,
    quantity: 1
  }
  showSuggestionsModal.value = false
  showAddItemModal.value = true
}

const addNewItem = async () => {
  try {
    await addItemToList(list.value.id, newItem.value)
    closeAddItemModal()
  } catch (error) {
    console.error('Error adding item:', error)
  }
}

const closeAddItemModal = () => {
  showAddItemModal.value = false
  newItem.value = {
    name: '',
    quantity: 1
  }
  showScanner.value = false
}

const togglePurchased = async (item) => {
  try {
    await updateItemInList(list.value.id, item.id, {
      purchased: !item.purchased
    })
  } catch (error) {
    console.error('Error updating item:', error)
  }
}

const updatePrice = async (item) => {
  try {
    await updateItemInList(list.value.id, item.id, {
      unitPrice: parseFloat(item.unitPrice) || 0
    })
  } catch (error) {
    console.error('Error updating price:', error)
  }
}

const calculateCurrentTotal = () => {
  return list.value.items.reduce((total, item) => {
    return total + (parseFloat(item.unitPrice) || 0) * item.quantity
  }, 0)
}

const completeList = async () => {
  try {
    await calculateTotal(list.value.id)
  } catch (error) {
    console.error('Error completing list:', error)
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return format(timestamp.toDate(), 'PPP', { locale: ptBR });
}
</script>