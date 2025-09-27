<script setup lang="ts">
import { UserCircleIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="w-11/12 h-[82px] mx-auto flex justify-between items-center py-2 bg-white">
    <div class="w-3/12">
      <img
          class="w-[180px] h-[27px]"
          src="/assets/images/logo-in-page.svg"
          alt="RoomMate" />
    </div>
    <div class="flex items-center gap-4">
      <NuxtLink to="/messages"
         class="p-2 text-gray-600 hover:text-cyan-500 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </NuxtLink>
      <NuxtLink to="/login"
         class="flex items-center gap-1 btn bg-cyan-500 text-white">
        <UserCircleIcon class="w-[18px]"/>
        Login
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>