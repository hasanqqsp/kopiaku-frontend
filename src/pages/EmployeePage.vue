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
      <h1 class="text-xl font-bold">Manage Employees</h1>
      <div class="w-10"></div>
    </div>

    <!-- Sidebar -->
    <SidebarComponent />

    <!-- Main Content -->
    <main class="flex-1 p-6 mt-16 md:mt-0">
      <h2 class="text-3xl font-bold mb-6">Manage Employees</h2>

      <!-- Tabs -->
      <div class="flex border-b mb-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['tab-button', activeTab === tab.key ? 'active' : '']"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Employees Tab -->
      <div v-show="activeTab === 'employees'" v-if="!loading && !error">
        <div class="mb-4">
          <button
            @click="openEmployeeModal()"
            class="bg-primary-blue text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-90 shadow-md"
          >
            Add Employee
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="emp in employees" :key="emp.id" class="bg-white rounded-xl p-6 shadow-md">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold">{{ emp.name }}</h3>
                <p class="text-sm text-gray-600">{{ emp.username }}</p>
              </div>
              <!-- <div
                class="photo-verification-badge"
                :class="
                  emp.photoVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                "
              >
                {{ emp.photoVerified ? '✓' : '✗' }}
              </div> -->
            </div>
            <p class="text-sm text-gray-600 mb-4">📱 {{ emp.contact }}</p>
            <div class="flex space-x-2">
              <button
                @click="openEmployeeModal(emp.id)"
                class="flex-1 bg-primary-blue text-white py-2 rounded-lg hover:bg-opacity-90 text-sm font-semibold"
              >
                Edit
              </button>
              <button
                @click="deleteEmployee(emp.id)"
                class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-opacity-90 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Shifts Tab -->
      <div v-show="activeTab === 'shifts'">
        <div class="bg-white rounded-xl shadow-md overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="py-4 px-6 text-left font-semibold">Employee</th>
                <th class="py-4 px-6 text-left font-semibold">Date</th>
                <th class="py-4 px-6 text-left font-semibold">Time</th>
                <th class="py-4 px-6 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="presence in presences.filter(
                  (presence) =>
                    new Date(presence.checkInTime).toLocaleDateString() ===
                    new Date().toLocaleDateString(),
                )"
                :key="presence.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-4 px-6">
                  {{ employees.find((emp) => emp.id === presence.userId)?.name }}
                </td>
                <td class="py-4 px-6">
                  {{ new Date(presence.checkInTime).toLocaleDateString('id-ID') }}
                </td>
                <td class="py-4 px-6">
                  {{
                    new Date(presence.checkInTime).toLocaleTimeString('id-ID', {
                      hourCycle: 'h23',
                    })
                  }}
                </td>
                <td class="py-4 px-6">
                  <span
                    :class="
                      new Date(presence.checkInTime).toDateString() === new Date().toDateString()
                        ? 'text-blue-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    "
                  >
                    {{
                      new Date(presence.checkInTime).toDateString() === new Date().toDateString()
                        ? 'On Going'
                        : 'Completed'
                    }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- History Tab -->
      <div v-show="activeTab === 'history'">
        <div class="mb-4">
          <input
            v-model="historySearch"
            type="text"
            placeholder="Search employee or date..."
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="py-4 px-6 text-left font-semibold">Employee</th>
                <th class="py-4 px-6 text-left font-semibold">Date</th>
                <th class="py-4 px-6 text-left font-semibold">Time</th>
                <th class="py-4 px-6 text-left font-semibold">Status</th>
                <th class="py-4 px-6 text-left font-semibold">Photo Verification</th>
                <th class="py-4 px-6 text-center font-semibold">View Photo</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, idx) in presences"
                :key="record.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-4 px-6">{{ employees.find((e) => e.id === record.userId)?.name }}</td>
                <td class="py-4 px-6">
                  {{ new Date(record.checkInTime).toLocaleDateString('id-ID') }}
                </td>
                <td class="py-4 px-6">
                  {{ new Date(record.checkInTime).toLocaleTimeString('id-ID') }}
                </td>
                <td class="py-4 px-6">
                  <span
                    :class="
                      new Date(record.checkInTime).toDateString() === new Date().toDateString()
                        ? 'text-blue-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    "
                  >
                    {{
                      new Date(record.checkInTime).toDateString() === new Date().toDateString()
                        ? 'On Going'
                        : 'Completed'
                    }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <span
                    class="px-3 py-1 rounded-full text-sm font-semibold"
                    :class="
                      record.validated
                        ? 'bg-green-100 text-green-700'
                        : new Date(record.checkInTime).toDateString() === new Date().toDateString()
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    "
                  >
                    {{
                      record.validated
                        ? '✓ Verified'
                        : new Date(record.checkInTime).toDateString() === new Date().toDateString()
                          ? '⚠ Pending'
                          : '✗ Expired'
                    }}
                  </span>
                </td>
                <td class="py-4 px-6 text-center">
                  <button
                    @click="viewPhoto(idx)"
                    class="text-primary-blue hover:underline font-semibold"
                  >
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="filteredHistory.length === 0">
                <td colspan="6" class="py-6 text-center text-sm text-gray-500">No records found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Employee Modal -->
    <div
      v-if="showEmployeeModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full my-8">
        <h3 class="text-2xl font-bold mb-4">
          {{ employeeForm.id ? 'Edit Employee' : 'Add Employee' }}
        </h3>
        <form @submit.prevent="saveEmployee" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Name</label>
            <input
              v-model="employeeForm.name"
              type="text"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div v-if="!isUpdating">
            <label class="block text-sm font-medium mb-2">Username</label>
            <input
              v-model="employeeForm.username"
              type="text"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
              v-model="employeeForm.email"
              type="email"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div v-if="!isUpdating">
            <label class="block text-sm font-medium mb-2">Default Password</label>
            <input
              v-model="employeeForm.password"
              type="password"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">contact Number</label>
            <input
              v-model="employeeForm.contact"
              type="tel"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-primary-blue text-white py-3 rounded-lg font-bold hover:bg-opacity-90"
            >
              Save Employee
            </button>
            <button
              type="button"
              @click="closeEmployeeModal"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Shift Modal -->
    <div
      v-if="showShiftModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full my-8">
        <h3 class="text-2xl font-bold mb-4">{{ shiftForm.id ? 'Edit Shift' : 'Assign Shift' }}</h3>
        <form @submit.prevent="saveShift" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Employee</label>
            <select
              v-model="shiftForm.employeeId"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="">Select Employee</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Date</label>
            <input
              v-model="shiftForm.date"
              type="date"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Time Slot</label>
            <select
              v-model="shiftForm.time"
              required
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="">Select Time</option>
              <option>06:00 - 14:00</option>
              <option>14:00 - 22:00</option>
              <option>22:00 - 06:00</option>
            </select>
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-primary-blue text-white py-3 rounded-lg font-bold hover:bg-opacity-90"
            >
              Save Shift
            </button>
            <button
              type="button"
              @click="closeShiftModal"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Photo Modal -->
    <div
      v-if="showPhotoModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">Photo Verification</h3>
          <button @click="closePhotoModal" class="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        <div class="space-y-4" v-if="presenceRecord?.id">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium mb-2">Employee Photo</p>
              <img
                :src="presenceRecord?.imageUrl || ''"
                alt="Employee Photo"
                class="w-full rounded-lg border"
              />
            </div>
            <div>
              <p class="text-sm font-medium mb-2">Verification Status</p>
              <div
                class="p-4 rounded-lg text-center font-semibold"
                :class="
                  presenceRecord?.validated
                    ? 'bg-green-100 text-green-700'
                    : new Date(presenceRecord?.checkInTime || '').toDateString() ===
                        new Date().toDateString()
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                "
              >
                {{
                  presenceRecord?.validated
                    ? '✓ Verified'
                    : new Date(presenceRecord?.checkInTime || '').toDateString() ===
                        new Date().toDateString()
                      ? '⚠ Pending Verification'
                      : '✗ Expired'
                }}
              </div>
              <div class="w-full mt-4 text-center">
                <button
                  v-if="presenceRecord && !presenceRecord.validated"
                  @click="validatePresence(presenceRecord.id)"
                  class="bg-primary-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90"
                >
                  Verify Presence
                </button>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium mb-2">Details</p>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p>
                <strong>Employee:</strong>
                {{ employees.find((e) => e.id === presenceRecord?.userId)?.name || 'Unknown' }}
              </p>
              <p>
                <strong>Time:</strong>
                {{
                  new Date(presenceRecord?.checkInTime).toLocaleString('en-GB', {
                    hourCycle: 'h23',
                  })
                }}
              </p>
              <!-- <p><strong>Shift:</strong> {{ activePhotoRecord.time }}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import { reactive, ref, computed, onMounted } from 'vue'
import { validatePresence as validatePresenceApi } from '@/utils/api'
const employeeStore = useEmployeeStore()
const { employees, pageInfo, loading, error } = storeToRefs(employeeStore)
const presenceStore = usePresenceStore()
const {
  presences,
  pageInfo: presencesPageInfo,
  loading: presencesLoading,
  error: presencesError,
} = storeToRefs(presenceStore)
const isUpdating = ref(false)

onMounted(() => {
  employeeStore.fetchUsers()
  presenceStore.fetchPresences()
})

function nextPage() {
  employeeStore.loadNextPage()
}

function validatePresence(presenceId: string) {
  validatePresenceApi(presenceId).then(() => {
    presenceStore.fetchPresences()
    toast.success('Presence validated successfully.')
    showPhotoModal.value = false
  })
}

interface Shift {
  employeeId: string
  employeeName: string
  date: string
  time: string
  status: 'Assigned' | 'Completed'
}
interface HistoryRecord {
  employeeId: string
  employeeName: string
  date: string
  time: string
  status: 'Completed'
  photoVerified: boolean
}

const tabs = [
  { key: 'employees', label: 'Employees' },
  { key: 'shifts', label: 'Current Shifts' },
  { key: 'history', label: 'Shift History' },
] as const

const activeTab = ref<(typeof tabs)[number]['key']>('employees')
import { useSidebarStore } from '@/stores/sidebar'

import { storeToRefs } from 'pinia'
import { addEmployees, deleteUser, updateUserProfile } from '@/utils/api'
import { useEmployeeStore } from '@/stores/employee'
import { toast } from 'vue3-toastify'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { usePresenceStore } from '@/stores/presences'

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function saveJSON<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val))
}

// const employees = reactive<Record<string, Employee>>(
//   loadJSON('employees', {} as Record<string, Employee>),
// )
const shifts = reactive<Record<string, Shift>>(loadJSON('shifts', {} as Record<string, Shift>))
const shiftHistory = ref<HistoryRecord[]>(loadJSON('shiftHistory', [] as HistoryRecord[]))

if (Object.keys(shifts).length === 0) {
  Object.assign(shifts, {
    shift1: {
      employeeId: 'emp1',
      employeeName: 'Budi Santoso',
      date: '2025-11-14',
      time: '06:00 - 14:00',
      status: 'Assigned',
    },
    shift2: {
      employeeId: 'emp2',
      employeeName: 'Siti Nurhaliza',
      date: '2025-11-14',
      time: '14:00 - 22:00',
      status: 'Assigned',
    },
  } satisfies Record<string, Shift>)
  saveJSON('shifts', shifts)
}

// const employeeEntries = computed<[string, Employee][]>(() => Object.entries(employees))
const shiftEntries = computed<[string, Shift][]>(() => Object.entries(shifts))

// Employee Modal
const showEmployeeModal = ref(false)
const employeeForm = reactive<{
  id: string
  name: string
  contact: string
  username: string
  email: string
  password: string
}>({
  id: '',
  name: '',
  contact: '',
  username: '',
  email: '',
  password: '',
})

function openEmployeeModal(id = '') {
  const employee = employees.value.find((e) => e.id === id)
  if (id && employee) {
    Object.assign(employeeForm, { ...employee })
    isUpdating.value = true
  } else {
    isUpdating.value = false
    Object.assign(employeeForm, { id: '', name: '', position: '', contact: '' })
  }
  showEmployeeModal.value = true
}
function closeEmployeeModal() {
  showEmployeeModal.value = false
}
function saveEmployee() {
  if (isUpdating.value) {
    updateUserProfile({
      userId: employeeForm.id,
      input: {
        name: employeeForm.name,
        username: employeeForm.username,
        email: employeeForm.email,
        contact: employeeForm.contact,
        password: 'password123',
      },
    })
      .then(() => {
        isUpdating.value = false
        toast.success('Employee updated successfully.')
        employeeStore.fetchUsers()
        closeEmployeeModal()
      })
      .catch(() => {
        toast.error('Failed to update employee. Please try again.')
      })
    return
  }

  addEmployees({
    name: employeeForm.name,
    username: employeeForm.username,
    email: employeeForm.email,
    password: employeeForm.password,
    contact: employeeForm.contact,
  })
    .then(() => {
      isUpdating.value = false
      toast.success('Employee saved successfully.')
      employeeStore.fetchUsers()
      closeEmployeeModal()
    })
    .catch(() => {
      isUpdating.value = false
      toast.error('Failed to save employee. Please try again.')
    })
  // const id = employeeForm.id || `emp${Date.now()}`
  // const initials = employeeForm.name
  //   .split(' ')
  //   .map((n) => n[0])
  //   .join('')
  //   .substring(0, 3)
  // employees[id] = {
  //   name: employeeForm.name,
  //   position: employeeForm.position,
  //   contact: employeeForm.contact,
  //   photoVerified: employees[id]?.photoVerified ?? false,
  //   photoUrl: employees[id]?.photoUrl ?? svgInitials(initials, '#1c0cdc'),
  // }
  // saveJSON('employees', employees)
  closeEmployeeModal()
}

const deleteDialog = createConfirmDialog(ConfirmDialog, {
  content: 'Delete this employee?',
})
function deleteEmployee(id: string) {
  deleteDialog.reveal()
  deleteDialog.onConfirm(() => {
    // Perform deletion
    deleteUser({ userId: id })
      .then(() => {
        toast.success('Employee deleted successfully.')
        employeeStore.fetchUsers()
      })
      .catch(() => {
        toast.error('Failed to delete employee. Please try again.')
      })
  })
  // if (!confirm('Delete this employee?')) return
  // delete employees[id]
  // saveJSON('employees', employees)
  // Object.entries(shifts).forEach(([sid, s]) => {
  //   if (s.employeeId === id) delete shifts[sid]
  // })
  // saveJSON('shifts', shifts)
}

// Shift Modal
const showShiftModal = ref(false)
const shiftForm = reactive<{
  id: string
  employeeId: string
  date: string
  time: string
}>({
  id: '',
  employeeId: '',
  date: '',
  time: '',
})
function openShiftModal(id = '') {
  if (id && shifts[id]) {
    const shift = shifts[id]
    Object.assign(shiftForm, {
      id,
      employeeId: shift.employeeId,
      date: shift.date,
      time: shift.time,
    })
  } else {
    Object.assign(shiftForm, { id: '', employeeId: '', date: '', time: '' })
  }
  showShiftModal.value = true
}
function closeShiftModal() {
  showShiftModal.value = false
}
function saveShift() {
  const id = shiftForm.id || `shift${Date.now()}`
  const employeeName = employees[shiftForm.employeeId]?.name || ''
  shifts[id] = {
    employeeId: shiftForm.employeeId,
    employeeName,
    date: shiftForm.date,
    time: shiftForm.time,
    status: 'Assigned',
  }
  saveJSON('shifts', shifts)
  closeShiftModal()
}
function deleteShift(id: string) {
  if (!confirm('Delete this shift?')) return
  delete shifts[id]
  saveJSON('shifts', shifts)
}

// History
const historySearch = ref('')
const filteredHistory = computed<HistoryRecord[]>(() => {
  const q = historySearch.value.trim().toLowerCase()
  if (!q) return shiftHistory.value
  return shiftHistory.value.filter(
    (r) => r.employeeName.toLowerCase().includes(q) || r.date.toLowerCase().includes(q),
  )
})

// Photo Modal
const showPhotoModal = ref(false)
const activePhotoIndex = ref(-1)
const activePhotoRecord = computed<HistoryRecord | null>(() =>
  activePhotoIndex.value >= 0 ? (shiftHistory.value[activePhotoIndex.value] ?? null) : null,
)

type PresenceItem = {
  id: string
  userId: string
  imageUrl: string
  checkInTime: string
  validated: boolean
}
const presenceRecord = ref<PresenceItem | null>(null)
const activePhotoEmployee = computed<Employee | null>(() =>
  activePhotoRecord.value
    ? (employees.value.find((e) => e.id === activePhotoRecord.value!.employeeId) ?? null)
    : null,
)
function viewPhoto(index: number) {
  activePhotoIndex.value = index
  presenceRecord.value = presences.value[index] ?? null
  showPhotoModal.value = true
}
function closePhotoModal() {
  showPhotoModal.value = false
  activePhotoIndex.value = -1
}
console.log(activePhotoRecord.value)

// Misc
function toggleSidebar() {
  setSidebarVisibility(!showSidebar)
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
  position: relative;
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
.tab-button {
  padding: 0.75rem 1.5rem;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-button.active {
  border-bottom-color: #1c0cdc;
  color: #1c0cdc;
  font-weight: 600;
}
.photo-verification-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
