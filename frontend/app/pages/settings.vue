<template>
  <div class="w-full h-full bg-white p-8">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        Cài đặt
      </h2>
      <p class="text-gray-600 text-sm">
        Quản lý cài đặt tài khoản và ứng dụng
      </p>
    </div>

    <!-- Settings Form -->
    <div class="space-y-6 max-w-[80%] mx-auto">
      <!-- Notification Settings -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Thông báo</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700">Thông báo tin nhắn</p>
              <p class="text-xs text-gray-500">Nhận thông báo khi có tin nhắn mới</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.messageNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700">Thông báo email</p>
              <p class="text-xs text-gray-500">Nhận thông báo qua email</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Quyền riêng tư</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700">Hiển thị thông tin liên hệ</p>
              <p class="text-xs text-gray-500">Cho phép người khác xem thông tin liên hệ</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.showContactInfo" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <button
        @click="handleSaveSettings"
        :disabled="loading"
        class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        {{ loading ? 'Đang lưu...' : 'Lưu cài đặt' }}
      </button>
    </div>

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

// Settings data
const settings = reactive({
  messageNotifications: true,
  emailNotifications: false,
  showContactInfo: true
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

// Load settings
const loadSettings = async () => {
  try {
    // API call với HttpOnly cookies tự động gửi kèm
    const userSettings = await get('/users/settings')
    
    settings.messageNotifications = userSettings.messageNotifications
    settings.emailNotifications = userSettings.emailNotifications
    settings.showContactInfo = userSettings.showContactInfo
  } catch (error: any) {
    console.error('Lỗi tải cài đặt:', error)
    showToast('error', 'Không thể tải cài đặt')
  }
}

// Save settings
const handleSaveSettings = async () => {
  loading.value = true
  
  try {
    // API call với HttpOnly cookies tự động gửi kèm
    await put('/users/settings', {
      messageNotifications: settings.messageNotifications,
      emailNotifications: settings.emailNotifications,
      showContactInfo: settings.showContactInfo
    })
    
    showToast('success', 'Lưu cài đặt thành công!')
  } catch (error: any) {
    console.error('Lỗi lưu cài đặt:', error)
    showToast('error', error.message || 'Có lỗi xảy ra khi lưu cài đặt')
  } finally {
    loading.value = false
  }
}

// Load settings on mount
onMounted(() => {
  loadSettings()
})
</script>
