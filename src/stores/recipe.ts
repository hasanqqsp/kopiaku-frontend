import { getRecipes } from '@/utils/api'
import { defineStore } from 'pinia'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Array<{
      id: string
      menuId: string
      name: string
      ingredients: Array<{
        stockId: string
        quantity: number
      }>
    }>,
    pageInfo: {
      hasNextPage: false,
      endCursor: null,
    },
    loading: false,
  }),

  actions: {
    async fetchRecipes({ first = 1000, where = null } = {}) {
      try {
        this.loading = true
        const data = await getRecipes({ first, where })

        this.recipes = data.nodes
        this.pageInfo = data.pageInfo
      } catch (err) {
        console.error('Error fetching recipes:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchNextRecipes() {
      if (!this.pageInfo.hasNextPage) return

      try {
        this.loading = true
        const data = await getRecipes({
          first: 10,
          after: this.pageInfo.endCursor,
        })

        this.recipes = [...this.recipes, ...data.nodes]
        this.pageInfo = data.pageInfo
      } catch (err) {
        console.error('Error fetching more recipes:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
