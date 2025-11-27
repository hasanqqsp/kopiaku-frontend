<template>
  <div class="bg-gray-50">
    <!-- Mobile Header -->
    <div
      class="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 flex items-center justify-between p-4"
    >
      <button class="p-2 rounded-lg text-primary-blue" @click="setSidebarVisibility(!showSidebar)">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-xl font-bold">Cashier</h1>
      <div class="w-10"></div>
    </div>

    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <SidebarComponent />

      <!-- Main -->
      <main class="flex-1 p-6 mt-16 md:mt-0 mb-32 md:mb-0">
        <h2 class="text-3xl font-bold mb-6">Cashier</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div class="mb-4">
              <div class="relative">
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search products..."
                  class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <svg
                  class="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-md">
              <h3 class="text-xl font-semibold mb-4">Product List</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="p in filteredProducts"
                  :key="p.id"
                  class="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  @click="addToCart(p)"
                >
                  <img
                    :src="p.imageUrl!"
                    :alt="p.name"
                    class="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h4 class="font-bold text-sm truncate">{{ p.name }}</h4>
                  <p class="text-sm font-semibold text-primary-blue">
                    Rp {{ formatCurrency(p.price) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden lg:block lg:col-span-1">
            <div
              class="bg-white w-full md:max-w-lg md:rounded-t-2xl rounded-t-2xl md:rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold">Shopping Cart</h3>
              </div>
              <div class="mb-4 space-y-3">
                <div v-if="cart.length === 0" class="text-center text-gray-400">Cart is empty</div>
                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <h4 class="font-semibold">{{ item.name }}</h4>
                    <p class="text-sm text-gray-600">
                      {{ item.quantity }} x Rp {{ formatCurrency(item.price) }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="changeQuantity(item.id, -1)"
                      class="w-8 h-8 bg-gray-200 rounded-full"
                    >
                      -
                    </button>
                    <span class="font-bold">{{ item.quantity }}</span>
                    <button
                      @click="changeQuantity(item.id, 1)"
                      class="w-8 h-8 bg-primary-blue text-white rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div class="border-t pt-4 border-gray-200">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-lg font-semibold">Total:</span>
                  <span class="text-2xl font-bold text-primary-blue"
                    >Rp {{ formatCurrency(total) }}</span
                  >
                </div>
                <button
                  @click="showQRCode"
                  :disabled="cart.length === 0"
                  class="w-full h-14 bg-primary-blue text-white rounded-lg font-bold hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    ></path>
                  </svg>
                  <span>Show QR to Pay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Cart Button -->
    <div class="cart-mobile p-4 shadow-lg md:hidden">
      <button
        @click="isCartModalOpen = true"
        class="w-full bg-primary-blue text-white py-3 rounded-lg font-bold mb-2 flex justify-between items-center px-4"
      >
        <span>View Cart ({{ itemCount }})</span>
        <span class="text-xl font-bold">Rp {{ formatCurrency(total) }}</span>
      </button>
    </div>

    <!-- Cart Modal -->
    <div
      v-if="isCartModalOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
    >
      <div
        class="bg-white w-full md:max-w-lg md:rounded-t-2xl rounded-t-2xl md:rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">Shopping Cart</h3>
          <button class="p-2 hover:bg-gray-100 rounded-full" @click="isCartModalOpen = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="mb-4 space-y-3">
          <div v-if="cart.length === 0" class="text-center text-gray-400">Cart is empty</div>
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
          >
            <div>
              <h4 class="font-semibold">{{ item.name }}</h4>
              <p class="text-sm text-gray-600">
                {{ item.quantity }} x Rp {{ formatCurrency(item.price) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="changeQuantity(item.id, -1)" class="w-8 h-8 bg-gray-200 rounded-full">
                -
              </button>
              <span class="font-bold">{{ item.quantity }}</span>
              <button
                @click="changeQuantity(item.id, 1)"
                class="w-8 h-8 bg-primary-blue text-white rounded-full"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div class="border-t pt-4 border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">Total:</span>
            <span class="text-2xl font-bold text-primary-blue">Rp {{ formatCurrency(total) }}</span>
          </div>
          <button
            @click="showQRCode"
            :disabled="cart.length === 0"
            class="w-full h-14 bg-primary-blue text-white rounded-lg font-bold hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              ></path>
            </svg>
            <span>Show QR to Pay</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-8">
        <div class="text-center mb-6">
          <svg
            class="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p class="text-gray-600 mt-2">Transaction completed successfully</p>
        </div>
        <div id="receipt-content" class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div class="text-center border-b pb-4 mb-4">
            <h3 class="font-bold text-lg">KopiAku</h3>
            <p class="text-sm text-gray-600">Receipt</p>
            <p class="text-xs text-gray-500 mt-2">{{ receiptDate }}</p>
          </div>
          <div class="mb-4 space-y-2 text-sm">
            <div v-for="item in receiptCart" :key="item.id" class="flex justify-between">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>Rp {{ formatCurrency(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="border-t pt-4 border-gray-200">
            <div class="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span class="text-primary-blue">Rp {{ formatCurrency(receiptTotal) }}</span>
            </div>
          </div>
          <div class="text-center mt-4 text-xs text-gray-600">
            <p>Thank you for your purchase!</p>
            <p class="font-mono text-xs mt-2">{{ receiptId }}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="printReceipt"
            class="flex-1 bg-primary-blue text-white py-3 rounded-lg font-bold hover:bg-opacity-90 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Receipt
          </button>
          <button
            @click="showReceiptModal = false"
            class="flex-1 bg-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- QR Payment Modal -->
  <div
    v-if="showQRModal"
    class="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50"
    @click="showQRModal = false"
  >
    <div class="bg-white rounded-lg p-8 max-w-sm w-full mx-4" @click.stop>
      <div class="text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Scan QR to Pay</h3>
        <div class="bg-gray-100 p-6 rounded-lg mb-4 flex items-center justify-center">
          <!-- QR Code Display -->
          <div
            ref="qrCodeContainer"
            class="w-40 h-40 bg-white rounded-lg flex items-center justify-center"
          >
            <img
              v-if="qrCodeDataURL"
              :src="qrCodeDataURL"
              alt="QR Code for Payment"
              class="w-full h-full object-contain"
            />
            <div
              v-else
              class="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              <svg
                class="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="text-sm text-gray-600 mb-2">
          Total Amount:
          <span class="font-bold text-lg text-primary-blue">Rp {{ formatCurrency(total) }}</span>
        </div>
        <div class="text-xs text-gray-500 mb-6">
          Scan this QR code with your mobile banking app to complete payment
        </div>
        <div class="space-y-3">
          <!-- Swipe to Pay Component -->
          <div
            ref="swipeButton"
            class="relative h-14 bg-gray-200 rounded-lg overflow-hidden swipe-button select-none"
          >
            <div
              ref="swipeHandle"
              class="swipe-handle"
              @mousedown="startDrag"
              @touchstart.prevent="startDrag"
            >
              <svg
                class="w-6 h-6 text-primary-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div class="swipe-text flex items-center justify-center h-full">Swipe to Pay →</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import QRCode from 'qrcode'

import { useSidebarStore } from '@/stores/sidebar'

import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/menus'
import { createTransactionAPI } from '@/utils/api'
import { useUserStore } from '@/stores/user'
import { toast } from 'vue3-toastify'

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore
const search = ref('')
interface Product {
  id: string
  name: string
  price: number
  // recipe: string | null
  // image: string
}
interface CartItem extends Product {
  quantity: number
}
const cart = ref<CartItem[]>([])

const menuStore = useMenuStore()

const { menus: products } = storeToRefs(menuStore)

type RecipesMap = Record<string, Record<string, number>>

const recipes = ref<RecipesMap>(
  (JSON.parse(localStorage.getItem('recipes') || 'null') as RecipesMap) || {
    americano: { 'Coffee Beans': 18, Water: 120 },
    latte: { 'Coffee Beans': 18, Milk: 200, Water: 30 },
    cappuccino: { 'Coffee Beans': 18, Milk: 150, Water: 30 },
    espresso: { 'Coffee Beans': 18, Water: 30 },
    mocha: { 'Coffee Beans': 18, Milk: 180, Chocolate: 20, Water: 30 },
  },
)

const filteredProducts = computed(() =>
  products.value.filter((p: { name: string }) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

function addToCart(product: Product) {
  const existing = cart.value.find((i) => i.id === product.id)
  if (existing) existing.quantity++
  else cart.value.push({ ...product, quantity: 1 })
}

function changeQuantity(id: string, delta: number) {
  const item = cart.value.find((i) => i.id === id)
  if (!item) return
  item.quantity += delta
  if (item.quantity <= 0) cart.value = cart.value.filter((i) => i.id !== id)
}

const total = computed(() => cart.value.reduce((s, i) => s + i.price * i.quantity, 0))
const itemCount = computed(() => cart.value.reduce((s, i) => s + i.quantity, 0))

function formatCurrency(n: number) {
  return n.toLocaleString('id-ID')
}

const isCartModalOpen = ref(false)
const showQRModal = ref(false)
const showReceiptModal = ref(false)
// typed to avoid never[] inference
const receiptCart = ref<CartItem[]>([])
const receiptTotal = ref(0)
const receiptDate = ref('')
const receiptId = ref('')

// Swipe to pay functionality
const swipeHandle = ref<HTMLElement | null>(null)
const swipeButton = ref<HTMLElement | null>(null)
let dragging = false
let startX = 0

// QR Code functionality
const qrCodeContainer = ref<HTMLElement | null>(null)
const qrCodeDataURL = ref<string>('')

async function showQRCode() {
  if (cart.value.length === 0) {
    alert('Cart is empty')
    return
  }

  // Generate dynamic QRIS code
  const totalAmount = total.value.toString()
  const qrisData = convertToDynamicQRIS(totalAmount)

  try {
    // Generate QR code as data URL
    qrCodeDataURL.value = await QRCode.toDataURL(qrisData, {
      width: 160,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  }

  showQRModal.value = true
}

// Swipe to pay functions
function getClientX(e: MouseEvent | TouchEvent): number {
  if (e instanceof TouchEvent) {
    return e.touches[0]?.clientX ?? 0
  }
  return e.clientX
}

function startDrag(e: MouseEvent | TouchEvent) {
  dragging = true
  startX = getClientX(e)
  window.addEventListener('mousemove', onDrag as EventListener)
  window.addEventListener('touchmove', onDrag as EventListener, { passive: false })
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchend', endDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging) return
  e.preventDefault()
  const currentX = getClientX(e)
  const diff = currentX - startX
  const btn = swipeButton.value
  const handle = swipeHandle.value
  if (!btn || !handle) return
  const maxDiff = btn.offsetWidth - handle.offsetWidth - 8
  const newLeft = Math.max(4, Math.min(diff + 4, maxDiff))
  handle.style.left = newLeft + 'px'
  const progress = (newLeft - 4) / (maxDiff - 4)
  btn.style.backgroundPosition = `${100 - progress * 100}% 0`
}

function endDrag() {
  if (!dragging) return
  dragging = false
  const btn = swipeButton.value
  const handle = swipeHandle.value
  if (!btn || !handle) return
  const maxDiff = btn.offsetWidth - handle.offsetWidth - 8
  const currentLeft = parseInt(handle.style.left || '4')
  if (currentLeft >= maxDiff * 0.8) {
    checkout()
  }
  handle.style.left = '4px'
  btn.style.backgroundPosition = '100% 0'
  window.removeEventListener('mousemove', onDrag as EventListener)
  window.removeEventListener('touchmove', onDrag as EventListener)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchend', endDrag)
}

function checkout() {
  if (cart.value.length === 0) {
    alert('Cart is empty')
    return
  }
  const stock = JSON.parse(localStorage.getItem('stock') || '{}')
  cart.value.forEach((item) => {
    // Try to find recipe by item name (convert to lowercase for matching)
    const recipeName = item.name.toLowerCase().replace(/\s+/g, '')
    const recipeIngredients = recipes.value[recipeName]
    if (recipeIngredients) {
      Object.entries(recipeIngredients).forEach(([ingredient, amount]) => {
        stock[ingredient] = (stock[ingredient]?.quantity || 0) - amount * item.quantity
      })
    }
  })
  localStorage.setItem('stock', JSON.stringify(stock))
  // snapshot
  receiptCart.value = cart.value.map((i) => ({ ...i }))
  receiptTotal.value = total.value
  receiptId.value = 'TRX-' + Date.now()
  receiptDate.value = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const { currentUser } = useUserStore()

  createTransactionAPI({
    userId: currentUser?.id || '',
    menuItems: cart.value.map((item) => ({
      menuId: item.id,
      quantity: item.quantity,
    })),
    totalAmount: total.value,
    status: 'UNVERIFIED',
    transactionDate: new Date().toISOString(),
  }).then(() => {
    showReceiptModal.value = true

    cart.value = []
    showQRModal.value = false
    isCartModalOpen.value = false
    toast.success('Transaction data saved')
  })
}

function printReceipt() {
  window.print()
}

/* QR Payment functionality */

onMounted(async () => {
  await menuStore.fetchMenus()
})

onBeforeUnmount(() => {
  endDrag()
})

function convertToDynamicQRIS(nominal: string) {
  let qris =
    '00020101021126610014COM.GO-JEK.WWW01189360091430208080860210G0208080860303UMI51440014ID.CO.QRIS.WWW0215ID10254364673810303UMI5204581253033605802ID5925ADELIA TIARA PUTRI, Makan6005DEPOK61051651462070703A016304FAA5'
  const tax = ''

  qris = qris.slice(0, -4).replace('010211', '010212')

  const [prefix, suffix] = qris.split('5802ID')
  const nominalData = '54' + String(nominal.length).padStart(2, '0') + nominal

  const resultQRIS = `${prefix}${nominalData}${tax || ''}5802ID${suffix}${convertCRC16(prefix + nominalData + tax + '5802ID' + suffix)}`
  return resultQRIS
}

function convertCRC16(str: string) {
  let crc = 0xffff
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
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
  .cart-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 2px solid #e5e7eb;
    z-index: 30;
  }
  main {
    margin-bottom: 5rem;
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

.swipe-button {
  position: relative;
  background: linear-gradient(to right, #1c0cdc 0%, #1c0cdc 50%, #e5e7eb 50%, #e5e7eb 100%);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: background-position 0.3s;
}
.swipe-handle {
  position: absolute;
  left: 4px;
  top: 4px;
  width: 50px;
  height: calc(100% - 8px);
  background: white;
  border-radius: 0.5rem;
  cursor: grab;
  transition: left 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.swipe-handle:active {
  cursor: grabbing;
}
.swipe-text {
  position: relative;
  z-index: 1;
  pointer-events: none;
  color: #6b7280;
  font-weight: bold;
}
</style>

<style>
@media print {
  body * {
    visibility: hidden;
    width: 58mm;
  }
  #receipt-content,
  #receipt-content * {
    visibility: visible;
  }
  #receipt-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    border: none;
  }
}
</style>
