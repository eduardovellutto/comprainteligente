export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize
  if (authStore.loading) return
  
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
    return navigateTo('/login')
  }
  
  // Redirect to lists if authenticated and trying to access login/register
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/lists')
  }
})