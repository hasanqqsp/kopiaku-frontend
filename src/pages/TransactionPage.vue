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
      <h1 class="text-xl font-bold">QRIS & GoPay</h1>
      <div class="w-10"></div>
    </div>

    <!-- Sidebar -->
    <SidebarComponent />

    <!-- Main Content -->
    <main class="flex-1 p-6 mt-16 md:mt-0">
      <div class="page-content">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">Integrasi QRIS & GoPay</h2>
        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
          <p class="mb-4 text-gray-700">
            Untuk mengunggah data transaksi dari GoPay Merchant, silakan pilih file CSV.
          </p>
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-600"
              >Unggah File CSV Transaksi GoPay</label
            >

            <div
              class="border-2 border-dashed rounded-xl p-6 bg-gray-100 cursor-pointer hover:bg-gray-200 transition relative text-center"
              @click="csvInput?.click()"
            >
              <input
                ref="csvInput"
                id="csvUpload"
                type="file"
                accept=".csv"
                class="hidden"
                @change="onFileChange"
              />
              <div v-if="!selectedFile" class="text-gray-500">
                <p class="font-semibold">Klik atau pilih file CSV</p>
                <p class="text-xs mt-1">Format: Tanggal, ID Transaksi, Jumlah</p>
              </div>
              <div v-else class="flex flex-col items-center space-y-2 text-sm text-gray-700">
                <p class="font-semibold truncate max-w-full">
                  {{ selectedFile.name }}
                </p>
                <p class="text-xs">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
                <button
                  type="button"
                  class="text-xs text-red-600 hover:underline"
                  @click="
                    () => {
                      selectedFile = null
                      uploadSuccess = false
                    }
                  "
                >
                  Hapus
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                :disabled="!selectedFile"
                @click="processFile"
                class="bg-primary-blue disabled:opacity-50 text-white py-2 px-5 rounded-lg font-bold hover:bg-opacity-90 transition-colors shadow-md"
              >
                Proses File
              </button>
              <span v-if="uploadSuccess" class="text-green-600 text-sm font-semibold">
                Berhasil diimpor
              </span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4 text-gray-900">Riwayat Transaksi GoPay</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left table-auto">
              <thead>
                <tr class="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                  <th class="py-3 px-6 text-left">Tanggal</th>
                  <th class="py-3 px-6 text-left">ID Transaksi</th>
                  <th class="py-3 px-6 text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
                <tr v-if="transactions.length === 0" class="border-b border-gray-200">
                  <td colspan="3" class="py-3 px-6 text-center text-gray-400">
                    Belum ada data transaksi.
                  </td>
                </tr>
                <tr
                  v-for="(t, i) in transactions"
                  :key="t.id + i"
                  :class="[
                    'border-b border-gray-200 transition-colors duration-200',
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                    'hover:bg-gray-100',
                  ]"
                >
                  <td class="py-3 px-6">{{ t.date }}</td>
                  <td class="py-3 px-6">{{ t.id }}</td>
                  <td class="py-3 px-6">Rp {{ t.amount.toLocaleString('id-ID') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import { ref } from 'vue'

interface Transaction {
  date: string
  id: string
  amount: number
}

const transactions = ref<Transaction[]>([])
const selectedFile = ref<File | null>(null)
const csvInput = ref<HTMLInputElement | null>(null)
const uploadSuccess = ref(false)
import { useSidebarStore } from '@/stores/sidebar'

import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore

const toggleSidebar = () => {
  setSidebarVisibility(!showSidebar)
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
  uploadSuccess.value = false
}

const processFile = () => {
  if (!selectedFile.value) return
  const reader = new FileReader()
  reader.onload = () => {
    const csv = typeof reader.result === 'string' ? reader.result : ''
    if (!csv) return
    parseCSV(csv)
    uploadSuccess.value = true
    alert('Data transaksi GoPay berhasil diimpor.')
  }
  reader.readAsText(selectedFile.value)
}

function parseCSV(csv: string) {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length < 2) {
    transactions.value = []
    return
  }
  const headerLine = lines[0]
  if (!headerLine) {
    transactions.value = []
    return
  }
  const headers = headerLine.split(',').map((h) => h.trim())
  const getIndex = (name: string, fallbackIdx: number) => {
    const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase())
    return idx >= 0 ? idx : fallbackIdx
  }
  const dateIdx = getIndex('Tanggal', 0)
  const idIdx = getIndex('ID Transaksi', 1)
  const amountIdx = getIndex('Jumlah', 2)

  const parsed: Transaction[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    const row = line.split(',').map((v) => v.trim())
    if (!row[dateIdx]) continue
    const rawAmount = row[amountIdx] || '0'
    const amount =
      parseInt(
        rawAmount
          .replace(/"/g, '')
          .replace(/\./g, '')
          .replace(/,/g, '')
          .replace(/Rp\s?/gi, '')
          .trim(),
        10,
      ) || 0
    parsed.push({
      date: row[dateIdx],
      id: row[idIdx] || `TX-${i}`,
      amount,
    })
  }
  transactions.value = parsed
}
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
  text-decoration: none;
  color: white;
}
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
</style>
