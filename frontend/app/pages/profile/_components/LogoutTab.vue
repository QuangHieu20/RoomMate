<script setup lang="ts">
// Props
interface Props {
  // Add any props needed for logout
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  // Add any emits needed for logout
}>()
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
    <div class="card-body">
      <h2 class="text-2xl font-bold mb-4 text-error">Đăng xuất</h2>
      <p class="text-base-content/70">Bạn có chắc chắn muốn đăng xuất?</p>
      <button class="btn btn-error mt-4">Xác nhận đăng xuất</button>
    </div>
  </div>
</template>
