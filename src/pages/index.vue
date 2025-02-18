<template>
  <div>
    <div v-if="!authStore.user" class="text-center py-12">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Bem-vindo à Lista de Compras</h2>
      <p class="text-gray-600 mb-8">Organize suas compras de forma inteligente</p>
      <button
        @click="authStore.signInWithGoogle"
        class="bg-red-600 text-white px-6 sm:px-8 py-3 rounded-full hover:bg-red-700 transition shadow-lg flex items-center mx-auto space-x-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
        <span>Entrar com Google</span>
      </button>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Minhas Listas</h2>
        <button
          @click="showNewListModal = true"
          class="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-700 transition shadow-md flex items-center space-x-2"
        >
          <PlusIcon class="w-5 h-5" />
          <span>Nova Lista</span>
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregando suas listas...</p>
      </div>

      <div v-else-if="store.lists.length === 0" class="text-center py-12">
        <p class="text-gray-600 mb-4">Você ainda não tem nenhuma lista de compras.</p>
        <button
          @click="showNewListModal = true"
          class="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition shadow-lg"
        >
          Criar Primeira Lista
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="list in store.lists"
          :key="list.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div class="p-4">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ list.name }}</h3>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  list.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ list.isCompleted ? 'Finalizada' : 'Em Andamento' }}
              </span>
            </div>
            
            <div class="space-y-2 mb-4">
              <p class="text-sm text-gray-600">
                Itens: {{ list.items.length }}
              </p>
              <p class="text-sm text-gray-600">
                Total: R$ {{ list.total?.toFixed(2) || '0.00' }}
              </p>
              <p class="text-sm text-gray-600">
                Criada em: {{ new Date(list.createdAt.seconds * 1000).toLocaleDateString('pt-BR') }}
              </p>
            </div>

            <NuxtLink
              :to="'/list/' + list.id"
              class="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
            >
              {{ list.isCompleted ? 'Visualizar Lista' : 'Continuar Comprando' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nova Lista -->
    <TransitionRoot appear :show="showNewListModal" as="template">
      <Dialog as="div" @close="showNewListModal = false" class="relative z-10">
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
                  Criar Nova Lista
                </DialogTitle>

                <form @submit.prevent="createNewList" class="mt-4">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nome da Lista</label>
                      <input
                        v-model="newList.name"
                        type="text"
                        placeholder="Ex: Compras do Mês"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Itens</label>
                      <div v-for="(item, index) in newList.items" :key="index" class="flex gap-2 mb-2">
                        <input
                          v-model="item.name"
                          type="text"
                          placeholder="Nome do Item"
                          class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                        <input
                          v-model="item.quantity"
                          type="number"
                          min="1"
                          placeholder="Qtd"
                          class="w-20 rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                        <button
                          type="button"
                          @click="removeItem(index)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        @click="addItem"
                        class="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2"
                      >
                        <PlusIcon class="w-5 h-5" />
                        <span>Adicionar Item</span>
                      </button>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      @click="showNewListModal = false"
                      class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition shadow-md"
                    >
                      Criar Lista
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
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import { useShoppingListStore } from '~/stores/shoppingList'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const store = useShoppingListStore()
const loading = ref(true)
const showNewListModal = ref(false)
const newList = ref({
  name: '',
  items: [{ name: '', quantity: 1 }]
})

const addItem = () => {
  newList.value.items.push({ name: '', quantity: 1 })
}

const removeItem = (index) => {
  newList.value.items.splice(index, 1)
  if (newList.value.items.length === 0) {
    addItem()
  }
}

const createNewList = async () => {
  try {
    const listId = await store.createList(newList.value.name, newList.value.items)
    showNewListModal.value = false
    newList.value = {
      name: '',
      items: [{ name: '', quantity: 1 }]
    }
    await store.getLists()
    router.push(`/list/${listId}`)
  } catch (error) {
    console.error('Erro ao criar lista:', error)
  }
}

onMounted(async () => {
  if (authStore.user) {
    try {
      await store.getLists()
    } catch (error) {
      console.error('Erro ao carregar listas:', error)
    } finally {
      loading.value = false
    }
  }
})
</script>