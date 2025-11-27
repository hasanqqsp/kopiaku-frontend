import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
  username: string
  email: string
  role: string
  contact: string
  isActive: boolean
  profilePictureUrl: string
}
export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  function setCurrentUser(user: User) {
    currentUser.value = user
  }

  return { currentUser, setCurrentUser }
})
