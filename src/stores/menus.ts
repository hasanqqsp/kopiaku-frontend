import { getMenus } from '@/utils/api'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menuStore', {
  state: (): {
    menus: Array<{
      id: string
      name: string
      description: string
      price: number
      imageUrl: string | null
      category: string
      isAvailable: boolean
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null
      endCursor: string | null
    }
    totalCount: number
    isLoading: boolean
    defaultPageSize: number
  } => ({
    menus: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    totalCount: 0,
    isLoading: false,
    defaultPageSize: 10,
  }),

  actions: {
    // LOAD AWAL
    async fetchMenus(params: { first?: number; where?: unknown; order?: unknown } = {}) {
      this.isLoading = true
      try {
        const data = await getMenus({
          first: params.first ?? this.defaultPageSize,
          where: params.where ?? null,
          order: params.order ?? null,
        })

        this.menus = data.nodes
        this.pageInfo = data.pageInfo
        this.totalCount = data.totalCount
      } finally {
        this.isLoading = false
      }
    },

    // NEXT PAGE
    async fetchNextPage() {
      if (!this.pageInfo.hasNextPage) return

      this.isLoading = true
      try {
        const data = await getMenus({
          first: this.defaultPageSize,
          after: this.pageInfo.endCursor,
        })

        // replace nodes — atau concat (pilih salah)
        // this.menus = [...this.menus, ...data.nodes]
        this.menus = data.nodes

        this.pageInfo = data.pageInfo
        this.totalCount = data.totalCount
      } finally {
        this.isLoading = false
      }
    },

    // PREVIOUS PAGE
    async fetchPreviousPage() {
      if (!this.pageInfo.hasPreviousPage) return

      this.isLoading = true
      try {
        const data = await getMenus({
          last: this.defaultPageSize,
          before: this.pageInfo.startCursor,
        })

        this.menus = data.nodes
        this.pageInfo = data.pageInfo
        this.totalCount = data.totalCount
      } finally {
        this.isLoading = false
      }
    },
  },
})
