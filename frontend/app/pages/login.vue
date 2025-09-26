<template>
    <div class="w-full h-full bg-white p-8">
      <!-- Logo -->
      <div class="mb-8">
        <div class="flex items-center space-x-3">
          <img 
            src="/assets/images/logo-in-page.svg" 
            alt="RoomMate Logo" 
            class="w-[208px] h-[48px] object-contain"
          />
        </div>
      </div>
  
      <!-- Header -->
      <div class="mb-8 max-w-[80%] mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">
          Đăng Nhập
        </h2>
        <p class="text-gray-600 text-sm leading-relaxed">
          Gia nhập cộng đồng <span class="text-blue-600 font-medium">RoomMate</span> của chúng tôi hôm nay<br>
          Tạo tài khoản để mở ra cơ hội và trải nghiệm mới
        </p>
      </div>
  
      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-6 max-w-[80%] mx-auto">
        <!-- Email Field -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.email }"
            placeholder="Email*"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Mật khẩu"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="!showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>
  
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          {{ loading ? 'Đang tạo tài khoản...' : 'Tiếp tục' }}
        </button>
  
        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản? 
            <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              Đăng nhập
            </NuxtLink>
          </p>
        </div>
  
        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Hoặc sử dụng</span>
          </div>
        </div>
  
        <!-- Google Button -->
        <button
          type="button"
          class="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Tiếp tục với Google</span>
        </button>
      </form>
      
      <!-- Toast Notifications -->
      <ClientOnly>
        <div v-if="showSuccessToast" class="fixed top-4 right-4 z-50">
          <div class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
        
        <div v-if="showErrorToast" class="fixed top-4 right-4 z-50">
          <div class="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </ClientOnly>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'auth'
  })
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  
  const loading = ref(false)
  const showPassword = ref(false)
  const showSuccessToast = ref(false)
  const showErrorToast = ref(false)
  const toastMessage = ref('')
  const errors = reactive({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  
  const validateForm = () => {
    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = '')
    
    let isValid = true
    
    // Name validation
    if (!form.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên'
      isValid = false
    } else if (form.name.trim().length < 2) {
      errors.name = 'Họ và tên phải có ít nhất 2 ký tự'
      isValid = false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email'
      isValid = false
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Địa chỉ email không hợp lệ'
      isValid = false
    }
    
    // Phone validation (optional)
    if (form.phone && !/^[0-9+\-\s()]+$/.test(form.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ'
      isValid = false
    }
    
    // Password validation
    if (!form.password) {
      errors.password = 'Vui lòng nhập mật khẩu'
      isValid = false
    } else if (form.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      isValid = false
    }
    
    return isValid
  }
  
  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }
    
    loading.value = true
    
    try {
      console.log('Đăng ký:', form)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success toast
      showSuccessToast.value = true
      toastMessage.value = 'Đăng ký thành công!'
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        showSuccessToast.value = false
      }, 3000)
      
    } catch (error) {
      console.error('Lỗi đăng ký:', error)
      
      // Show error toast
      showErrorToast.value = true
      toastMessage.value = 'Có lỗi xảy ra, vui lòng thử lại!'
      
      setTimeout(() => {
        showErrorToast.value = false
      }, 3000)
    } finally {
      loading.value = false
    }
  }
  </script>