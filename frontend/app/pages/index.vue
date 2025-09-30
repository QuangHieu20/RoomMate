<script setup lang="ts">
import {ref} from 'vue'
import {HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, ShareIcon, ArrowRightIcon} from '@heroicons/vue/24/outline'
import PostModal from '~/components/PostModal.vue'
// Page metadata
definePageMeta({
  title: 'Home - RoomMate'
})

const isLoading = ref(false)

// Collapse state management
const collapseStates = ref({
  time: false,
  price: false,
})

// Toggle functions for each collapse
const toggleCollapse = (key: keyof typeof collapseStates.value) => {
  collapseStates.value[key] = !collapseStates.value[key]
}
// Carousel images data
const carouselImages = ref([
  {
    src: 'https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp',
    alt: 'Phòng trọ đẹp'
  },
  {
    src: 'https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp',
    alt: 'Nội thất hiện đại'
  },
  {
    src: 'https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp',
    alt: 'Không gian thoáng mát'
  },
  {
    src: 'https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp',
    alt: 'Tiện ích đầy đủ'
  },
  {
    src: 'https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp',
    alt: 'Vị trí thuận lợi'
  }
])

const getPostList = (tab): void => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

// Post Modal State
const isPostModalOpen = ref(false)
const selectedPost = ref(null)

// Open post modal
const openPostModal = (post) => {
  selectedPost.value = post
  isPostModalOpen.value = true
}

// Close post modal
const closePostModal = () => {
  isPostModalOpen.value = false
  selectedPost.value = null
}

// Handle post actions
const handleLike = (postId) => {
  // TODO: Implement like functionality
}

const handleComment = (postId, comment) => {
  // TODO: Implement comment functionality
}

const handleShare = (postId) => {
  // TODO: Implement share functionality
}

const handleContact = (postId) => {
  // TODO: Implement contact functionality
}
</script>

<template>
  <div class="flex">
    <div class="w-8/12">
      <div v-show="isLoading" class="flex flex-col gap-4">
        <BasePostSkeleton/>
      </div>
      <div class="post-tabs tabs tabs-border">
        <input
            type="radio"
            name="my_tabs_2"
            class="tab text-cyan-500"
            aria-label="Cho thuê trọ"
            checked="checked"
            @click="getPostList(1)"/>
        <div v-show="!isLoading"
             class="tab-content border-base-300 bg-base-100 p-10 max-h-[calc(100vh-120px)] overflow-y-auto min-h-0">
          <!--  Post List-->

          <!--  Video -->
          <section class="w-full min-w-0 min-h-0 bg-white rounded-[16px] border border-border-light p-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-[68px] h-[68px] rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"/>
                </div>
              </div>
              <div class="flex flex-col">
                <p>Nguyễn Quang Hiếu</p>
                <span class="text-gray-400 text-xs">1 Giờ</span>
              </div>
            </div>

            <!-- Content-->
            <div class="w-full min-w-0 mt-6">
              Cho thuê phòng trọ gần Đại học Kinh tế, đầy đủ tiện nghi <br/>
              Mình có 1 phòng trọ mới xây cần cho thuê tại Quận 3, TP.HCM.<br/>
              Diện tích: 20m², có cửa sổ thoáng mát.<br/>
              Tiện ích: Máy lạnh, WC riêng, WiFi tốc độ cao.<br/>
              Giá thuê: 3.500.000đ/tháng (bao điện nước cơ bản).<br/>
              Khu vực an ninh, yên tĩnh, gần siêu thị và trạm xe bus.<br/>
            </div>
            <!--  Photos -->
            <div class="mt-6">
              <div class="card w-96 min-h-48">
                <figure>
                  <video controls class="w-full min-h-48 rounded-t-xl">
                    <source src="https://www.youtube.com/watch?v=cjR-BWQzxNs&list=RDcjR-BWQzxNs&start_radio=1"
                            type="video/mp4"/>
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </figure>
              </div>
            </div>
            <!-- Control -->
            <div class="w-full min-w-0 flex items-center justify-between mt-6">
              <div class="flex items-start justify-self-center w-3/6 gap-10">
                <BaseButton
                    size="xs"
                >
                  <HandThumbUpIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                    @click="openPostModal({
            id: 'test',
            title: 'Tìm phòng trọ Quận 1 hoặc Quận 3, ngân sách 3 triệu',
            description: 'Mình là sinh viên năm 2, cần tìm 1 phòng trọ hoặc ở ghép gần trung tâm để tiện đi học và làm thêm.',
            requirements: [
              'Ngân sách: dưới 3.000.000đ/tháng.',
              'Yêu cầu: Có WiFi, giờ giấc tự do, WC riêng càng tốt.',
              'Ưu tiên gần các tuyến bus đi qua trường Đại học Kinh tế.'
            ],
            author: {
              name: 'Nguyễn Quang Hiếu',
              avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp',
              timestamp: '25/09/2025 12:24 PM'
            },
            likes: 0,
            comments: 14,
            shares: 52
          })"
                >
                  <ChatBubbleBottomCenterTextIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                >
                  <ShareIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
              </div>
              <div class="flex items-center justify-end w-1/6">
                <BaseButton
                    class="!rounded-[4px]"
                    size="md"
                    variant="info"
                >
                  Liên hệ
                </BaseButton>
              </div>
            </div>

          </section>
          <!--  Image -->
          <section v-for="(item,index) in 10" :key="index"
                   class="w-full min-w-0 min-h-0 bg-white rounded-[16px] border border-border-light p-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-[68px] h-[68px] rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"/>
                </div>
              </div>
              <div class="flex flex-col">
                <p>Nguyễn Quang Híu</p>
                <span class="text-gray-400 text-xs">1 Giờ</span>
              </div>
            </div>

            <!-- Content-->
            <div class="w-full min-w-0 mt-6">
              Cho thuê phòng trọ gần Đại học Kinh tế, đầy đủ tiện nghi <br/>
              Mình có 1 phòng trọ mới xây cần cho thuê tại Quận 3, TP.HCM.<br/>
              Diện tích: 20m², có cửa sổ thoáng mát.<br/>
              Tiện ích: Máy lạnh, WC riêng, WiFi tốc độ cao.<br/>
              Giá thuê: 3.500.000đ/tháng (bao điện nước cơ bản).<br/>
              Khu vực an ninh, yên tĩnh, gần siêu thị và trạm xe bus.<br/>
            </div>
            <!--  Photos -->
            <div class="mt-6">
              <div class="card w-full">
                <FullBleedCarousel
                    :images="carouselImages"
                />
              </div>
            </div>
            <!-- Control -->
            <div class="w-full min-w-0 flex items-center justify-between mt-6">
              <div class="flex items-start justify-self-center w-3/6 gap-10">
                <BaseButton
                    size="xs"
                >
                  <HandThumbUpIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                    @click="openPostModal({
            id: 'test',
            title: 'Tìm phòng trọ Quận 1 hoặc Quận 3, ngân sách 3 triệu',
            description: 'Mình là sinh viên năm 2, cần tìm 1 phòng trọ hoặc ở ghép gần trung tâm để tiện đi học và làm thêm.',
            requirements: [
              'Ngân sách: dưới 3.000.000đ/tháng.',
              'Yêu cầu: Có WiFi, giờ giấc tự do, WC riêng càng tốt.',
              'Ưu tiên gần các tuyến bus đi qua trường Đại học Kinh tế.'
            ],
            author: {
              name: 'Nguyễn Quang Hiếu',
              avatar: 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp',
              timestamp: '25/09/2025 12:24 PM'
            },
            likes: 0,
            comments: 14,
            shares: 52
          })"
                >
                  <ChatBubbleBottomCenterTextIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                >
                  <ShareIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
              </div>
              <div class="flex items-center justify-end w-1/6">
                <BaseButton
                    class="!rounded-[4px]"
                    size="md"
                    variant="info"
                >
                  Liên hệ
                </BaseButton>
              </div>
            </div>

          </section>
        </div>

        <input
            type="radio"
            name="my_tabs_2"
            class="tab text-cyan-500"
            aria-label="Tìm trọ"
            @click="getPostList(2)"
        />
        <div v-show="!isLoading"
             class="tab-content border-base-300 bg-base-100 p-10 max-h-[calc(100vh-120px)] overflow-y-auto rounded-[16px]">
          <!--  Post List-->

          <!--  Video -->
          <section class="w-full min-w-0 min-h-0 bg-white rounded-[16px] border border-border-light p-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-[68px] h-[68px] rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"/>
                </div>
              </div>
              <div class="flex flex-col">
                <p>Nguyễn Quang Hiếu</p>
                <span class="text-gray-400 text-xs">1 Giờ</span>
              </div>
            </div>

            <!-- Content-->
            <div class="w-full min-w-0 mt-6">
              Cho thuê phòng trọ gần Đại học Kinh tế, đầy đủ tiện nghi <br/>
              Mình có 1 phòng trọ mới xây cần cho thuê tại Quận 3, TP.HCM.<br/>
              Diện tích: 20m², có cửa sổ thoáng mát.<br/>
              Tiện ích: Máy lạnh, WC riêng, WiFi tốc độ cao.<br/>
              Giá thuê: 3.500.000đ/tháng (bao điện nước cơ bản).<br/>
              Khu vực an ninh, yên tĩnh, gần siêu thị và trạm xe bus.<br/>
            </div>
            <!--  Photos -->
            <div class="mt-6">
              <div class="card w-96 min-h-48">
                <figure>
                  <video controls class="w-full min-h-48 rounded-t-xl">
                    <source src="https://www.youtube.com/watch?v=cjR-BWQzxNs&list=RDcjR-BWQzxNs&start_radio=1"
                            type="video/mp4"/>
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </figure>
              </div>
            </div>
            <!-- Control -->
            <div class="w-full min-w-0 flex items-center justify-between mt-6">
              <div class="flex items-start justify-self-center w-3/6 gap-10">
                <BaseButton
                    size="xs"
                >
                  <HandThumbUpIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                >
                  <ChatBubbleBottomCenterTextIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                >
                  <ShareIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
              </div>
              <div class="flex items-center justify-end w-1/6">
                <BaseButton
                    class="!rounded-[4px]"
                    size="md"
                    variant="info"
                >
                  Liên hệ
                </BaseButton>
              </div>
            </div>

          </section>
          <!--  Image -->
          <section v-for="(item,index) in 10" :key="index"
                   class="w-full min-w-0 min-h-0 bg-white rounded-[16px] border border-border-light p-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-[68px] h-[68px] rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"/>
                </div>
              </div>
              <div class="flex flex-col">
                <p>Nguyễn Quang Hiếu</p>
                <span class="text-gray-400 text-xs">1 Giờ</span>
              </div>
            </div>

            <!-- Content-->
            <div class="w-full min-w-0 mt-6">
              Cho thuê phòng trọ gần Đại học Kinh tế, đầy đủ tiện nghi <br/>
              Mình có 1 phòng trọ mới xây cần cho thuê tại Quận 3, TP.HCM.<br/>
              Diện tích: 20m², có cửa sổ thoáng mát.<br/>
              Tiện ích: Máy lạnh, WC riêng, WiFi tốc độ cao.<br/>
              Giá thuê: 3.500.000đ/tháng (bao điện nước cơ bản).<br/>
              Khu vực an ninh, yên tĩnh, gần siêu thị và trạm xe bus.<br/>
            </div>
            <!--  Photos -->
            <div class="mt-6">
              <div class="card w-full">
                <FullBleedCarousel
                    :images="carouselImages"
                />
              </div>
            </div>
            <!-- Control -->
            <div class="w-full min-w-0 flex items-center justify-between mt-6">
              <div class="flex items-start justify-self-center w-3/6 gap-10">
                <BaseButton
                    size="xs"
                >
                  <HandThumbUpIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                >
                  <ChatBubbleBottomCenterTextIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
                <BaseButton
                    size="xs"
                >
                  <ShareIcon class="w-5 h-5"/>
                  <span>10</span>
                </BaseButton>
              </div>
              <div class="flex items-center justify-end w-1/6">
                <BaseButton
                    class="!rounded-[4px]"
                    size="md"
                    variant="info"
                >
                  Liên hệ
                </BaseButton>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
    <div class="w-4/12 pt-[70px]">
      <!-- Login/Register Card -->
      <div class="w-[95%] ml-3 card bg-base-100 p-6 mb-8">
        <h2 class="card-title text-xl font-bold mb-2">Đăng nhập hoặc đăng ký RoomMate</h2>
        <p class="text-base-content/70 mb-4">Kết nối với mọi người, tìm bạn cùng phòng lý tưởng và bắt đầu trò chuyện
          ngay hôm nay!</p>
        <button class="btn w-full bg-cyan-500 hover:bg-cyan-600 border-cyan-500 text-white">
          Đăng nhập hoặc đăng ký
        </button>
      </div>

      <!-- Filter Section -->
      <div class="w-[95%] ml-3 card p-6">
        <div class="flex justify-between items-center mb-3">
          <h2 class="card-title text-xl font-bold">Bộ lọc</h2>
          <button class="btn btn-link text-cyan-500 hover:text-cyan-600">Xoá</button>
        </div>

        <!-- Time Filter -->
        <div class="bg-base-100 rounded-lg mb-4 overflow-hidden">
          <div
              class="p-4 font-bold cursor-pointer flex items-center justify-between"
              @click="toggleCollapse('time')"
          >
            <span>Time</span>
            <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': collapseStates.time }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <div v-show="collapseStates.time" class="px-4 pb-4">
            <input type="text" placeholder="Tìm kiếm..."
                   class="input w-full bg-gray-100 border-none focus:outline-none">
          </div>

          <!-- Giá thuê Filter -->
          <div v-show="collapseStates.time" class="px-4 pb-4">
            <span>Giá thuê</span>
            <div class="flex items-center space-x-2">
              <input type="text" placeholder="Từ" class="input w-1/2 bg-gray-100 border-none focus:outline-none">
              <ArrowRightIcon class="w-5 h-5 rounded-full font-bold bg-yellow-100 p-1 text-yellow-500"/>
              <input type="text" placeholder="Đến" class="input w-1/2 bg-gray-100 border-none focus:outline-none">
            </div>
          </div>

          <!-- Diện tích(m2) Filter -->
          <div v-show="collapseStates.time" class="px-4 pb-4">
            <span>Diện tích(m2)</span>
            <div class="flex items-center space-x-2">
              <input type="text" placeholder="Từ" class="input w-1/2 bg-gray-100 border-none focus:outline-none">
              <ArrowRightIcon class="w-5 h-5 rounded-full font-bold bg-yellow-100 p-1 text-yellow-500"/>
              <input type="text" placeholder="Đến" class="input w-1/2 bg-gray-100 border-none focus:outline-none">
            </div>
          </div>

        </div>


        <!-- Địa chỉ Filter -->
        <div class="bg-base-100 rounded-lg mb-4 overflow-hidden">
          <div
              class="p-4 font-bold cursor-pointer flex items-center justify-between"
              @click="toggleCollapse('address')"
          >
            <span>Địa chỉ</span>
            <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': collapseStates.address }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <div v-show="collapseStates.address" class="px-4 pb-4 ">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <select class="select w-full bg-gray-100 border-none focus:outline-none">
                <option>Tỉnh thành</option>
              </select>
              <select class="select w-full bg-gray-100 border-none focus:outline-none">
                <option>Quận huyện</option>
              </select>
            </div>
            <select class="select w-[48%] bg-gray-100 border-none focus:outline-none">
              <option>Phường xã</option>
            </select>
          </div>


          <div v-show="collapseStates.address" class="px-4 pb-4 mt-4">
            <span>Thời điểm đăng bài</span>
            <div class="space-y-2 mt-4 ml-2">
              <label class="flex items-center">
                <input type="radio" name="post-time"
                       class="radio bg-transparent border-gray-500 checked:bg-cyan-500 checked:border-cyan-500" checked>
                <span class="ml-2">Mới nhất</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="post-time"
                       class="radio bg-transparent border-gray-500 checked:bg-cyan-500 checked:border-cyan-500">
                <span class="ml-2">Cũ nhất</span>
              </label>
            </div>
            <div class="divider mx-auto"></div>
          </div>

          <div v-show="collapseStates.address" class="px-4 pb-4">
            <span>Loại phòng</span>
            <div class="space-y-2 mt-4 ml-2">
              <label class="flex items-center">
                <input type="checkbox" class="checkbox checkbox-primary border-gray-500 ">
                <span class="ml-2">Phòng trọ</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="checkbox checkbox-primary border-gray-500" checked>
                <span class="ml-2">Căn hộ</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="checkbox checkbox-primary border-gray-500" checked>
                <span class="ml-2">Chung cư mini</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="checkbox checkbox-primary border-gray-500">
                <span class="ml-2">Nhà nguyên căn</span>
              </label>
            </div>
            <div class="divider mx-auto"></div>

          </div>
        </div>
      </div>
    </div>

    <!-- Post Modal -->
    <PostModal
        :is-open="isPostModalOpen"
        :post="selectedPost"
        @close="closePostModal"
        @update:is-open="isPostModalOpen = $event"
        @like="handleLike"
        @comment="handleComment"
        @share="handleShare"
        @contact="handleContact"
    />
  </div>
</template>

<style scoped>
/* Override DaisyUI primary color to cyan-500 for checkboxes */
.checkbox-primary:checked {
  background-color: #06b6d4 !important;
  border-color: #06b6d4 !important;
}

.checkbox-primary:checked::after {
  color: white !important;
}

/* Custom styling for radio buttons */
.radio {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid #6b7280;
  border-radius: 50%;
  background-color: transparent;
  position: relative;
}

.radio:checked {
  background-color: #06b6d4;
  border-color: #06b6d4;
}

.radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.375rem;
  height: 0.375rem;
  background-color: white;
  border-radius: 50%;
}
</style>

<style scoped lang="scss">
.post-tabs {
  .tab:hover {
    color: #50deff;
  }

  .tab-content {
    padding: unset !important;
    background: unset !important;
    border: unset !important;
    margin-top: 30px;
  }
}
</style>
