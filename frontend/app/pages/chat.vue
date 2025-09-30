<script setup lang="ts">
import { ref } from 'vue'

// Reactive data
const newMessage = ref('')

// Methods
const sendMessage = () => {
  if (newMessage.value.trim()) {
    // TODO: Implement send message logic
    newMessage.value = ''
  }
}

// SEO
useHead({
  title: 'Chat - RoomMate',
  meta: [
    { name: 'description', content: 'Trò chuyện với người dùng khác trên RoomMate' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="w-10 h-10 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="User" />
              </div>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">Lê Thị Ánh Tuyết</h1>
              <p class="text-sm text-gray-500">Đang hoạt động</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="flex flex-col h-[calc(100vh-80px)]">
      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-300px)]">
        <!-- Sample Messages -->
        <div class="flex justify-start">
          <div class="flex items-start gap-3 max-w-[70%]">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="User" />
              </div>
            </div>
            <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <p class="text-gray-900">Chào bạn! Mình thấy bạn đang tìm phòng trọ ở khu vực này</p>
              <p class="text-xs text-gray-500 mt-1">10:30</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <div class="flex items-start gap-3 max-w-[70%] flex-row-reverse">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="Me" />
              </div>
            </div>
            <div class="bg-cyan-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
              <p>Đúng rồi, mình đang tìm phòng trọ gần trường Đại học Bách Khoa</p>
              <p class="text-xs text-cyan-100 mt-1">10:32</p>
            </div>
          </div>
        </div>

        <div class="flex justify-start">
          <div class="flex items-start gap-3 max-w-[70%]">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="User" />
              </div>
            </div>
            <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <p class="text-gray-900">Tuyệt! Mình có phòng trọ ở đường Lê Lợi, cách trường 5 phút đi bộ</p>
              <p class="text-xs text-gray-500 mt-1">10:33</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <div class="flex items-start gap-3 max-w-[70%] flex-row-reverse">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="Me" />
              </div>
            </div>
            <div class="bg-cyan-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
              <p>Giá thuê như thế nào vậy bạn?</p>
              <p class="text-xs text-cyan-100 mt-1">10:35</p>
            </div>
          </div>
        </div>

        <div class="flex justify-start">
          <div class="flex items-start gap-3 max-w-[70%]">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="User" />
              </div>
            </div>
            <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <p class="text-gray-900">3.5 triệu/tháng, bao điện nước. Phòng có điều hòa, wifi, nước nóng</p>
              <p class="text-xs text-gray-500 mt-1">10:36</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <div class="flex items-start gap-3 max-w-[70%] flex-row-reverse">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="Me" />
              </div>
            </div>
            <div class="bg-cyan-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
              <p>Nghe ổn đấy! Có thể xem phòng được không?</p>
              <p class="text-xs text-cyan-100 mt-1">10:38</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex items-center gap-3">
          <button class="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <div class="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Nhập tin nhắn..."
              class="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
              @keyup.enter="sendMessage"
            />
            <button class="p-1 text-gray-400 hover:text-cyan-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
              </svg>
            </button>
          </div>
          
          <button 
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            class="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Message animations */
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>