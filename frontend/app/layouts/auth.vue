<script setup lang="ts">

</script>

<template>
   <div class="w-full min-h-screen flex items-center justify-center p-8 overflow-hidden">
     <div class="relative w-10/12 max-w-7xl">
       <!-- Div nền nghiêng -->
       <div class="text-white rounded-[30px] absolute inset-0" style="background: linear-gradient(135deg, #A0DBFF 0%, #3FB6FF 100%); transform: rotate(2.7deg);"></div>
       <!-- Div nội dung đè lên -->
       <div class="text-white rounded-[30px] relative z-10">
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
    </div>
  </div>
</template>

<style scoped>
.main-form {

}
</style>