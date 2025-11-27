import { fetchUsers } from '@/utils/api'
import { defineStore } from 'pinia'

type Employee = {
  id: string
  name: string
  username: string
  email: string
  role: string
  contact: string
  isActive: boolean
  profilePictureUrl: string
}

type PageInfo = {
  endCursor: string | null
  hasNextPage: boolean
}

export const useEmployeeStore = defineStore('employee', {
  state: (): {
    employees: Employee[]
    pageInfo: PageInfo | null
    loading: boolean
    error: string | null
  } => ({
    employees: [],
    pageInfo: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUsers(first: number = 10, after: string | null = null) {
      this.loading = true
      try {
        const data: { nodes: Employee[]; pageInfo: PageInfo } = await fetchUsers({ first, after })

        this.employees = data.nodes.filter((user) => user.role !== 'Admin')
        this.pageInfo = data.pageInfo
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err)
        console.error('Users fetch error:', err)
      } finally {
        this.loading = false
      }
    },

    async loadNextPage() {
      if (!this.pageInfo?.hasNextPage) return

      await this.fetchUsers(10, this.pageInfo.endCursor)
    },
  },
})
