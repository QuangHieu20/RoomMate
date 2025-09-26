<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

// Computed classes for styling
const buttonClasses = computed(() => {
  const baseClasses = 'btn font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  // Size classes
  const sizeClasses = {
    xs: 'btn-xs px-2 py-1 text-xs',
    sm: 'btn-sm px-3 py-1.5 text-sm',
    md: 'btn-md px-4 py-2 text-base',
    lg: 'btn-lg px-6 py-3 text-lg',
    xl: 'btn-xl px-8 py-4 text-xl'
  }
  
  // Variant classes
  const variantClasses = {
    default: 'bg-transparent border-none text-gray-700 hover:text-gray-900 focus:ring-gray-500',
    primary: 'btn-primary bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'btn-secondary bg-gray-500 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'btn-success bg-green-500 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'btn-warning bg-yellow-500 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    error: 'btn-error bg-red-500 hover:bg-red-700 text-white focus:ring-red-500',
    info: 'btn-info bg-cyan-500 hover:bg-cyan-700 text-white focus:ring-cyan-500',
    ghost: 'btn-ghost bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    outline: 'btn-outline border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
  }
  
  // State classes
  const stateClasses = props.disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : props.loading 
    ? 'opacity-75 cursor-wait' 
    : 'cursor-pointer'
  
  // Full width class
  const widthClass = props.fullWidth ? 'w-full' : ''
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    stateClasses,
    widthClass
  ].join(' ')
})
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
    
    <!-- Button content -->
    <slot>
      {{ $slots.default ? '' : 'Button' }}
    </slot>
  </button>
</template>

<style scoped>
/* Custom button styles */
.btn {
  @apply inline-flex items-center justify-center font-semibold transition-all duration-200;
}

/* Default variant - no background, no border, minimal styling */
.btn.bg-transparent {
  @apply rounded-none;
}

/* Other variants with rounded corners */
.btn:not(.bg-transparent) {
  @apply rounded-lg;
}

.btn:focus {
  @apply outline-none ring-2 ring-offset-2;
}

.btn:disabled {
  @apply cursor-not-allowed opacity-50;
}

/* DaisyUI button size overrides */
.btn-xs {
  @apply h-8 min-h-8 px-2 text-xs;
}

.btn-sm {
  @apply h-9 min-h-9 px-3 text-sm;
}

.btn-md {
  @apply h-10 min-h-10 px-4 text-base;
}

.btn-lg {
  @apply h-12 min-h-12 px-6 text-lg;
}

.btn-xl {
  @apply h-14 min-h-14 px-8 text-xl;
}
</style>