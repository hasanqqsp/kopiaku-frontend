<template>
  <aside :class="['sidebar', showSidebar ? 'show' : '']">
    <div class="p-4 flex items-center justify-center">
      <img
        src="https://image2url.com/images/1761181262257-636d5ce0-5d3b-4be6-a084-f3ff601abc8f.png"
        alt="KOPI AKU Logo"
        class="h-16 w-16"
      />
    </div>
    <nav class="p-4">
      <RouterLink
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
      >
        <component :is="item.icon" class="w-6 h-6 mr-3" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <button
        @click="logout"
        class="w-full flex items-center justify-center p-3 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 font-semibold text-white shadow-lg mt-4"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </nav>
  </aside>
  <div
    v-if="showSidebar"
    class="fixed inset-0 bg-black/40 md:hidden z-30"
    @click="
      () => {
        setSidebarVisibility(false)
      }
    "
  ></div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { h } from 'vue'
import { useSidebarStore } from '@/stores/sidebar'

import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore
const route = useRoute()
const router = useRouter()

const isActive = (path: string) => route.path === path

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

function makeIcon(d: string) {
  return () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d }),
    ])
}

const items = [
  {
    path: '/',
    label: 'Dashboard',
    icon: makeIcon('M3 12l2-2m0 0l7-7 7 7M5 10v10h3m10-10l2-2m-2 2v10h-3m-6 0v-4h3v4'),
  },
  {
    path: '/cashier',
    label: 'Cashier',
    icon: makeIcon(
      'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    ),
  },
  {
    path: '/stock',
    label: 'Stock Management',
    icon: makeIcon('M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'),
  },
  {
    path: '/recipes',
    label: 'Coffee Recipes',
    icon: makeIcon(
      'M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M12 6.253C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    ),
  },
  {
    path: '/transaction',
    label: 'QRIS Transactions',
    icon: makeIcon(
      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    ),
  },
  {
    path: '/employee',
    label: 'Employees',
    icon: makeIcon(
      'M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M13 16h2v2h-2m4-6h.01M19 13h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2zm-9-1a3 3 0 11-6 0 3 3 0 016 0z',
    ),
  },
  {
    path: '/content',
    label: 'Content Management',
    icon: makeIcon(
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    ),
  },
  {
    path: '/account',
    label: 'Account Settings',
    icon: makeIcon(
      'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    ),
  },
]
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #1c0cdc;
  color: white;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}
.sidebar.show {
  transform: translateX(0);
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem; /* p-3 */
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 500; /* font-medium */
  margin-bottom: 0.25rem; /* mb-1 */
  transition: all 150ms ease;
  text-decoration: none;
}

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
