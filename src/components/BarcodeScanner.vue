<template>
  <div class="relative">
    <video ref="video" class="w-full h-64 object-cover rounded-lg"></video>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-64 h-1 bg-red-500 opacity-50"></div>
    </div>
  </div>
</template>

<script setup>
import Quagga from 'quagga'

const emit = defineEmits(['scanned'])

onMounted(() => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: video.value,
      constraints: {
        facingMode: "environment"
      },
    },
    decoder: {
      readers: ["ean_reader", "ean_8_reader", "upc_reader"]
    }
  }, (err) => {
    if (err) {
      console.error('Error initializing Quagga:', err)
      return
    }
    Quagga.start()
  })

  Quagga.onDetected((result) => {
    emit('scanned', result.codeResult.code)
  })
})

onUnmounted(() => {
  Quagga.stop()
})
</script>