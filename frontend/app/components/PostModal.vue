<script setup lang="ts">
import { ref } from 'vue'
import { 
  HandThumbUpIcon, 
  ChatBubbleBottomCenterTextIcon, 
  ShareIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  CameraIcon,
  FaceSmileIcon
} from '@heroicons/vue/24/outline'
import BaseModal from './base/Modal.vue'
import BaseButton from './base/Button.vue'

interface Props {
  isOpen: boolean
  post?: {
    id: string
    author: {
      name: string
      avatar: string
      timestamp: string
    }
    title: string
    description: string
    requirements: string[]
    likes: number
    comments: number
    shares: number
  }
}

interface Emits {
  (e: 'close'): void
  (e: 'update:isOpen', value: boolean): void
  (e: 'like', postId: string): void
  (e: 'comment', postId: string, comment: string): void
  (e: 'share', postId: string): void
  (e: 'contact', postId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const newComment = ref('')
const isLiked = ref(false)

// Sample comments data
const comments = ref([
  {
    id: '1',
    author: {
      name: 'Lê Thị Ánh Tuyết',
      avatar: '/assets/images/logo-in-page.svg'
    },
    content: 'Em xin đc ạ',
    timestamp: '39 phút'
  },
  {
    id: '1',
    author: {
      name: 'Lê Thị Ánh Tuyết',
      avatar: '/assets/images/logo-in-page.svg'
    },
    content: 'Em xin đc ạ',
    timestamp: '39 phút'
  },
  {
    id: '1',
    author: {
      name: 'Lê Thị Ánh Tuyết',
      avatar: '/assets/images/logo-in-page.svg'
    },
    content: 'Em xin đc ạ',
    timestamp: '39 phút'
  }
])

const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', props.post?.id || '')
}

const handleComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: Date.now().toString(),
      author: {
        name: 'Bạn',
        avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'
      },
      content: newComment.value,
      timestamp: 'Vừa xong'
    })
    newComment.value = ''
    emit('comment', props.post?.id || '', newComment.value)
  }
}

const handleShare = () => {
  emit('share', props.post?.id || '')
}

const handleContact = () => {
  emit('contact', props.post?.id || '')
}
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="`Bài viết của ${post?.author.name || 'Người dùng'}`"
    size="xl"
    @close="$emit('close')"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div class="space-y-6">
      <!-- Post Header -->
      <div class="flex items-start gap-4">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full">
            <img :src="post?.author.avatar || 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'" />
          </div>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900">{{ post?.author.name || 'Nguyễn Quang Hiếu' }}</h4>
          <p class="text-sm text-gray-500">{{ post?.author.timestamp || '25/09/2025 12:24 PM' }}</p>
        </div>
      </div>

      <!-- Post Content -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900">
          {{ post?.title || 'Tìm phòng trọ Quận 1 hoặc Quận 3, ngân sách 3 triệu' }}
        </h2>
        
        <p class="text-gray-700 leading-relaxed text-sm">
          {{ post?.description || 'Mình là sinh viên năm 2, cần tìm 1 phòng trọ hoặc ở ghép gần trung tâm để tiện đi học và làm thêm.' }}
        </p>

        <!-- Requirements List -->
        <ul class="space-y-2 text-gray-700 text-sm">
          <li v-for="requirement in (post?.requirements || [
            'Ngân sách: dưới 3.000.000đ/tháng.',
            'Yêu cầu: Có WiFi, giờ giấc tự do, WC riêng càng tốt.',
            'Ưu tiên gần các tuyến bus đi qua trường Đại học Kinh tế.'
          ])" :key="requirement" class="flex items-start gap-2">
            <span class="text-cyan-500 mt-1">•</span>
            <span>{{ requirement }}</span>
          </li>
        </ul>
      </div>

      <!-- Engagement Bar -->
      <div class="flex items-center justify-between py-4 border-t border-gray-200">
        <div class="flex items-center gap-6">
          <BaseButton
            :variant="isLiked ? 'success' : 'ghost'"
            size="sm"
            @click="handleLike"
            class="flex items-center gap-2"
          >
            <HandThumbUpIcon class="w-5 h-5" />
            <span>{{ (post?.likes || 0) + (isLiked ? 1 : 0) }}</span>
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="sm"
            class="flex items-center gap-2"
          >
            <ChatBubbleBottomCenterTextIcon class="w-5 h-5" />
            <span>{{ post?.comments || 14 }}</span>
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="sm"
            @click="handleShare"
            class="flex items-center gap-2"
          >
            <ShareIcon class="w-5 h-5" />
            <span>{{ post?.shares || 52 }}</span>
          </BaseButton>
        </div>

        <BaseButton
          variant="info"
          size="md"
          @click="handleContact"
        >
          Liên hệ
        </BaseButton>
      </div>

      <!-- Comments Section -->
      <div class="space-y-4">
        <h3 class="font-semibold text-gray-900">Bình luận</h3>
        
        <!-- Existing Comments -->
        <div class="space-y-3 max-h-[100px] overflow-scroll">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="flex items-start gap-3"
          >
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img :src="comment.author.avatar" />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-gray-900 text-sm">{{ comment.author.name }}</h4>
                <span class="text-xs text-gray-500">{{ comment.timestamp }}</span>
              </div>
              <p class="text-gray-700 text-sm mt-1">{{ comment.content }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer với Comment Input -->
    <template #footer>
      <div class="flex items-start gap-2 w-full max-w-full">
        <div class="avatar">
          <div class="w-8 h-8 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
        
        <div class="flex-1 flex flex-col items-start gap-2 bg-gray-100 rounded-[18px] p-2 min-w-0">
          <input
            v-model="newComment"
            type="text"
            placeholder="Nhập bình luận của bạn"
            class="flex-1 px-4 py-2 border-none bg-transparent w-full rounded-[18px] focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-100"
            @keyup.enter="handleComment"
          />

          <div class="w-full min-w-0 flex justify-between">
            <div class="flex items-center gap-1 w-[80%]">
              <button class="p-2 text-gray-400 hover:text-gray-600">
                <FaceSmileIcon class="w-5 h-5" />
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600">
                <CameraIcon class="w-5 h-5" />
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600">
                <span class="text-xs font-semibold">GIF</span>
              </button>
            </div>
            <BaseButton
                class="!bg-transparent"
                size="sm"
                @click="handleComment"
                :disabled="!newComment.trim()"
            >
              <PaperAirplaneIcon class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
/* Custom styles for post modal */
.avatar img {
  object-fit: cover;
}

/* Footer template styling */
:deep(.p-6.border-t.border-gray-200.bg-gray-50) {
  box-shadow: 0 0px 20px rgba(6, 182, 212, 0.8);
}



</style>
