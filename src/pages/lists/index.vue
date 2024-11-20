<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Minhas Listas de Compras</h1>
      <button
        @click="showNewListModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Nova Lista
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="list in lists"
        :key="list.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ list.name }}</h3>
          <span 
            class="px-2 py-1 text-xs rounded-full"
            :class="list.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
          >
            {{ list.completed ? 'Finalizada' : 'Em andamento' }}
          </span>
        </div>
        
        <div class="text-sm text-gray-500 mb-4">
          Criada: {{ formatDate(list.createdAt) }}
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-gray-900 font-medium">
            {{ list.items?.length || 0 }} items
          </span>
          <NuxtLink
            :to="`/lists/${list.id}`"
            class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Visualizar Itens →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- New List Modal -->
    <div v-if="showNewListModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Shopping List</h3>
        <form @submit.prevent="createNewList">
          <input
            v-model="newListName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="List Name"
            required
          />
          <div class="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              @click="showNewListModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const { getUserLists, createList } = useShoppingLists()
const lists = ref([])
const showNewListModal = ref(false)
const newListName = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    lists.value = await getUserLists()
  } catch (error) {
    console.error('Error fetching lists:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return format(timestamp.toDate(), 'dd/MMM/yyyy')
}

const createNewList = async () => {
  try {
    await createList(newListName.value)
    lists.value = await getUserLists()
    showNewListModal.value = false
    newListName.value = ''
  } catch (error) {
    console.error('Error creating list:', error)
  }
}
</script>