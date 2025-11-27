import { fetchPresences } from '@/utils/api'
import { defineStore } from 'pinia'

export const usePresenceStore = defineStore('presence', {
  state: (): {
    presences: Array<{
      id: string
      userId: string
      imageUrl: string
      checkInTime: string
      validated: boolean
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor: string | null
      startCursor: string | null
    } | null
    totalCount: number
    loading: boolean
    error: Error | null
  } => ({
    presences: [],
    pageInfo: null,
    totalCount: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPresences(
      { first = 10, after = null }: { first: number; after: string | null } = {
        first: 10,
        after: null,
      },
    ) {
      this.loading = true
      this.error = null

      try {
        const data = await fetchPresences({ first, after })

        this.presences = data.nodes
        this.pageInfo = data.pageInfo
        this.totalCount = data.totalCount
      } catch (err: unknown) {
        this.error = err as Error
        console.error('fetchPresences error:', err)
      } finally {
        this.loading = false
      }
    },

    async nextPage() {
      if (!this.pageInfo?.hasNextPage) return

      await this.fetchPresences({
        first: 10,
        after: this.pageInfo.endCursor,
      })
    },

    async prevPage() {
      if (!this.pageInfo?.hasPreviousPage) return

      await this.fetchPresences({
        first: 10,
        after: this.pageInfo.startCursor,
      })
    },
  },
})
