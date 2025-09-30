<template>
  <div class="w-full h-full bg-white p-8">
    <!-- Logo -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img 
            src="/assets/images/logo-in-page.svg" 
            alt="RoomMate Logo" 
            class="w-[208px] h-[48px] object-contain"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />    
        </div>
        <!-- Language Switcher -->
        <LanguageSwitcher />
      </div>
    </div>

    <!-- Header -->
    <div class="mb-8 max-w-[80%] mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        {{ t('auth.register.title') }}
      </h2>
      <p class="text-gray-600 text-sm leading-relaxed">
        {{ t('auth.register.subtitle', { brand: t('brand.name') }) }}<br>
        {{ t('auth.register.subtitle2') }}
      </p>
    </div>

    <!-- Form -->
    <VeeForm 
      @submit.prevent="handleRegister" 
      :validation-schema="validationSchema"
      class="space-y-6 max-w-[80%] mx-auto"
    >
      <!-- Email Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.register.email') }}*</label>
        <VeeField
          name="email"
          type="email"
          v-slot="{ field, errorMessage }"
        >
          <input
            v-bind="field"
            type="email"
            class="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errorMessage }"
            :placeholder="t('auth.register.emailPlaceholder')"
          />
        </VeeField>
        <VeeErrorMessage name="email" class="text-red-500 text-sm mt-1" />
      </div>

      <!-- Phone Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.register.phone') }}*</label>
        <VeeField
          name="phone"
          type="tel"
          v-slot="{ field, errorMessage }"
        >
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 text-sm">🇻🇳 +84</span>
            </div>
            <input
              v-bind="field"
              type="tel"
              class="w-full pl-16 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errorMessage }"
              :placeholder="t('auth.register.phonePlaceholder')"
            />
          </div>
        </VeeField>
        <VeeErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
      </div>

      <!-- Name Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.register.fullName') }}*</label>
        <VeeField
          name="fullName"
          type="text"
          v-slot="{ field, errorMessage }"
        >
          <input
            v-bind="field"
            type="text"
            class="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errorMessage }"
            :placeholder="t('auth.register.namePlaceholder')"
          />
        </VeeField>
        <VeeErrorMessage name="fullName" class="text-red-500 text-sm mt-1" />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.register.password') }}*</label>
        <VeeField
          name="password"
          v-slot="{ field, errorMessage }"
        >
          <div class="relative">
            <input
              v-bind="field"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errorMessage }"
              :placeholder="t('auth.register.passwordPlaceholder')"
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
        </VeeField>
        <VeeErrorMessage name="password" class="text-red-500 text-sm mt-1" />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        {{ loading ? t('auth.register.registerButtonLoading') : t('auth.register.registerButton') }}
      </button>

      <!-- Login Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ t('auth.register.hasAccount') }} 
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
            {{ t('auth.register.loginLink') }}
          </NuxtLink>
        </p>
      </div>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">{{ t('auth.register.orUse') }}</span>
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
        <span>{{ t('auth.register.googleButton') }}</span>
      </button>
    </VeeForm>
    
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
          <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { RegisterDto, ToastMessage } from '~/types/auth'
import { useValidationSchema } from '~/composables/useValidation'
import { toTypedSchema } from '@vee-validate/yup'

definePageMeta({
  layout: 'auth'
})
// Composable
const { register, saveToken } = useAuth()
const router = useRouter()

// Validation schema với i18n (useI18n() được gọi bên trong)
const { registerSchema } = useValidationSchema()
const validationSchema = computed(() => toTypedSchema(registerSchema.value))

// i18n cho UI
const { t } = useI18n()

// i18n Composition API (thay thế Options API cũ)

// UI state
const loading = ref(false)
const showPassword = ref(false)

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

// Handle register
const handleRegister = async (values: any, { setFieldError, errors, isSubmitting }: any) => {
  try {
    loading.value = true
    
    // Call API (token automatically saved to HttpOnly cookie by backend)
    const response = await register(values as RegisterDto)
  
    // Show success toast
    showToast('success', t('auth.messages.registerSuccess'))
    
    // Redirect to home page
    setTimeout(() => {
      router.push('/')
    }, 1000)
    
  } catch (error: any) {
    console.error('Lỗi đăng ký:', error)
    
    // Show general error message
    const errorMessage = error.message || t('auth.messages.registerError')
    showToast('error', errorMessage)
    
  } finally {
    loading.value = false
  }
}
</script>