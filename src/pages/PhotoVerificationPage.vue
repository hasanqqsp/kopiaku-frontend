<template>
  <div class="page-root">
    <div class="verify-card p-8">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Shift Verification</h1>
        <p class="text-gray-600 mb-1">
          Welcome, <span class="font-semibold text-primary-blue">{{ employeeName }}</span>
        </p>
        <p class="text-gray-500 text-sm">Upload your photo to verify your identity</p>
      </div>

      <div class="mb-6">
        <div
          v-if="!uploadedPhotoUrl && !streamActive"
          class="photo-placeholder"
          @click="startCamera"
        >
          <div class="text-center">
            <svg
              class="w-16 h-16 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <p class="text-sm text-gray-500">Click to use camera</p>
          </div>
        </div>

        <div
          v-show="streamActive"
          class="mx-auto block"
          style="width: 200px; height: 200px; position: relative"
        >
          <video ref="videoRef" class="photo-preview" playsinline autoplay muted></video>
        </div>

        <img
          v-if="uploadedPhotoUrl"
          :src="uploadedPhotoUrl"
          class="photo-preview mx-auto block"
          alt="Preview"
          @click="retake"
        />

        <p v-if="cameraError" class="text-center text-sm text-red-600 mt-2">{{ cameraError }}</p>
      </div>

      <div class="space-y-3">
        <div v-if="streamActive" class="flex gap-3">
          <button
            class="flex-1 bg-primary-blue text-white py-3 rounded-lg font-bold hover:bg-opacity-90 shadow-md transition-all"
            @click="capturePhoto"
          >
            Capture
          </button>
          <button
            class="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all"
            @click="stopCamera"
          >
            Cancel
          </button>
        </div>

        <button
          :disabled="!uploadedPhotoUrl"
          :class="continueButtonClass"
          @click="continueToDashboard"
        >
          Continue to Dashboard
        </button>

        <button
          class="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-semibold mb-1">Why do we need your photo?</p>
            <p class="text-blue-700">
              Photo verification ensures shift accountability and helps maintain security for our
              POS system.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- hidden canvas used for capture -->
    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useCheckInStore } from '@/stores/checkIn'
import { useUserStore } from '@/stores/user'
import { checkIn, getCurrentUser, getMyPresence } from '@/utils/api'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const employeeName = ref<string>('')
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const uploadedPhotoUrl = ref<string | null>(null)
const streamActive = ref<boolean>(false)
let mediaStream: MediaStream | null = null
const cameraError = ref<string | null>(null)
const capturedPhoto = ref<File | null>(null)
const checkInStore = useCheckInStore()
const router = useRouter()
onMounted(async () => {
  const userStore = useUserStore()
  await getCurrentUser().then((user) => {
    userStore.setCurrentUser(user)
    employeeName.value = user.name
    localStorage.setItem('employeeId', user.id.toString())
  })
  if (userStore.currentUser && userStore.currentUser.role === 'Admin') {
    router.push('/')
    return
  }
  await getMyPresence().then((presence) => {
    const checkInDateTime = new Date(presence?.checkInTime || '')
    const now = new Date()
    const isSameDay =
      checkInDateTime.getFullYear() === now.getFullYear() &&
      checkInDateTime.getMonth() === now.getMonth() &&
      checkInDateTime.getDate() === now.getDate()
    console.log('Presence', presence, 'Is same day:', isSameDay)
    if (presence && isSameDay) {
      localStorage.setItem('needsPhotoVerification', 'false')
      router.replace('/cashier')
      return
    } else {
      localStorage.setItem('needsPhotoVerification', 'true')
    }
  })

  const employeeId = localStorage.getItem('employeeId')
  const needsVerification = localStorage.getItem('needsPhotoVerification')

  if (!employeeId || needsVerification !== 'true') {
    router.push('/login')
    return
  }
})

onBeforeUnmount(() => {
  stopCamera()
})

async function startCamera(): Promise<void> {
  cameraError.value = null
  try {
    const constraints = { video: { facingMode: 'user' }, audio: false }
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      console.log('Camera stream started')
      // // assign stream to video element
    }
    streamActive.value = true
  } catch (err: unknown) {
    cameraError.value =
      'Unable to access camera. Please allow camera permission or use a supported device.'
    streamActive.value = false
    stopCamera()
    console.error('Camera error', err instanceof Error ? err.message : err)
  }
}

function stopCamera(): void {
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop())
    mediaStream = null
  }
  if (videoRef.value) {
    // pause and remove srcObject to release camera and stop rendering
    try {
      videoRef.value.pause()
    } catch {
      /* ignore pause errors */
    }
    try {
      videoRef.value.srcObject = null
    } catch {
      videoRef.value.removeAttribute('src')
    }
  }
  streamActive.value = false
}

function capturePhoto(): void {
  const video = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas) return

  const w = video.videoWidth || 640
  const h = video.videoHeight || 480
  // make canvas square to match circular preview
  const size = Math.min(w, h)
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // draw centered square from video
  const sx = (w - size) / 2
  const sy = (h - size) / 2
  ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)

  uploadedPhotoUrl.value = canvas.toDataURL('image/png')
  canvas.toBlob((blob) => {
    if (blob) {
      capturedPhoto.value = new File([blob], 'photo.png', { type: 'image/png' })
    }
  }, 'image/png')
  stopCamera()
}

function retake(): void {
  uploadedPhotoUrl.value = null
  startCamera()
}

const continueButtonClass = computed(() =>
  uploadedPhotoUrl.value
    ? 'w-full bg-primary-blue text-white py-3 rounded-lg font-bold hover:bg-opacity-90 shadow-md transition-all'
    : 'w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed transition-all',
)

function continueToDashboard(): void {
  if (!uploadedPhotoUrl.value) return
  checkIn({
    file: capturedPhoto.value!,
  })
    .then((response) => {
      console.log('Check-in successful', response)
      checkInStore.setLastCheckIn(response)
      localStorage.removeItem('needsPhotoVerification')
      localStorage.setItem('lastCheckIn', JSON.stringify(response))
      router.push('/cashier')
    })
    .catch((error) => {
      cameraError.value = 'Failed to verify photo. Please try again.'
    })
}

function logout(): void {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* replicate original gradient */
  background: linear-gradient(135deg, #1c0cdc 0%, #6f4e37 100%);
  font-family: 'Inter', sans-serif;
  padding: 1rem;
}

.verify-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 450px;
  width: 100%;
  margin: 1rem;
}

.photo-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 4px solid #1c0cdc;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

/* make video behave like image preview */
video.photo-preview {
  background: #000;
}

/* hidden canvas */
.hidden {
  display: none;
}

.photo-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 4px dashed #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.photo-placeholder:hover {
  border-color: #1c0cdc;
  background: #f3f4f6;
}

/* ensure primary-blue class used in computed button class resolves if Tailwind isn't configured */
.bg-primary-blue {
  background-color: #1c0cdc;
}
</style>
