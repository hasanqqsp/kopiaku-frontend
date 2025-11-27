// src/stores/stock.ts
import { fetchStocks } from '@/utils/api'
import { defineStore } from 'pinia'

export const useStockStore = defineStore('stock', {
  state: (): {
    stocks: Array<{
      id: string
      itemName: string
      quantity: number
      unit: string
      notificationThreshold: number
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    } | null
    loading: boolean
  } => ({
    stocks: [],
    pageInfo: null,
    loading: false,
  }),

  actions: {
    async loadStocks({ first = 10, after = null, where = null } = {}) {
      try {
        this.loading = true
        const result = await fetchStocks({ first, after, where })

        if (after && this.stocks.length > 0) {
          this.stocks = [...this.stocks, ...result.nodes]
        } else {
          this.stocks = result.nodes
        }

        this.pageInfo = result.pageInfo
      } catch (e) {
        console.error('Error loading stocks', e)
      } finally {
        this.loading = false
      }
    },
  },
})
