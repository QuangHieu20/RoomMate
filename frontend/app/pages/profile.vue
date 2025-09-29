<template>
  <div class="w-full h-full bg-white p-8">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        Thông tin cá nhân
      </h2>
      <p class="text-gray-600 text-sm">
        Quản lý thông tin tài khoản của bạn
      </p>
    </div>

    <!-- Profile Form -->
    <form @submit.prevent="handleUpdateProfile" class="space-y-6 max-w-[80%] mx-auto">
      <!-- Full Name Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
        <input
          v-model="form.fullName"
          type="text"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Nhập họ và tên"
        />
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          disabled
          class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
          placeholder="Email"
        />
      </div>

      <!-- Phone Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        {{ loading ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
      </button>
    </form>

    <!-- Toast Notifications -->
    <ClientOnly>
      <div v-if="toast.show" class="fixed top-4 right-4 z-50">
        <div 
          class="px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          :class="{
            'bg-green-500 text-white': toast.type === 'success',
            'bg-red-500 text-white': toast.type === 'error',
            'bg-yellow-500 text-white': toast.type === 'warning',
            'bg-blue-500 text-white': toast.type === 'info'
          }"
        >
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { ToastMessage } from '~/types/auth'

definePageMeta({
  layout: 'default'
})

// Composable
const { get, put } = useApi()

// Form data
const form = reactive({
  fullName: '',
  email: '',
  phone: ''
})

// UI state
const loading = ref(false)

// Toast state
const toast = reactive<ToastMessage & { show: boolean }>({
  show: false,
  type: 'info',
  message: '',
  duration: 3000
})

// Show toast function
const showToast = (type: ToastMessage['type'], message: string, duration = 3000) => {
  toast.type = type
  toast.message = message
  toast.duration = duration
  toast.show = true
  
  setTimeout(() => {
    toast.show = false
  }, duration)
}

// Load user profile
const loadProfile = async () => {
  try {
    // API call với HttpOnly cookies tự động gửi kèm
    const user = await get('/users/profile')
    
    form.fullName = user.fullName
    form.email = user.email
    form.phone = user.phone
  } catch (error: any) {
    console.error('Lỗi tải thông tin:', error)
    showToast('error', 'Không thể tải thông tin người dùng')
  }
}

// Update profile
const handleUpdateProfile = async () => {
  loading.value = true
  
  try {
    // API call với HttpOnly cookies tự động gửi kèm
    await put('/users/profile', {
      fullName: form.fullName,
      phone: form.phone
    })
    
    showToast('success', 'Cập nhật thông tin thành công!')
  } catch (error: any) {
    console.error('Lỗi cập nhật:', error)
    showToast('error', error.message || 'Có lỗi xảy ra khi cập nhật')
  } finally {
    loading.value = false
  }
}

// Load profile on mount
onMounted(() => {
  loadProfile()
})
</script>
