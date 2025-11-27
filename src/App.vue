<script setup lang="ts">
import '@/styles/main.css'
import { onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import 'vue3-toastify/dist/index.css'
const router = useRouter()
const route = useRoute()

// Replace this with your real auth check (Pinia/Vuex/cookie/session)
function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken')
}
function needsPhotoVerification(): boolean {
  return localStorage.getItem('needsPhotoVerification') === 'true'
}

onBeforeMount(() => {
  console.log('Auth check on route:', route.path)
  console.log('Is authenticated:', isAuthenticated())
  console.log('Needs photo verification:', needsPhotoVerification())
  if (isAuthenticated() && !needsPhotoVerification()) {
    if (route.path === '/login' || route.path === '/photoverification') {
      router.replace({ path: '/cashier' })
    }
    return
  }
  if (!isAuthenticated() && route.path !== '/login') {
    router.replace({ path: '/login' })
  } else if (isAuthenticated() && needsPhotoVerification() && route.path !== '/photoverification') {
    router.replace({ path: '/photoverification' })
  } else {
    if (isAuthenticated() && !needsPhotoVerification() && route.path === '/login') {
      router.replace({ path: '/cashier' })
    }
  }
})
</script>

<template>
  <RouterView />
  <DialogsWrapper />
</template>
