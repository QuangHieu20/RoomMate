<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
  modelValue?: string | number;
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  class?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'change', event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  required: false,
  error: false,
  size: 'md',
  variant: 'bordered',
});

const emit = defineEmits<Emits>();

// Computed classes for styling
const selectClasses = computed(() => {
  const baseClasses = 'select transition-all duration-200 focus:outline-none';

  // Size classes
  const sizeClasses = {
    sm: 'select-sm',
    md: 'select-md',
    lg: 'select-lg',
  };

  // Variant classes
  const variantClasses = {
    default: 'select-ghost',
    bordered:
      'select-bordered bg-gray-100 focus:bg-white focus:border-cyan-500',
    ghost: 'select-ghost bg-transparent',
  };

  // Error state
  const errorClass = props.error ? 'border-red-500' : '';

  // Disabled state
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Readonly state
  const readonlyClass = props.readonly ? 'bg-base-200' : '';

  // Merge with custom class prop (custom class has priority)
  const defaultClasses = [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    errorClass,
    disabledClass,
    readonlyClass,
    'w-full',
  ].join(' ');

  // Custom class overrides default classes
  return props.class ? `${defaultClasses} ${props.class}` : defaultClasses;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  emit('change', event);
};

// Handle VeeValidate field events
const handleFieldChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  emit('change', event);
};

const handleFieldBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};
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

    <!-- Select Field -->
    <select
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      :value="modelValue"
      @change="handleFieldChange"
      @focus="handleFocus"
      @blur="handleFieldBlur"
    >
      <option value="" disabled>{{ placeholder || 'Chọn...' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Error Message -->
    <div v-if="error && errorMessage" class="label">
      <span class="label-text-alt text-red-500 text-sm">{{
        errorMessage
      }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Ensure select elements take full width */
select {
  width: 100%;
  min-width: 0;
}

/* Override DaisyUI select styles if needed */
.select {
  width: 100%;
  min-width: 0;
}
</style>
