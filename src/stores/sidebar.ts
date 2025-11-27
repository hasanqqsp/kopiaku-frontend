import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const showSidebar = ref(true)
  function toggleSidebar() {
    setSidebarVisibility(!showSidebar.value)
  }

  function setSidebarVisibility(visible: boolean) {
    showSidebar.value = visible
  }

  return { showSidebar, toggleSidebar, setSidebarVisibility }
})
