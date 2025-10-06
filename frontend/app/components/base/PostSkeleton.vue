<script setup lang="ts">
interface Props {
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 3,
});
</script>

<template>
  <div
    v-for="i in count"
    :key="i"
    class="w-full flex flex-col gap-4 min-w-0 min-h-0 bg-white rounded-[16px] border border-border-light p-6 mb-8"
  >
    <!-- Header skeleton -->
    <div class="flex items-center gap-4 mb-6">
      <!-- Avatar skeleton -->
      <div
        class="w-[68px] h-[68px] rounded-full bg-gray-200 animate-pulse"
      ></div>
      <!-- Name and time skeleton -->
      <div class="flex flex-col gap-2">
        <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <!-- Content skeleton -->
    <div class="w-full min-w-0 mt-6 space-y-2">
      <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <!-- Media skeleton -->
    <div class="mt-6">
      <div class="card w-full">
        <div class="h-64 w-full bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>

    <!-- Control buttons skeleton -->
    <div class="w-full min-w-0 flex items-center justify-between mt-6">
      <div class="flex items-start justify-self-center w-3/6 gap-10">
        <div class="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div class="flex items-center justify-end w-1/6">
        <div class="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
