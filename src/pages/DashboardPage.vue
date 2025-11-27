<template>
  <div class="bg-gray-50">
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
      <h1 class="text-xl font-bold">Dashboard</h1>
      <div class="w-10"></div>
    </div>

    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <SidebarComponent />

      <!-- Main Content -->
      <main class="flex-1 p-6 mt-16 md:mt-0">
        <h2 class="text-3xl font-bold mb-6">Dashboard Overview</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-gray-500 text-sm mb-2">Today's Sales</div>
            <div class="text-4xl font-bold text-primary-blue">
              Rp {{ salesToday.toLocaleString() }}
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-gray-500 text-sm mb-2">Total Transactions</div>
            <div class="text-4xl font-bold text-primary-blue">{{ transactions }}</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-gray-500 text-sm mb-2">Low Stock Items</div>
            <div class="text-4xl font-bold text-coffee">{{ lowStock }}</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-gray-500 text-sm mb-2">Active Orders</div>
            <div class="text-4xl font-bold text-primary-blue">{{ activeOrders }}</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4">Weekly Sales Trend</h3>
          <div
            class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
          >
            Chart Placeholder
          </div>
        </div>
      </main>
    </div>
  </div>
  <!-- Mobile Header -->
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import { ref } from 'vue'

import { useSidebarStore } from '@/stores/sidebar'

const { showSidebar, setSidebarVisibility } = useSidebarStore()
const salesToday = ref(2500000)
const transactions = ref(35)
const lowStock = ref(5)
const activeOrders = ref(8)

const toggleSidebar = () => {
  console.log('Toggling sidebar')
  setSidebarVisibility(!showSidebar)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #1c0cdc;
  color: white;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
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
</style>
