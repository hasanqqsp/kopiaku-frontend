import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CheckIn {
  id: string
  userId: string
  imageUrl: string
  checkInTime: string
  validated: false
}
export const useCheckInStore = defineStore('checkIn', () => {
  const lastCheckIn = ref<CheckIn | null>(null)

  function setLastCheckIn(checkIn: CheckIn) {
    lastCheckIn.value = checkIn
  }

  return { lastCheckIn, setLastCheckIn }
})
