<script setup lang="ts">
import { ref } from 'vue';

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface Message {
  text: string;
  time: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

interface Props {
  selectedChat?: Chat | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'chat-selected': [chat: Chat];
}>();

// Reactive data
const newMessage = ref('');

// Sample data
const chats = ref<Chat[]>([
  {
    id: '1',
    user: {
      id: '1',
      name: 'Lê Thị Ánh Tuyết',
      avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp',
      isOnline: true,
    },
    lastMessage: {
      text: 'Phòng trọ ở đường Lê Lợi, cách trường 5 phút đi bộ',
      time: '10:36',
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Nguyễn Văn Minh',
      avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp',
      isOnline: false,
    },
    lastMessage: {
      text: 'Cảm ơn bạn đã quan tâm!',
      time: '09:15',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Trần Thị Hương',
      avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp',
      isOnline: true,
    },
    lastMessage: {
      text: 'Phòng có điều hòa không bạn?',
      time: '08:45',
      isRead: false,
    },
    unreadCount: 1,
  },
]);

// Methods
const selectChat = (chat: Chat) => {
  emit('chat-selected', chat);
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    // TODO: Implement send message logic
    newMessage.value = '';
  }
};
</script>

<template>
  <div class="bg-white h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-lg font-semibold text-gray-900">Tin nhắn</h2>
    </div>

    <!-- Chat List -->
    <div
      class="flex-1 overflow-y-auto divide-y divide-gray-200 min-h-0 overflow-auto"
    >
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="selectChat(chat)"
        class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        :class="{
          'bg-cyan-50 border-r-4 border-cyan-500': selectedChat?.id === chat.id,
        }"
      >
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div class="avatar">
            <div class="w-12 h-12 rounded-full">
              <img :src="chat.user.avatar" :alt="chat.user.name" />
            </div>
          </div>

          <!-- Chat Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900 truncate">
                {{ chat.user.name }}
              </h3>
              <span class="text-xs text-gray-500">{{
                chat.lastMessage.time
              }}</span>
            </div>
            <p class="text-sm text-gray-600 truncate mt-1">
              {{ chat.lastMessage.text }}
            </p>
          </div>

          <!-- Unread Badge -->
          <div v-if="chat.unreadCount > 0" class="flex-shrink-0">
            <span
              class="bg-cyan-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
            >
              {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="chats.length === 0" class="p-8 text-center">
      <svg
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p class="text-gray-500">Chưa có tin nhắn nào</p>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
