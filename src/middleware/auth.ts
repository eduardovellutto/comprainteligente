export default defineNuxtRouteMiddleware((to) => {
  const { user, loading } = useAuth()
  
  // Wait for auth to initialize
  if (loading.value) return
  
  // Redirect to login if not authenticated
  if (!user.value && to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
    return navigateTo('/login')
  }
  
  // Redirect to lists if authenticated and trying to access login/register
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/lists')
  }
})