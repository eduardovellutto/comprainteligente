<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/register" class="text-sm text-indigo-600 hover:text-indigo-500">
            Don't have an account? Register
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  
  try {
    await signIn(email.value, password.value)
    router.push('/lists')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>