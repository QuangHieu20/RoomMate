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
    <div class="w-[105px] h-[50px] flex justify-between items-center">
      <NuxtLink to="/login"
         class="w-full flex items-center gap-1 btn bg-cyan-500 text-white">
        <UserCircleIcon class="w-[18px]"/>
        Login
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>