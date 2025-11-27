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
      <h1 class="text-xl font-bold">Stock Management</h1>
      <div class="w-10"></div>
    </div>

    <!-- Sidebar -->
    <SidebarComponent />

    <!-- Main Content -->
    <main class="flex-1 p-6 mt-16 md:mt-0">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 class="text-3xl font-bold mb-4 md:mb-0">Stock Management</h2>
        <div class="flex space-x-3">
          <button
            @click="openAdd"
            class="bg-primary-blue text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-90 shadow-md"
          >
            Add Ingredient
          </button>
          <button
            @click="exportCSV"
            class="bg-coffee text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-90 shadow-md"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="py-4 px-6 text-left font-semibold">Ingredient</th>
              <th class="py-4 px-6 text-left font-semibold">Current Stock</th>
              <th class="py-4 px-6 text-left font-semibold">Unit</th>
              <th class="py-4 px-6 text-left font-semibold">Status</th>
              <th class="py-4 px-6 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(stock, i) in stocks"
              :key="stock.id"
              class="border-b hover:bg-gray-50 border-gray-200"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            >
              <td class="py-4 px-6 font-medium">{{ stock.itemName }}</td>
              <td class="py-4 px-6">{{ stock.quantity.toLocaleString() }}</td>
              <td class="py-4 px-6">{{ stock.unit }}</td>
              <td class="py-4 px-6">
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="getStatus(stock.quantity, stock.notificationThreshold).color"
                >
                  {{ getStatus(stock.quantity, stock.notificationThreshold).text }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <button
                  @click="openEdit(stock.id)"
                  class="text-primary-blue hover:underline font-semibold mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deleteStock(stock.id)"
                  class="text-red-600 hover:underline font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="!stocks.length">
              <td colspan="5" class="py-6 px-6 text-center text-gray-500">No ingredients yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Modal -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 class="text-2xl font-bold mb-4">
          {{ editingId ? 'Edit Ingredient' : 'Add Ingredient' }}
        </h3>
        <form @submit.prevent="saveForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Ingredient Name</label>
            <input
              v-model.trim="formName"
              type="text"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Quantity</label>
            <input
              v-model.number="formQuantity"
              type="number"
              required
              step="0.01"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Unit</label>
            <select
              v-model="formUnit"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="g">Grams (g)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="L">Liters (L)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="pcs">Pieces (pcs)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Notification Threshold</label>
            <input
              v-model.number="notificationThreshold"
              type="number"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-primary-blue text-white py-3 rounded-lg font-bold hover:bg-opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
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
import { ref, onMounted } from 'vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'
import { useStockStore } from '@/stores/stocks'
import { addStock } from '@/utils/api'
import { toast } from 'vue3-toastify'

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore
const toggleSidebar = () => setSidebarVisibility(!showSidebar)

const stockStore = useStockStore()
const { stocks } = storeToRefs(stockStore)

onMounted(() => {
  stockStore.loadStocks()
})

function getStatus(quantity: number, threshold: number) {
  if (quantity <= 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' }
  if (quantity <= threshold) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' }
  return { text: 'In Stock', color: 'text-green-600 bg-green-100' }
}

// Modal state
const modalVisible = ref(false)
const editingId = ref<string | null>(null)
const formName = ref('')
const formQuantity = ref<number | null>(null)
const formUnit = ref('g')
const notificationThreshold = ref(0)

function openAdd() {
  editingId.value = null
  formName.value = ''
  formQuantity.value = null
  formUnit.value = 'g'
  modalVisible.value = true
  notificationThreshold.value = 0
}

function openEdit(name: string) {
  console.log(name)
  // const item = stock.value[name]
  // if (!item) return
  // editingId.value = name
  // formName.value = name
  // formQuantity.value = item.quantity
  // formUnit.value = item.unit
  // modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveForm() {
  if (!formName.value || formQuantity.value == null) return
  addStock({
    itemName: formName.value,
    quantity: formQuantity.value,
    unit: formUnit.value,
    notificationThreshold: notificationThreshold.value,
  }).then(() => {
    stockStore.loadStocks()
    toast.success(
      editingId.value ? 'Ingredient updated successfully.' : 'Ingredient added successfully.',
    )
  })
  closeModal()
}

function deleteStock(name: string) {
  if (!confirm(`Delete ${name}?`)) return
  // delete stock.value[name]
  // persist()
}

function exportCSV() {
  const csv = 'Ingredient,Quantity,Unit,Status\n'
  // stockEntries.value.forEach(([name, data]) => {
  //   const status = getStatus(data.quantity).text
  //   csv += `${name},${data.quantity},${data.unit},${status}\n`
  // })
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'stock_data.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
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
}
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
</style>
