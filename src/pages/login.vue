<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Smart Shopping List</h1>
        <p class="mt-2 text-gray-600">Sign in to manage your shopping lists</p>
      </div>

      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="error" class="mb-4 p-4 rounded-md bg-red-50">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <button
          @click="handleGoogleSignIn"
          :disabled="loading"
          class="w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium">
            {{ loading ? 'Signing in...' : 'Continue with Google' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const handleGoogleSignIn = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  
  try {
    await authStore.signInWithGoogle()
    router.push('/lists')
  } catch (err) {
    error.value = authStore.error || 'Failed to sign in. Please try again.'
  } finally {
    loading.value = false
  }
}

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/lists')
  }
})
</script>