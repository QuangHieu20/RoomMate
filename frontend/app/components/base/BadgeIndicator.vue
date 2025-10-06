<script setup lang="ts">
interface Props {
  text?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Đang phát triển',
  position: 'top-right',
  size: 'sm',
});

const positionClasses = computed(() => {
  const positions = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };
  return positions[props.position];
});
</script>

<template>
  <div class="relative w-full">
    <slot />
    <div
      :class="`badge badge-warning badge-${size} absolute z-10 ${positionClasses}`"
      style="transform: translate(50%, -50%)"
    >
      {{ text }}
    </div>
  </div>
</template>
