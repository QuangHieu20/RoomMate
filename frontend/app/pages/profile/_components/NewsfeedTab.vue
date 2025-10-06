<script setup lang="ts">
import { getRoomTypeLabel, getGenderRequirementLabel } from '~/types/enums'
import {
  DocumentPlusIcon,
  ChevronDownIcon,
  Square3Stack3DIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import BaseInput from '~/components/base/Input.vue'
import BaseButton from '~/components/base/Button.vue'

// Props
interface Props {
  posts: any[]
  postsLoading: boolean
  postsError: any
  form: {
    fullName: string
    email: string
    phone: string
  }
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  loadUserPosts: []
}>()

// Helper functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Vừa xong'
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ngày trước`
  
  return date.toLocaleDateString('vi-VN')
}

// Helper functions moved to enums file
</script>

<template>
  <div>
    <!-- Search and Filter Section -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <!-- Search -->
        <div class="flex-1 w-11/12">
          <div class="form-control">
            <div class="input-group">
              <BaseInput
                type="text"
                :placeholder="$t('post.create.placeholders.search')"
                class="flex-1 bg-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Filter Dropdown -->
        <div class="dropdown dropdown-end w-1/12 flex justify-end">
          <BaseButton
            variant="soft"
            size="sm"
            :class="'w-full flex justify-between rounded-[12px] border-none font-normal bg-[#F8F8F8] text-gray-700 hover:bg-gray-100'"
            tabindex="0"
            role="button"
          >
            {{ $t('profile.filters.all') }}
            <ChevronDownIcon class="w-4 h-4 ml-2"/>
          </BaseButton>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>{{ $t('profile.filters.all') }}</a></li>
            <li><a>{{ $t('profile.filters.active') }}</a></li>
            <li><a>{{ $t('profile.filters.pending') }}</a></li>
            <li><a>{{ $t('profile.filters.expired') }}</a></li>
          </ul>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2 filter-tabs font-normal">
        <BaseButton variant="info" size="sm">{{ $t('profile.filters.all') }} (5)</BaseButton>
        <BaseButton variant="ghost" size="sm" :class="'border border-gray-300 !rounded-[4px]'">{{ $t('profile.filters.active') }} (2)</BaseButton>
        <BaseButton variant="ghost" size="sm" :class="'border border-gray-300 !rounded-[4px]'">{{ $t('profile.filters.pending') }} (2)</BaseButton>
        <BaseButton variant="ghost" size="sm" :class="'border border-gray-300 !rounded-[4px]'">{{ $t('profile.filters.expired') }} (1)</BaseButton>
      </div>
    </div>

    <!-- Posts Feed -->
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="postsLoading" class="space-y-6">
        <!-- Skeleton for multiple posts -->
        <div v-for="n in 3" :key="n" class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body p-4 lg:p-6">
            <!-- Post Header Skeleton -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="w-10 rounded-full bg-base-300">
                    <div class="skeleton w-full h-full"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="skeleton h-4 w-24"></div>
                  <div class="skeleton h-3 w-16"></div>
                </div>
              </div>
              <div class="skeleton h-8 w-8 rounded"></div>
            </div>

            <!-- Post Content Skeleton -->
            <div class="mb-4 space-y-3">
              <div class="skeleton h-6 w-3/4"></div>
              <div class="flex flex-wrap gap-4">
                <div class="skeleton h-5 w-20"></div>
                <div class="skeleton h-5 w-16"></div>
                <div class="skeleton h-5 w-24"></div>
              </div>
              <div class="space-y-2">
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-5/6"></div>
                <div class="skeleton h-4 w-4/6"></div>
              </div>
            </div>

            <!-- Post Images Skeleton -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              <div class="skeleton h-32 w-full rounded-lg"></div>
              <div class="skeleton h-32 w-full rounded-lg"></div>
              <div class="skeleton h-32 w-full rounded-lg"></div>
            </div>

            <!-- Post Actions Skeleton -->
            <div class="flex items-center justify-between pt-4 border-t border-base-300">
              <div class="flex items-center space-x-4">
                <div class="skeleton h-8 w-16"></div>
                <div class="skeleton h-8 w-16"></div>
              </div>
              <div class="skeleton h-8 w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="text-center py-8">
        <div class="text-base-content/50 mb-4">
          <DocumentPlusIcon class="w-16 h-16 mx-auto mb-4"/>
          <h3 class="text-lg font-semibold mb-2">Chưa có bài viết nào</h3>
          <p class="text-sm">Hãy tạo bài viết đầu tiên của bạn!</p>
        </div>
      </div>

      <!-- Posts List -->
      <div v-else>
        <div class="card bg-base-100 shadow-sm border border-base-300 post-card mb-4" v-for="post in posts" :key="post.id">
          <div class="card-body p-4 lg:p-6">
            <!-- Post Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="w-10 rounded-full">
                    <img src="/images/default-avatar.png" alt="User Avatar"/>
                  </div>
                </div>
                <div>
                  <h4 class="font-semibold text-base-content">{{ form.fullName || 'Hoàng Trung Hiếu' }}</h4>
                  <p class="text-sm text-base-content/70">{{ formatTimeAgo(post.createdAt) }}</p>
                </div>
              </div>
              <button class="btn btn-ghost btn-sm">
                <EllipsisVerticalIcon class="w-5 h-5"/>
              </button>
            </div>

            <!-- Post Content -->
            <div class="mb-4">
              <h3 class="text-lg font-bold text-base-content mb-2">
                {{ post.title }}
              </h3>

              <div
                  class="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-3 post-meta">
                <div class="flex items-center space-x-1" v-if="post.price">
                  <span class="text-lg font-bold text-error">{{ formatPrice(post.price) }} {{ post.priceType === 'monthly' ? 'vnđ/tháng' : 'vnđ/ngày' }}</span>
                </div>
                <div class="flex items-center space-x-1" v-if="post.area">
                  <span class="text-lg font-bold text-error">{{ post.area }}m²</span>
                  <Square3Stack3DIcon class="w-4 h-4 text-base-content/70"/>
                </div>
                <div class="flex items-center space-x-1" v-if="post.roomType">
                  <BuildingOfficeIcon class="w-4 h-4 text-base-content/70"/>
                  <span class="text-base-content/70">{{ getRoomTypeLabel(post.roomType) }}</span>
                </div>
                <div class="flex items-center space-x-1" v-if="post.address">
                  <MapPinIcon class="w-4 h-4 text-base-content/70"/>
                  <span class="text-base-content/70">{{ post.address }}</span>
                </div>
              </div>

              <p class="text-base-content/80 mb-3" v-if="post.description">
                {{ post.description }}
              </p>

              <ul class="space-y-1 text-sm text-base-content/70" v-if="post.contactName || post.contactPhone">
                <li v-if="post.contactName">• Liên hệ: {{ post.contactName }}</li>
                <li v-if="post.contactPhone">• SĐT: {{ post.contactPhone }}</li>
                <li v-if="post.maxOccupants">• Số người tối đa: {{ post.maxOccupants }}</li>
                <li v-if="post.genderRequirement !== 'any'">• Yêu cầu giới tính: {{ getGenderRequirementLabel(post.genderRequirement) }}</li>
              </ul>
            </div>

            <!-- Post Images -->
            <div class="carousel carousel-center max-w-full space-x-4 bg-base-200 rounded-box mb-4" v-if="false">
              <div class="carousel-item">
                <img src="/images/sample1.jpg" class="rounded-box w-32 h-24 object-cover" alt="Room 1"/>
              </div>
              <div class="carousel-item">
                <img src="/images/sample2.jpg" class="rounded-box w-32 h-24 object-cover" alt="Room 2"/>
              </div>
              <div class="carousel-item">
                <img src="/images/sample3.jpg" class="rounded-box w-32 h-24 object-cover" alt="Room 3"/>
              </div>
            </div>

            <!-- Post Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 post-actions">
              <div class="flex items-center space-x-4">
                <button class="btn btn-ghost btn-sm">
                  <HandThumbUpIcon class="w-4 h-4 mr-1"/>
                  {{ post.favoritesCount }}
                </button>
                <button class="btn btn-ghost btn-sm">
                  <ChatBubbleLeftIcon class="w-4 h-4 mr-1"/>
                  0
                </button>
                <button class="btn btn-ghost btn-sm">
                  <ArrowPathIcon class="w-4 h-4 mr-1"/>
                  {{ post.viewsCount }}
                </button>
              </div>
              <button class="btn btn-error btn-sm text-white">
                <TrashIcon class="w-4 h-4 mr-1"/>
                Xoá bài viết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
