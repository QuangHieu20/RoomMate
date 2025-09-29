<template>
  <div class="w-full h-full bg-white p-8">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        Đăng tin mới
      </h2>
      <p class="text-gray-600 text-sm">
        Chia sẻ thông tin tìm bạn ở ghép với cộng đồng
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleCreatePost" class="space-y-6 max-w-[80%] mx-auto">
      <!-- Title Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề*</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Nhập tiêu đề bài đăng"
        />
      </div>

      <!-- Description Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả*</label>
        <textarea
          v-model="form.description"
          required
          rows="4"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Mô tả chi tiết về nhu cầu tìm bạn ở ghép..."
        ></textarea>
      </div>

      <!-- Location Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Địa điểm*</label>
        <input
          v-model="form.location"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Nhập địa điểm"
        />
      </div>

      <!-- Price Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Giá thuê (VND/tháng)</label>
        <input
          v-model="form.price"
          type="number"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Nhập giá thuê"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        {{ loading ? 'Đang đăng tin...' : 'Đăng tin' }}
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
const { post } = useApi()
const router = useRouter()

// Form data
const form = reactive({
  title: '',
  description: '',
  location: '',
  price: ''
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

// Handle create post
const handleCreatePost = async () => {
  loading.value = true
  
  try {
    // API call với HttpOnly cookies tự động gửi kèm
    await post('/posts', {
      title: form.title,
      description: form.description,
      location: form.location,
      price: form.price ? parseInt(form.price) : null
    })
    
    showToast('success', 'Đăng tin thành công!')
    
    // Redirect to home page
    setTimeout(() => {
      router.push('/')
    }, 1000)
    
  } catch (error: any) {
    console.error('Lỗi đăng tin:', error)
    showToast('error', error.message || 'Có lỗi xảy ra khi đăng tin')
  } finally {
    loading.value = false
  }
}
</script>
