<template>
  <div class="bg-gray-50">
    <!-- Mobile Header -->
    <div
      class="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 flex items-center justify-between p-4"
    >
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg text-primary-blue"
        aria-label="Toggle sidebar"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-xl font-bold">Account</h1>
      <div class="w-10"></div>
    </div>

    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <SidebarComponent />

      <!-- Main Content -->
      <main class="flex-1 p-6 mt-16 md:mt-0">
        <h2 class="text-3xl font-bold mb-6">Account Settings</h2>

        <!-- Profile -->
        <section class="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 class="text-xl font-semibold mb-4">Profile</h3>

          <div class="flex items-center gap-6 mb-6">
            <div class="relative">
              <img
                :src="
                  profile?.avatarUrl ||
                  'https://api.dicebear.com/7.x/initials/svg?seed=' +
                    encodeURIComponent(profile?.name || 'User')
                "
                alt="Profile"
                class="w-24 h-24 rounded-full object-cover ring-2 ring-gray-200"
              />
              <button
                class="absolute bottom-0 right-0 bg-primary-blue text-white text-xs px-2 py-1 rounded-lg shadow"
                @click.prevent="avatarInput?.click()"
              >
                Change
              </button>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarSelected"
              />
            </div>
          </div>

          <form @submit.prevent="saveProfile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Name</label>
              <input
                v-model="profile.name"
                type="text"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-blue outline-none"
                placeholder="Your name"
              />
              <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Username</label>
              <input
                v-model="profile.username"
                type="text"
                disabled
                class="w-full border bg-gray-100 text-gray-500 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Email</label>
              <input
                v-model="profile.email"
                type="email"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-blue outline-none"
                placeholder="you@example.com"
              />
              <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Contact</label>
              <input
                v-model="profile.contact"
                type="text"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-blue outline-none"
                placeholder="+62 ..."
              />
              <p v-if="errors.contact" class="text-xs text-red-500 mt-1">{{ errors.contact }}</p>
            </div>

            <div class="md:col-span-2 flex justify-end gap-3 mt-2">
              <!-- <button type="button" class="px-4 py-2 rounded-lg border" @click="resetProfile">
                Reset
              </button> -->
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-primary-blue text-white disabled:opacity-60"
                :disabled="savingProfile"
              >
                {{ savingProfile ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Change Password Wizard -->
        <section class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4">Change Password</h3>

          <!-- Stepper -->
          <div class="flex items-center gap-4 mb-6">
            <div v-for="n in 3" :key="n" class="flex items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  passwordStep >= n ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ n }}
              </div>
              <div
                v-if="n < 3"
                class="w-10 h-0.5"
                :class="passwordStep > n ? 'bg-primary-blue' : 'bg-gray-200'"
              ></div>
            </div>
          </div>

          <form @submit.prevent="submitPassword">
            <div v-show="passwordStep === 1" class="mb-4">
              <label class="block text-sm text-gray-600 mb-1">Current Password</label>
              <input
                v-model="passwordForm.current"
                type="password"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-blue outline-none"
                placeholder="Enter current password"
              />
              <p v-if="pwErrors.current" class="text-xs text-red-500 mt-1">
                {{ pwErrors.current }}
              </p>
            </div>

            <div v-show="passwordStep === 2" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label class="block text-sm text-gray-600 mb-1">New Password</label>
                <input
                  v-model="passwordForm.next"
                  type="password"
                  class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-blue outline-none"
                  placeholder="At least 8 characters"
                />
                <p v-if="pwErrors.next" class="text-xs text-red-500 mt-1">{{ pwErrors.next }}</p>
                <p v-else class="text-xs text-gray-500 mt-1">
                  Use 8+ chars with letters and numbers.
                </p>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirm"
                  type="password"
                  class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-blue outline-none"
                  placeholder="Re-type new password"
                />
                <p v-if="pwErrors.confirm" class="text-xs text-red-500 mt-1">
                  {{ pwErrors.confirm }}
                </p>
              </div>
            </div>

            <div v-show="passwordStep === 3" class="mb-4">
              <div class="p-4 bg-gray-50 rounded-lg border">
                <p class="text-sm text-gray-700">Ready to update your password.</p>
                <ul class="list-disc pl-5 text-sm text-gray-600 mt-2">
                  <li>Keep it secret and unique.</li>
                  <li>You will need it next login.</li>
                </ul>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button
                type="button"
                class="px-4 py-2 rounded-lg border"
                @click="prevStep"
                :disabled="passwordStep === 1 || changingPassword"
              >
                Back
              </button>
              <div class="flex gap-3">
                <button
                  v-if="passwordStep < 3"
                  type="button"
                  class="px-4 py-2 rounded-lg bg-primary-blue text-white disabled:opacity-60"
                  @click="nextStep"
                  :disabled="changingPassword"
                >
                  Next
                </button>
                <button
                  v-else
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-primary-blue text-white disabled:opacity-60"
                  :disabled="changingPassword"
                >
                  {{ changingPassword ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SidebarComponent from '@/components/SidebarComponent.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { changeUserPassword, getCurrentUser, login, updateUserProfile } from '@/utils/api'
import { toast } from 'vue3-toastify'

type Profile = {
  id: string
  avatarUrl: string | null
  avatarFile: File | null
  name: string
  username: string
  email: string
  contact: string
}

const sidebarStore = useSidebarStore()
const { showSidebar } = storeToRefs(sidebarStore)
const { setSidebarVisibility } = sidebarStore

const toggleSidebar = () => setSidebarVisibility(!showSidebar.value)

const profile = ref<Profile>({
  id: '',
  avatarUrl: null,
  avatarFile: null,
  name: '',
  username: '',
  email: '',
  contact: '',
})
const avatarInput = ref<HTMLInputElement | null>(null)

const errors = reactive<{ name?: string; email?: string; contact?: string; avatar?: string }>({})
const savingProfile = ref(false)

function onAvatarSelected(e: Event) {
  errors.avatar = undefined
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    errors.avatar = 'File must be less than 2MB.'
    target.value = ''
    return
  }
  if (!file.type.startsWith('image/')) {
    errors.avatar = 'Invalid image type.'
    target.value = ''
    return
  }
  profile.value.avatarFile = file
  profile.value.avatarUrl = URL.createObjectURL(file)
}

async function saveProfile() {
  // if (!validateProfile()) return
  savingProfile.value = true
  updateUserProfile({
    userId: profile.value.id,
    input: {
      name: profile.value.name,
      email: profile.value.email,
      contact: profile.value.contact,
      username: profile.value.username,
      password: '',
    },
    file: profile.value.avatarFile || undefined,
  })
    .then(() => {
      toast.success('Profile updated successfully.')
    })
    .catch(() => {
      toast.error('Failed to update profile.')
    })
    .finally(() => {
      savingProfile.value = false
    })
}

/* Change Password Wizard */
const passwordStep = ref<1 | 2 | 3>(1)
const passwordForm = reactive<{ current: string; next: string; confirm: string }>({
  current: '',
  next: '',
  confirm: '',
})
const pwErrors = reactive<{ current?: string; next?: string; confirm?: string }>({})
const changingPassword = ref(false)

async function validateStep(step: number): Promise<boolean> {
  if (step === 1) {
    pwErrors.current = passwordForm.current ? undefined : 'Current password is required.'
    await login(profile.value.username, passwordForm.current)
      .then(() => {
        pwErrors.current = undefined
      })
      .catch(() => {
        pwErrors.current = 'Current password is incorrect.'
      })
    return !pwErrors.current
  }
  return true
}

async function nextStep() {
  if (await validateStep(passwordStep.value)) {
    passwordStep.value = (passwordStep.value + 1) as 1 | 2 | 3
  }
}

function prevStep() {
  if (passwordStep.value > 1) passwordStep.value = (passwordStep.value - 1) as 1 | 2 | 3
}

async function submitPassword() {
  if (!(await validateStep(2))) {
    passwordStep.value = 2
    return
  }
  changingPassword.value = true
  changeUserPassword({
    userId: profile.value.id,
    newPassword: passwordForm.next,
  })
    .then(() => {
      toast.success('Password updated successfully.')
      passwordForm.current = ''
      passwordForm.next = ''
      passwordForm.confirm = ''
      passwordStep.value = 1
    })
    .catch(() => {
      toast.error('Failed to update password.')
    })
    .finally(() => {
      changingPassword.value = false
    })
}

onMounted(() => {
  getCurrentUser().then((user) => {
    profile.value = {
      id: user.id,
      avatarUrl: user.profilePictureUrl,
      avatarFile: null,
      name: user.name,
      username: user.username,
      email: user.email,
      contact: user.contact || '',
    }
  })
})
</script>
