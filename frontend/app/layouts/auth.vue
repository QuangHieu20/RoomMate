<script setup lang="ts">

</script>

<template>
   <div class="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
     <div class="relative w-full sm:w-11/12 lg:w-10/12 max-w-7xl">
       <!-- Div nền nghiêng - ẩn trên mobile/tablet -->
       <div class="hidden lg:block text-white rounded-[30px] absolute inset-0" style="background: linear-gradient(135deg, #A0DBFF 0%, #3FB6FF 100%); transform: rotate(2.7deg);"></div>
       
       <!-- Layout Desktop: Side by side -->
       <div class="hidden lg:block text-white rounded-[30px] relative z-10">
        <div class="w-full h-full main-form flex items-center">
          <div class="h-[80vh] bg-cover bg-no-repeat relative z-0 rounded-tl-[30px] rounded-bl-[30px] flex-shrink-0" 
          style="width: 35%; background-image: url('/images/bg-form.png'); "></div>
          <div class="min-h-[80vh] bg-white rounded-[30px] relative z-10 ml-[-30px] backdrop-blur-[50px] shadow-lg flex-shrink-0 overflow-y-auto"
          style="width: calc(65% + 30px); box-shadow: 10px 0 25px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.1);">
            <div class="flex items-center justify-center min-h-full">
              <slot/>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout Mobile/Tablet: Overlay -->
      <div class="lg:hidden w-full relative">
        <!-- Background image behind -->
        <div class="h-[80vh] sm:h-[85vh] bg-cover bg-no-repeat rounded-[20px] sm:rounded-[30px] relative z-0" 
        style="background-image: url('/images/bg-form.png'); background-position: center;">
          <!-- Gradient overlay for better form readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-[20px] sm:rounded-[30px]"></div>
        </div>
        
        <!-- Form content overlaid on top -->
        <div class="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
          <div class="bg-white/95 backdrop-blur-sm rounded-[20px] sm:rounded-[30px] shadow-lg overflow-y-auto w-full max-w-md"
          style="box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            <div class="flex items-center justify-center min-h-[60vh] sm:min-h-[70vh]">
              <slot/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>