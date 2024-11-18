<template>
  <div>
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-indigo-600 font-semibold text-xl">SmartList</span>
            </NuxtLink>
          </div>
          <div class="flex items-center" v-if="user">
            <NuxtLink 
              to="/lists" 
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              My Lists
            </NuxtLink>
            <NuxtLink 
              to="/analytics" 
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Analytics
            </NuxtLink>
            <button 
              @click="handleSignOut" 
              class="ml-4 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { user, signOut } = useAuth()
const router = useRouter()

const handleSignOut = async () => {
  try {
    await signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>