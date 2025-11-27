<template>
  <div class="bg-gray-50 min-h-screen flex">
    <!-- Mobile Header -->
    <div
      class="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 flex items-center justify-between p-4"
    >
      <button @click="toggleSidebar" class="p-2 rounded-lg text-primary-blue">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-xl font-bold">Coffee Recipes</h1>
      <div class="w-10"></div>
    </div>

    <!-- Sidebar -->
    <SidebarComponent />
    <!-- Main Content -->
    <main class="flex-1 p-6 mt-16 md:mt-0">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 class="text-3xl font-bold mb-4 md:mb-0">Coffee Recipes</h2>
        <button
          @click="openAdd"
          class="bg-primary-blue text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-90 shadow-md"
        >
          Add New Recipe
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="menu in menus"
          :key="menu.id"
          class="recipe-card bg-white rounded-xl shadow-md p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-900">{{ menu.name }}</h3>
            <div class="flex space-x-2">
              <button
                @click="openEdit(menu.id)"
                class="text-primary-blue hover:text-primary-blue/80"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button @click="deleteRecipe(menu.id)" class="text-red-600 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-4">{{ menu.description || 'No description' }}</p>
          <div class="border-t pt-4 border-gray-200">
            <h4 class="font-semibold text-sm text-gray-700 mb-2">Ingredients:</h4>
            <ul class="space-y-1">
              <li
                v-for="(ingredient, idx) in recipes.find((r) => r.menuId === menu.id)
                  ?.ingredients || []"
                :key="idx"
                class="text-sm text-gray-600 flex justify-between"
              >
                <span>{{ findStockById(ingredient.stockId)?.itemName }}</span>
                <span class="font-semibold"
                  >{{ ingredient.quantity }}
                  {{ findStockById(ingredient.stockId)?.unit || 'g' }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
        <h3 class="text-2xl font-bold mb-4">{{ modalTitle }}</h3>
        <form @submit.prevent="save">
          <fieldset :disabled="isSaving || !!editingId" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Recipe Name</label>
              <input
                v-model.trim="form.name"
                type="text"
                required
                :class="[
                  'w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue',
                  isSaving && 'opacity-50 cursor-not-allowed',
                ]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea
                v-model.trim="form.description"
                rows="2"
                class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              <div v-if="form.imageUrl" class="mt-3">
                <div class="relative inline-block">
                  <img
                    :src="form.imageUrl"
                    alt="Preview"
                    class="max-h-40 rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    @click="clearImage"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Click × to remove image</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <input
                v-model.trim="form.category"
                type="text"
                placeholder="e.g., Espresso"
                class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Price</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </fieldset>

          <div>
            <label class="block text-sm font-medium mb-4">Ingredients</label>
            <div class="space-y-3 mb-3">
              <div v-for="(row, idx) in ingredientRows" :key="idx" class="flex space-x-2">
                <div class="relative flex-1">
                  <select
                    v-model="row.ingredient"
                    class="appearance-none w-full p-2 pr-8 border border-gray-200 rounded-lg"
                    required
                  >
                    <option value="">Select Ingredient</option>
                    <option v-for="stock in stocks" :key="stock.id" :value="stock.id">
                      {{ stock.itemName }} ({{ stock.unit || 'g' }})
                    </option>
                  </select>
                  <svg
                    class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <input
                  v-model.number="row.quantity"
                  type="number"
                  step="0.01"
                  placeholder="Qty"
                  class="w-24 p-2 border border-gray-200 rounded-lg"
                  required
                />
                <button
                  type="button"
                  @click="removeRow(idx)"
                  class="text-red-600 hover:text-red-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addRow"
              class="text-primary-blue hover:underline font-semibold"
            >
              + Add Ingredient
            </button>
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              :disabled="isSaving"
              :class="[
                'flex-1 py-3 rounded-lg font-bold transition-all duration-200',
                isSaving
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-primary-blue text-white hover:bg-opacity-90',
              ]"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg
                  v-if="isSaving"
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{{ isSaving ? 'Saving...' : 'Save Recipe' }}</span>
              </div>
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="isSaving"
              :class="[
                'flex-1 py-3 rounded-lg font-bold',
                isSaving
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              ]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import { reactive, ref, computed, onMounted } from 'vue'

import { useSidebarStore } from '@/stores/sidebar'

import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/menus'
import { useRecipeStore } from '@/stores/recipe'
import { useStockStore } from '@/stores/stocks'
import { createMenu, createRecipe, deleteMenu } from '@/utils/api'
import { toast } from 'vue3-toastify'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore
const toggleSidebar = () => setSidebarVisibility(!showSidebar)

const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)
const recipeStore = useRecipeStore()
const { recipes } = storeToRefs(recipeStore)
const stockStore = useStockStore()
const { stocks } = storeToRefs(stockStore)

const showModal = ref(false)
const editingId = ref<string | null>(null)
const isSaving = ref(false)
const form = reactive({
  name: '',
  description: '',
  imageUrl: '',
  category: '',
  price: 0,
})

const selectedImageFile = ref<File | null>(null)
let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null

interface IngredientRow {
  ingredient: string
  quantity: number | ''
}
const ingredientRows = ref<IngredientRow[]>([])

const modalTitle = computed(() => (editingId.value ? 'Edit Recipe' : 'Add Recipe'))

function findStockById(id: string) {
  return stocks.value.find((s) => s.id === id)
}
// Image preview handler
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      target.value = ''
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      target.value = ''
      return
    }

    // Store the file for upload
    selectedImageFile.value = file

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      form.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    form.imageUrl = ''
    selectedImageFile.value = null
  }
}

// Clear image preview
function clearImage() {
  form.imageUrl = ''
  selectedImageFile.value = null
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

function addRow() {
  ingredientRows.value.push({ ingredient: '', quantity: '' })
}
function removeRow(idx: number) {
  ingredientRows.value.splice(idx, 1)
}
function openAdd() {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.imageUrl = ''
  form.category = ''
  form.price = 0
  selectedImageFile.value = null
  ingredientRows.value = [{ ingredient: '', quantity: '' }]
  showModal.value = true
}
function openEdit(id: string) {
  editingId.value = id
  const r = recipes.value.find((rec) => rec.menuId === id)
  const menu = menus.value.find((m) => m.id === id)
  form.name = menu?.name || ''
  form.description = menu?.description || ''
  form.category = menu?.category || ''
  form.price = menu?.price || 0
  form.imageUrl = '' // Reset image URL for edit mode
  selectedImageFile.value = null

  ingredientRows.value = (
    r?.ingredients as Array<{
      stockId: string
      quantity: number
    }>
  ).map((ingredient) => ({
    ingredient: ingredient.stockId,
    quantity: Number(ingredient.quantity),
  }))
  if (!ingredientRows.value.length) addRow()
  showModal.value = true
}
function save() {
  // Prevent multiple submissions
  if (isSaving.value) return

  // Clear any existing debounce timer
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer)
  }

  if (!form.name || !form.price) {
    alert('Please fill in required fields (name and price)')
    return
  }

  const id = editingId.value
  if (id) {
    // Handle edit case - to be implemented
    console.log('Edit functionality not yet implemented')
    return
  }

  // Set saving state and debounce to prevent rapid submissions
  isSaving.value = true

  saveDebounceTimer = setTimeout(() => {
    executeSave()
  }, 300) // 300ms debounce
}

function executeSave() {
  // Create new menu
  const defaultImage = new File([''], 'default.jpg', { type: 'image/jpeg' })

  createMenu({
    menu: {
      name: form.name,
      description: form.description,
      category: form.category || 'Coffee',
      price: Number(form.price),
    },
    image: selectedImageFile.value || defaultImage,
  })
    .then((response) => {
      closeModal()
      useMenuStore().fetchMenus()
      createRecipe(
        response.id,
        ingredientRows.value.map((row) => ({
          stockId: row.ingredient,
          quantity: Number(row.quantity),
        })),
      )
        .then(() => {
          useRecipeStore().fetchRecipes()
          toast.success('Menu and recipe created successfully!')
        })
        .catch(() => {
          deleteMenu(response.id)
          toast.error('Error creating menu')
        })
        .finally(() => {
          isSaving.value = false
        })
    })
    .catch(() => {
      toast.error('Error creating menu')
      isSaving.value = false
    })
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const deleteDialog = createConfirmDialog(ConfirmDialog, {
  content: 'Are you sure you want to delete this menu? This action cannot be undone.',
})

function deleteRecipe(id: string) {
  deleteDialog.reveal()
  deleteDialog.onConfirm(() => {
    deleteMenu(id)
      .then(() => {
        deleteRecipe(recipes.value.find((r) => r.menuId === id)?.id || '')
        useMenuStore().fetchMenus()
        useRecipeStore().fetchRecipes()
        toast.success('Menu deleted successfully!')
      })
      .catch(() => {
        toast.error('Error deleting menu')
      })
      .finally(() => {
        deleteDialog.close()
      })
  })
}
function closeModal() {
  // Clear any pending save timer
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer)
    saveDebounceTimer = null
  }
  showModal.value = false
  isSaving.value = false
}

onMounted(() => {
  stockStore.loadStocks()
  menuStore.fetchMenus()
  recipeStore.fetchRecipes()
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #1c0cdc;
  color: white;
  transition: transform 0.3s;
}
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 50;
    transform: translateX(-100%);
  }
  .sidebar.show {
    transform: translateX(0);
  }
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
  color: inherit;
  text-decoration: none;
}
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
.recipe-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
