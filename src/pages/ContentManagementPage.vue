<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Mobile Header -->
    <div
      class="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 flex items-center justify-between p-4"
    >
      <button @click="toggleMobileSidebar" class="p-2 rounded-lg text-primary-blue">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <h1 class="text-xl font-bold">Content Management</h1>
      <div class="w-10"></div>
    </div>

    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <SidebarComponent :sidebarShow="sidebarShow" />

      <!-- Main Content -->
      <main class="flex-1 p-6 mt-16 md:mt-0">
        <div class="mb-6">
          <h2 class="text-3xl font-bold">Content Management</h2>
          <p class="text-gray-600 mt-1">Kelola konten landing page Kopi Aku</p>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-md mb-6 flex flex-wrap border-b">
          <button @click="switchTab('hero')" :class="['tab-btn', { active: activeTab === 'hero' }]">
            Hero Section
          </button>
          <button
            @click="switchTab('about')"
            :class="['tab-btn', { active: activeTab === 'about' }]"
          >
            Tentang Kami
          </button>
          <button @click="switchTab('menu')" :class="['tab-btn', { active: activeTab === 'menu' }]">
            Menu
          </button>
          <button
            @click="switchTab('promo')"
            :class="['tab-btn', { active: activeTab === 'promo' }]"
          >
            Promosi
          </button>
          <button
            @click="switchTab('location')"
            :class="['tab-btn', { active: activeTab === 'location' }]"
          >
            Lokasi & Kontak
          </button>
          <button
            @click="switchTab('carousel')"
            :class="['tab-btn', { active: activeTab === 'carousel' }]"
          >
            Carousel Images
          </button>
        </div>

        <div class="max-w-5xl">
          <!-- Hero Section -->
          <section v-show="activeTab === 'hero'" class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-primary-blue">Hero Section</h3>
              <button
                @click="saveContent('hero')"
                class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
              >
                Simpan
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Judul Hero</label>
                <input
                  v-model="contentData.hero.title"
                  type="text"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Kopi Berkualitas, Harga Bersahabat."
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Hero</label>
                <textarea
                  v-model="contentData.hero.desc"
                  rows="4"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Kami percaya setiap orang berhak menikmati secangkir kopi yang baik..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Background Image URL</label
                >
                <input
                  v-model="contentData.hero.bg"
                  type="text"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="URL gambar background"
                />
              </div>
            </div>
          </section>

          <!-- About Section -->
          <section v-show="activeTab === 'about'" class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-primary-blue">Tentang Kami</h3>
              <button
                @click="saveContent('about')"
                class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
              >
                Simpan
              </button>
            </div>

            <div class="space-y-6">
              <div class="border-t pt-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4">Kisah Kopi Aku</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Paragraf 1</label>
                    <textarea
                      v-model="contentData.about.story[0]"
                      rows="3"
                      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Paragraf 2</label>
                    <textarea
                      v-model="contentData.about.story[1]"
                      rows="3"
                      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="border-t pt-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4">Visi Kami</h4>
                <textarea
                  v-model="contentData.about.vision"
                  rows="3"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>

              <div class="border-t pt-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4">Misi Kami</h4>
                <div class="space-y-2 mb-4">
                  <div
                    v-for="(mission, idx) in contentData.about.mission"
                    :key="idx"
                    class="flex gap-2"
                  >
                    <input
                      v-model="contentData.about.mission[idx]"
                      type="text"
                      class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                    <button @click="removeMission(idx)" class="text-red-600 hover:text-red-700">
                      Hapus
                    </button>
                  </div>
                </div>
                <button @click="addMission" class="text-primary-blue hover:underline font-semibold">
                  + Tambah Misi
                </button>
              </div>

              <div class="border-t pt-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4">Awal Mula</h4>
                <textarea
                  v-model="contentData.about.origin"
                  rows="3"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- Menu Section -->
          <section v-show="activeTab === 'menu'" class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-primary-blue">Menu</h3>
              <button
                @click="saveContent('menu')"
                class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
              >
                Simpan
              </button>
            </div>

            <div class="space-y-6 mb-6">
              <div v-for="(cat, idx) in contentData.menu" :key="idx" class="border rounded-lg p-4">
                <div class="flex justify-between mb-3">
                  <input
                    v-model="cat.category"
                    type="text"
                    class="flex-1 mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    placeholder="Nama Kategori"
                  />
                  <button @click="removeCategory(idx)" class="text-red-600 hover:text-red-700">
                    Hapus
                  </button>
                </div>
                <div class="space-y-2 ml-4">
                  <div v-for="(item, itemIdx) in cat.items" :key="itemIdx" class="flex gap-2">
                    <input
                      v-model="item.name"
                      type="text"
                      class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Nama Item"
                    />
                    <input
                      v-model="item.price"
                      type="number"
                      class="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Harga"
                    />
                    <button
                      @click="removeMenuItem(idx, itemIdx)"
                      class="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <button
                  @click="addMenuItem(idx)"
                  class="mt-2 text-primary-blue hover:underline text-sm font-semibold"
                >
                  + Tambah Item
                </button>
              </div>
            </div>
            <button @click="addCategory" class="text-primary-blue hover:underline font-semibold">
              + Tambah Kategori Menu
            </button>
          </section>

          <!-- Promo Section -->
          <section v-show="activeTab === 'promo'" class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-primary-blue">Promosi Spesial</h3>
              <button
                @click="saveContent('promo')"
                class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
              >
                Simpan
              </button>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Judul Promosi</label>
                <input
                  v-model="contentData.promo.title"
                  type="text"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Promosi Spesial Untukmu!"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Daftar Aturan Promosi</label
                >
                <div class="space-y-3 mb-4">
                  <div v-for="(rule, idx) in contentData.promo.rules" :key="idx" class="flex gap-2">
                    <input
                      v-model="contentData.promo.rules[idx]"
                      type="text"
                      class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                    <button @click="removeRule(idx)" class="text-red-600 hover:text-red-700">
                      Hapus
                    </button>
                  </div>
                </div>
                <button @click="addRule" class="text-primary-blue hover:underline font-semibold">
                  + Tambah Aturan
                </button>
              </div>
            </div>
          </section>

          <!-- Location & Contact Section -->
          <section v-show="activeTab === 'location'" class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-primary-blue">Lokasi & Kontak</h3>
              <button
                @click="saveContent('location')"
                class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
              >
                Simpan
              </button>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Jam Operasional</label
                >
                <input
                  v-model="contentData.location.hours"
                  type="text"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="20:00 - 02:00 WIB"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
                <textarea
                  v-model="contentData.location.address"
                  rows="3"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                <input
                  v-model="contentData.location.phone"
                  type="text"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="6287814811610"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Instagram Handle</label
                >
                <input
                  v-model="contentData.location.instagram"
                  type="text"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="@kopiakuu"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Google Maps Embed URL</label
                >
                <textarea
                  v-model="contentData.location.map"
                  rows="3"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- Carousel Images Section -->
          <section v-show="activeTab === 'carousel'" class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-primary-blue">Gambar Carousel</h3>
              <button
                @click="saveContent('carousel')"
                class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
              >
                Simpan
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div
                v-for="(img, idx) in contentData.carousel"
                :key="idx"
                class="border rounded-lg p-4"
              >
                <img :src="img.url" :alt="img.alt" class="w-full h-48 object-cover rounded mb-3" />
                <input
                  v-model="img.url"
                  type="text"
                  class="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Image URL"
                />
                <input
                  v-model="img.alt"
                  type="text"
                  class="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Alt Text"
                />
                <button
                  @click="removeCarousel(idx)"
                  class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-semibold"
                >
                  Hapus Gambar
                </button>
              </div>
            </div>
            <button
              @click="addCarouselImage"
              class="text-primary-blue hover:underline font-semibold"
            >
              + Tambah Gambar
            </button>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import { ref, onMounted } from 'vue'

// Interfaces
interface MenuItem {
  name: string
  price: number
}

interface MenuCategory {
  category: string
  items: MenuItem[]
}

interface CarouselImage {
  url: string
  alt: string
}

interface ContentData {
  hero: {
    title: string
    desc: string
    bg: string
  }
  about: {
    story: string[]
    vision: string
    mission: string[]
    origin: string
  }
  menu: MenuCategory[]
  promo: {
    title: string
    rules: string[]
  }
  location: {
    hours: string
    address: string
    phone: string
    instagram: string
    map: string
  }
  carousel: CarouselImage[]
}

// Reactive data
const activeTab = ref('hero')
const sidebarShow = ref(false)

// Content data
const contentData = ref<ContentData>({
  hero: {
    title: 'Kopi Berkualitas, Harga Bersahabat.',
    desc: 'Kami percaya setiap orang berhak menikmati secangkir kopi yang baik tanpa harus menguras dompet. Temukan semangatmu di setiap tegukan.',
    bg: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=3456&auto=format&fit=crop',
  },
  about: {
    story: [
      'Kopi Aku lahir dari kecintaan mendalam terhadap kopi dan keresahan akan tingginya harga kopi di sekitar kampus. Kehadiran kami bertujuan untuk mengubah pandangan bahwa kualitas selalu identik dengan harga tinggi.',
      'Kami ingin membuktikan bahwa kopi berkualitas dapat dinikmati oleh siapa saja.',
    ],
    vision:
      'Menjadi merek kopi pilihan mahasiswa dan masyarakat luas dengan menyajikan kopi berkualitas tinggi yang mudah diakses dan terjangkau.',
    mission: [
      'Menyajikan kualitas unggul',
      'Menciptakan pengalaman berkesan',
      'Berinovasi tanpa henti',
      'Menjadi bagian dari gaya hidup',
    ],
    origin:
      'Perjalanan Kopi Aku dimulai dari tempat yang sederhana di atas kendaraan, di sekitar kampus, hingga di booth kecil di berbagai acara. Dengan semangat yang sama sejak awal, kami terus berkomitmen untuk menyajikan kopi terbaik bagi semua pecinta kopi.',
  },
  menu: [
    {
      category: 'REFRESHMENT DRINK',
      items: [
        { name: 'Espresso', price: 8000 },
        { name: 'Americano', price: 12000 },
      ],
    },
  ],
  promo: {
    title: 'Promosi Spesial Untukmu!',
    rules: [
      'Temukan booth KOPI AKU di sekitarmu',
      'Ajak minimal 2 temanmu untuk beli KOPI AKU bareng',
      'Follow Instagram @kopiakuu dan tunjukkan ke kasir',
      'Langsung dapetin kopimu dengan SETENGAH HARGA',
    ],
  },
  location: {
    hours: '11:00 - 22:00 WIB',
    address:
      'JJl. Belimbing, RT.02/RW.05, Tegal Gundil, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16152',
    phone: '6287814811610',
    instagram: '@kopiakuu',
    map: 'https://www.google.com/maps/embed?pb=...',
  },
  carousel: [
    {
      url: 'https://image2url.com/images/1761188402746-8047f73e-0b1e-4312-aeb5-bb1917613a72.png',
      alt: 'Kopi Pilihan',
    },
    {
      url: 'https://image2url.com/images/1761189286834-fb6a6ade-7443-4940-a223-94d3c82ad870.png',
      alt: 'Penggilingan',
    },
  ],
})

// Methods
const switchTab = (tab: string) => {
  activeTab.value = tab
}

const toggleMobileSidebar = () => {
  sidebarShow.value = !sidebarShow.value
}

const saveContent = (section: string) => {
  localStorage.setItem('landingContent', JSON.stringify(contentData.value))
  alert(`Konten ${section} berhasil disimpan!`)
}

const addMission = () => {
  contentData.value.about.mission.push('Misi baru')
}

const removeMission = (idx: number) => {
  contentData.value.about.mission.splice(idx, 1)
}

const addCategory = () => {
  contentData.value.menu.push({ category: 'Kategori Baru', items: [] })
}

const removeCategory = (idx: number) => {
  contentData.value.menu.splice(idx, 1)
}

const addMenuItem = (categoryIdx: number) => {
  if (contentData.value.menu[categoryIdx]) {
    contentData.value.menu[categoryIdx].items.push({ name: 'Item Baru', price: 0 })
  }
}

const removeMenuItem = (catIdx: number, itemIdx: number) => {
  if (contentData.value.menu[catIdx]) {
    contentData.value.menu[catIdx].items.splice(itemIdx, 1)
  }
}

const addRule = () => {
  contentData.value.promo.rules.push('Aturan baru')
}

const removeRule = (idx: number) => {
  contentData.value.promo.rules.splice(idx, 1)
}

const addCarouselImage = () => {
  contentData.value.carousel.push({ url: '', alt: 'Gambar Baru' })
}

const removeCarousel = (idx: number) => {
  contentData.value.carousel.splice(idx, 1)
}

// Load content from localStorage
const loadContent = () => {
  const stored = localStorage.getItem('landingContent')
  if (stored) {
    contentData.value = JSON.parse(stored)
  }
}

onMounted(() => {
  loadContent()
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
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  border-bottom-color: #1c0cdc;
  color: #1c0cdc;
  background-color: #f3f4f6;
}
</style>
