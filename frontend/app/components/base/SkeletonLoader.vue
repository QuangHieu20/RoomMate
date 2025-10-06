<script setup lang="ts">
interface Props {
  count?: number;
  height?: string;
  width?: string;
  borderRadius?: string;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  count: 1,
  height: '20px',
  width: '100%',
  borderRadius: '8px',
  animated: true,
});
</script>

<template>
  <div
    v-for="i in count"
    :key="i"
    class="skeleton"
    :class="{ 'animate-pulse': animated }"
    :style="{
      height: height,
      width: width,
      borderRadius: borderRadius,
    }"
  ></div>
</template>

<style scoped>
.skeleton {
  @apply bg-gray-200;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
