<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Welcome to SmartList</h1>
    <p class="text-xl text-gray-600 mb-8">Your intelligent shopping companion</p>
    
    <div v-if="!user" class="space-x-4">
      <NuxtLink
        to="/login"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign In
      </NuxtLink>
      <NuxtLink
        to="/register"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
      >
        Register
      </NuxtLink>
    </div>
    
    <div v-else>
      <NuxtLink
        to="/lists"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        View My Lists
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
</script>