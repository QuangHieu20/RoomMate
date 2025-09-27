<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  backdrop?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'update:isOpen', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closable: true,
  backdrop: true
})

const emit = defineEmits<Emits>()

// Computed classes for modal size
const modalSizeClasses = computed(() => {
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm', 
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }
  return sizeClasses[props.size]
})

// Handle close modal
const closeModal = () => {
  emit('close')
  emit('update:isOpen', false)
}

// Handle backdrop click
const handleBackdropClick = (event: MouseEvent) => {
  if (props.backdrop && event.target === event.currentTarget) {
    closeModal()
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closable) {
    closeModal()
  }
}

// Add/remove event listeners and body scroll lock
onMounted(() => {
  if (props.isOpen) {
    document.addEventListener('keydown', handleEscapeKey)
    document.body.classList.add('overflow-hidden')
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.classList.remove('overflow-hidden')
})

// Watch for isOpen changes
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscapeKey)
    document.body.classList.add('overflow-hidden')
  } else {
    document.removeEventListener('keydown', handleEscapeKey)
    document.body.classList.remove('overflow-hidden')
  }
})
</script>

<template>
  <!-- Modal Backdrop -->
  <Transition
    name="modal-backdrop"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="handleBackdropClick"
    >
      <!-- Modal Container -->
      <Transition
        name="modal-content"
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div 
          :class="[
            'bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col',
            modalSizeClasses
          ]"
          @click.stop
        >
      <!-- Modal Header -->
      <div v-if="title || closable" class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <div v-else class="flex-1"></div>
        
        <button 
          v-if="closable"
          @click="closeModal"
          class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto flex-1 min-h-0">
        <slot />
      </div>

      <!-- Modal Footer (Optional) -->
      <div v-if="$slots.footer" class="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <slot name="footer" />
      </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Animation styles are now handled by Vue Transition classes */
</style>
