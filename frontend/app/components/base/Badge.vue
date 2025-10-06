<script setup lang="ts">
interface Props {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  outline?: boolean;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'warning',
  size: 'sm',
  outline: false,
  text: 'Đang phát triển',
});

const badgeClasses = computed(() => {
  const baseClasses = 'badge';
  const sizeClasses = `badge-${props.size}`;
  const variantClasses = props.outline
    ? `badge-outline badge-${props.variant}`
    : `badge-${props.variant}`;

  return `${baseClasses} ${sizeClasses} ${variantClasses}`;
});
</script>

<template>
  <div :class="badgeClasses">
    {{ text }}
  </div>
</template>
