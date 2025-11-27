import { getTransactionsAPI } from '@/utils/api'
import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transactionStore', {
  state: () => ({
    transactions: [],
    pageInfo: null,
    totalCount: 0,
    loading: false,
  }),

  actions: {
    async fetchTransactions(params = {}) {
      this.loading = true
      try {
        const data = await getTransactionsAPI(params)
        this.transactions = data.nodes
        this.pageInfo = data.pageInfo
        this.totalCount = data.totalCount
      } finally {
        this.loading = false
      }
    },
  },
})
