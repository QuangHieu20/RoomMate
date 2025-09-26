<script lang="ts">

</script>
<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
   <AppHeader/>
    
    <!-- Main Content -->
    <main class="w-full min-w-0 bg-light min-h-screen">
      <div class="w-9/12 mx-auto pt-[32px]">
        <slot />
      </div>
    </main>
  </div>
</template>
