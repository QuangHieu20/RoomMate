<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'textarea'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: boolean
  errorMessage?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'ghost'
  maxlength?: number
  rows?: number
  modelValue?: string | number
  class?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'input', event: Event): void
  (e: 'change', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  error: false,
  size: 'md',
  variant: 'bordered',
  rows: 3
})

const emit = defineEmits<Emits>()

// Computed classes for styling
const inputClasses = computed(() => {
  const baseClasses = 'transition-all duration-200 focus:outline-none'
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  }
  
  // Variant classes
  const variantClasses = {
    default: 'bg-transparent border-none',
    bordered: 'input input-bordered bg-gray-100 focus:bg-white focus:border-cyan-500',
    ghost: 'input input-ghost bg-transparent'
  }
  
  // Error state
  const errorClass = props.error ? 'border-red-500' : ''
  
  // Disabled state
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  // Readonly state
  const readonlyClass = props.readonly ? 'bg-base-200' : ''
  
  // Merge with custom class prop (custom class has priority)
  const defaultClasses = [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    errorClass,
    disabledClass,
    readonlyClass
  ].join(' ')
  
  // Custom class overrides default classes
  return props.class ? `${defaultClasses} ${props.class}` : defaultClasses
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

// Handle VeeValidate field events
const handleFieldChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('change', event)
}

const handleFieldBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<template>
  <div class="form-control">
    <!-- Label -->
    <label v-if="label" class="label">
      <span class="label-text text-sm font-medium text-black">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </span>
    </label>
    
    <!-- Input Field -->
    <div v-if="$slots.subTitle" class="inline-flex items-stretch w-full">
      <!-- Input field (left side) -->
      <div class="flex-1">
        <!-- Text Input -->
        <input
          v-if="type !== 'textarea'"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :maxlength="maxlength"
          :class="[inputClasses, 'w-full border-r-0 rounded-r-none rounded-l-lg']"
          :value="modelValue"
          @input="handleInput"
          @change="handleFieldChange"
          @focus="handleFocus"
          @blur="handleFieldBlur"
        />
        
        <!-- Textarea -->
        <textarea
          v-else
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :maxlength="maxlength"
          :rows="rows"
          :class="[inputClasses, 'textarea textarea-bordered resize-none w-full border-r-0 rounded-r-none rounded-l-lg']"
          :value="modelValue"
          @input="handleInput"
          @change="handleFieldChange"
          @focus="handleFocus"
          @blur="handleFieldBlur"
        />
      </div>
      
      <!-- SubTitle section (right side) -->
      <div class="bg-gray-200 text-cyan-500 px-3 flex items-center border border-gray-300 rounded-r-lg border-l-0">
        <slot name="subTitle">
          SubTitle
        </slot>
      </div>
    </div>
    
    <!-- Default input without subTitle -->
    <div v-else class="relative w-full">
      <!-- Text Input -->
      <input
        v-if="type !== 'textarea'"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :class="[inputClasses, 'w-full']"
        :value="modelValue"
        @input="handleInput"
        @change="handleFieldChange"
        @focus="handleFocus"
        @blur="handleFieldBlur"
      />
      
      <!-- Textarea -->
      <textarea
        v-else
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :rows="rows"
        :class="[inputClasses, 'textarea textarea-bordered resize-none w-full']"
        :value="modelValue"
        @input="handleInput"
        @change="handleFieldChange"
        @focus="handleFocus"
        @blur="handleFieldBlur"
      />
    </div>
    
    <!-- Error Message -->
    <div v-if="error && errorMessage" class="label">
      <span class="label-text-alt text-red-500 text-sm">{{ errorMessage }}</span>
    </div>
  </div>
</template>
