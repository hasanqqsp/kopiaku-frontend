<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
    <div class="neomorph-card p-6 sm:p-6 md:p-8 rounded-2xl w-full max-w-sm sm:max-w-md fade-in">
      <h1
        class="text-3xl sm:text-4xl font-bold text-center mb-6"
        :style="{ color: 'var(--coffee-color)' }"
      >
        Kopi Aku
      </h1>

      <form @submit.prevent="onSubmit" novalidate>
        <div class="form-control mb-4">
          <label class="label"
            ><span class="label-text font-medium text-black">Username</span></label
          >
          <input
            v-model="email"
            type="text"
            placeholder="Masukkan username Anda"
            class="input input-bordered neomorph-input w-full rounded-full"
            required
          />
        </div>

        <div class="form-control mb-6">
          <label class="label"
            ><span class="label-text font-medium text-black">Password</span></label
          >
          <input
            v-model="password"
            type="password"
            placeholder="Masukkan kata sandi"
            class="input input-bordered neomorph-input w-full rounded-full"
            required
          />
        </div>

        <div class="form-control mt-6">
          <button
            type="submit"
            class="btn neomorph-btn w-full rounded-full font-semibold text-center"
            aria-label="Login to Dashboard Kopi Aku"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else>Memproses...</span>
          </button>
        </div>
      </form>

      <div
        v-if="message"
        :class="[
          'mt-4 p-4 rounded-lg text-center font-medium',
          messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
        ]"
        role="status"
        aria-live="polite"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { login } from '@/utils/api'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('') // 'success' | 'error'
const loading = ref(false)

function onSubmit() {
  message.value = ''
  messageType.value = ''
  if (!email.value || !password.value) {
    messageType.value = 'error'
    message.value = 'Email dan kata sandi wajib diisi.'
    return
  }
  loading.value = true
  login(email.value, password.value)
    .then((data: { id: string }) => {
      // Simulate login request

      // Very basic "mock" validation: accept any non-empty credentials
      messageType.value = 'success'
      message.value = 'Login berhasil. Mengarahkan ke verifikasi foto...'
      localStorage.setItem('employeeId', data.id)
      router.replace({ path: '/photoverification' })
    })
    .catch(() => {
      messageType.value = 'error'
      message.value = 'Gagal login. Periksa kembali email dan kata sandi Anda.'
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --coffee-color: #6b3f2d;
}

/* Soft neomorphic card */
.neomorph-card {
  background: #eef2f7;
  box-shadow:
    8px 8px 18px rgba(163, 177, 198, 0.35),
    -8px -8px 18px rgba(255, 255, 255, 0.7);
}

/* Inputs and buttons subtle inset */
.neomorph-input {
  background: linear-gradient(180deg, #f7fbff, #eef6ff);
  box-shadow:
    inset 6px 6px 12px rgba(163, 177, 198, 0.25),
    inset -6px -6px 12px rgba(255, 255, 255, 0.8);
  border: none;
}

/* Button style */
.neomorph-btn {
  /* background: linear-gradient(180deg, #fff, #f1f5f9); */
  box-shadow:
    6px 6px 14px rgba(163, 177, 198, 0.25),
    -6px -6px 14px rgba(255, 255, 255, 0.8);
  border: none;
}

/* Fade-in */
.fade-in {
  animation: fadeIn 320ms ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Make sure the component uses the imported font */
* {
  font-family:
    'Open Sans',
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
}
</style>
