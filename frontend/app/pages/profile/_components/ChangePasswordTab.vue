<script setup lang="ts">
// Props
interface Props {
  // Add any props needed for change password
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  // Add any emits needed for change password
}>()
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
    <div class="card-body">
      <h2 class="text-2xl font-bold mb-4">{{ $t('profile.changePassword.title') }}</h2>
      <p class="text-base-content/70">{{ $t('profile.changePassword.comingSoon') }}</p>
    </div>
  </div>
</template>
