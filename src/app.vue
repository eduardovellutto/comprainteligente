<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { init } = useAuth()
onMounted(() => {
  init()
})
</script>