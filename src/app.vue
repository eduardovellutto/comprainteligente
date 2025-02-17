<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-red-600 shadow-md sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-lg sm:text-xl font-bold text-white">SMART SHOPPING</h1>
          <div v-if="authStore.user" class="flex items-center space-x-4">
            <span class="text-white text-sm hidden sm:inline">{{ authStore.user.email }}</span>
            <button @click="authStore.logout" class="text-sm text-white hover:text-gray-200 transition">
              Sair
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<style>
html {
  -webkit-tap-highlight-color: transparent;
}

@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
}
</style>