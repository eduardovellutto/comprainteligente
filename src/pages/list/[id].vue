<template>
  <div class="pb-safe">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando lista...</p>
    </div>

    <template v-else>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">{{ list.name }}</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-if="!list.isCompleted"
            @click="finishShopping"
            class="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-green-700 transition shadow-md flex items-center space-x-2 text-sm sm:text-base"
          >
            <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Finalizar Compras</span>
          </button>
          <NuxtLink
            to="/"
            class="bg-gray-100 px-4 sm:px-6 py-2 rounded-full hover:bg-gray-200 transition flex items-center space-x-2 text-sm sm:text-base"
          >
            <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Voltar</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="p-3 sm:p-4">
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="(item, index) in list.items"
              :key="index"
              class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
              :class="{ 'bg-green-50': item.purchased }"
            >
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="checkbox"
                  v-model="item.purchased"
                  :disabled="list.isCompleted"
                  class="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  @change="updateSubtotal"
                />
                <div class="flex-1">
                  <p class="font-medium" :class="{ 'line-through text-gray-500': item.purchased }">
                    {{ item.name }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto ml-7 sm:ml-0">
                <div class="flex items-center space-x-2">
                  <input
                    v-model="item.quantity"
                    type="number"
                    min="1"
                    :disabled="list.isCompleted"
                    class="w-20 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    @change="updateSubtotal"
                  />
                  <span class="text-sm text-gray-600">un</span>
                </div>

                <div v-if="!list.isCompleted" class="flex items-center space-x-2 flex-1 sm:flex-none">
                  <div class="relative flex-1 sm:flex-none">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
                    <input
                      type="number"
                      v-model="item.price"
                      step="0.01"
                      placeholder="0,00"
                      class="pl-8 w-full sm:w-28 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      @input="updateSubtotal"
                    />
                  </div>
                  <button
                    @click="removeItem(index)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div v-if="!list.isCompleted" class="text-sm text-gray-600 ml-7 sm:ml-0">
                Total: R$ {{ (item.price * item.quantity || 0).toFixed(2) }}
              </div>
              <div v-else class="text-sm text-gray-600 ml-7 sm:ml-0">
                Preço: R$ {{ item.price?.toFixed(2) }} | Total: R$ {{ (item.price * item.quantity || 0).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!list.isCompleted" class="border-t border-gray-200 p-4">
          <button
            @click="showNewItemModal = true"
            class="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2"
          >
            <PlusIcon class="w-5 h-5" />
            <span>Adicionar Novo Item</span>
          </button>
        </div>

        <div class="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div class="space-y-1">
              <p class="text-sm text-gray-600">Total de Itens: {{ list.items.length }}</p>
              <p class="text-sm text-gray-600">Itens Comprados: {{ purchasedItemsCount }}</p>
            </div>
            <div class="text-right w-full sm:w-auto">
              <p class="text-sm text-gray-600">Subtotal</p>
              <p class="text-2xl font-bold text-gray-900">R$ {{ total.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Novo Item -->
    <TransitionRoot appear :show="showNewItemModal" as="template">
      <Dialog as="div" @close="showNewItemModal = false" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Adicionar Novo Item
                </DialogTitle>

                <form @submit.prevent="addNewItem" class="mt-4">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nome do Item</label>
                      <input
                        v-model="newItem.name"
                        type="text"
                        placeholder="Ex: Arroz"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Quantidade</label>
                      <input
                        v-model="newItem.quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      @click="showNewItemModal = false"
                      class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition shadow-md"
                    >
                      Adicionar
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { 
  PlusIcon, 
  CheckIcon, 
  ArrowLeftIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useShoppingListStore } from '~/stores/shoppingList'

const route = useRoute()
const store = useShoppingListStore()
const loading = ref(true)
const list = ref(null)
const showNewItemModal = ref(false)
const newItem = ref({
  name: '',
  quantity: 1,
  price: 0,
  purchased: false
})

const total = computed(() => {
  if (!list.value?.items) return 0
  return list.value.items.reduce((acc, item) => {
    if (item.purchased && item.price) {
      return acc + (item.price * item.quantity)
    }
    return acc
  }, 0)
})

const purchasedItemsCount = computed(() => {
  if (!list.value?.items) return 0
  return list.value.items.filter(item => item.purchased).length
})

const updateSubtotal = async () => {
  try {
    await store.updateList(route.params.id, {
      items: list.value.items,
      total: total.value
    })
  } catch (error) {
    console.error('Erro ao atualizar lista:', error)
  }
}

const addNewItem = async () => {
  list.value.items.push({
    ...newItem.value,
    price: 0,
    purchased: false
  })
  await updateSubtotal()
  showNewItemModal.value = false
  newItem.value = {
    name: '',
    quantity: 1,
    price: 0,
    purchased: false
  }
}

const removeItem = async (index) => {
  list.value.items.splice(index, 1)
  await updateSubtotal()
}

const finishShopping = async () => {
  try {
    await store.updateList(route.params.id, {
      isCompleted: true,
      total: total.value
    })
    list.value.isCompleted = true
  } catch (error) {
    console.error('Erro ao finalizar compras:', error)
  }
}

onMounted(async () => {
  try {
    await store.getLists()
    list.value = store.lists.find(l => l.id === route.params.id)
    if (!list.value) {
      throw new Error('Lista não encontrada')
    }
    loading.value = false
  } catch (error) {
    console.error('Erro ao carregar lista:', error)
  }
})
</script>

<style>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>