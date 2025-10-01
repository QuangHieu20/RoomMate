<template>
  <div class="min-h-screen bg-base-100">
    <div class="flex">
      <!-- Desktop Sidebar -->
      <div class="w-80 bg-base-100 border-r border-base-300 min-h-screen p-4 hidden lg:block sidebar sidebar-scroll">
        <!-- User Profile Card -->
        <div class="card shadow-sm border border-base-300">
          <div class="card-body p-4">
            <div class="flex flex-col items-center text-center">
              <!-- Avatar -->
              <div class="avatar mb-4">
                <div class="w-20 rounded-full">
                  <img src="/images/default-avatar.png" alt="User Avatar" />
                </div>
              </div>
              
              <!-- User Name -->
              <h2 class="text-lg font-semibold text-base-content mb-4">{{ form.fullName || 'Hoàng Trung Hiếu' }}</h2>
              
              <!-- About Section -->
              <div class="w-full bg-[#F8F8F8] rounded-[8px] p-2 mb-1">
                <h3 class="text-cyan-500 text-xl font-medium text-base-content text-left mb-3">About</h3>
                
                <!-- Email -->
                <div class="flex items-center space-x-2 mb-2 border-b border-gray-200">
                  <EnvelopeIcon class="w-4 h-[38.5px] text-cyan-500 text-base-content/70" />
                  <span class="text-sm text-base-content/70">{{ form.email || 'hoanghieu.nd.4820@gmail.com' }}</span>
                </div>
                
                <!-- Phone -->
                <div class="flex items-center space-x-2">
                  <PhoneIcon class="w-4 h-[38.5px] text-cyan-500 text-base-content/70" />
                  <span class="text-sm text-base-content/70">{{ form.phone || '0852560408' }}</span>
                </div>
              </div>
               <!-- Edit Button -->
               <button @click="showEditModal = true" class="btn bg-cyan-500 text-white btn-sm w-full">
                  Chỉnh sửa thông tin
                </button>
            </div>
          </div>
        </div>
        
        <!-- Navigation Menu -->
        <div class="mt-6" >
          <div class="flex flex-col gap-2 w-full">
            <button 
              @click="switchTab('newsfeed')"
              class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'newsfeed', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'newsfeed' }"
            >
              <Squares2X2Icon class="w-5 h-5" />
              <span class="ml-2">Bảng tin</span>
            </button>
            <button 
              @click="switchTab('create-post')"
              class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'create-post', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'create-post' }"
            >
              <DocumentPlusIcon class="w-5 h-5" />
              <span class="ml-2">Đăng tin mới</span>
            </button>
            <button 
              @click="switchTab('notifications')"
              class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'notifications', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'notifications' }"
            >
              <BellIcon class="w-5 h-5" />
              <span class="ml-2">Thông báo</span>
              <span class="badge badge-error badge-sm ml-2 text-white">99+</span>
            </button>
            <button 
              @click="switchTab('change-password')"
              class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'change-password', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'change-password' }"
            >
              <LockClosedIcon class="w-5 h-5" />
              <span class="ml-2">Đổi mật khẩu</span>
            </button>
            <button 
              @click="switchTab('logout')"
              class="btn rounded-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-red-500 text-red-700 !bg-cyan-50': activeTab === 'logout', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'logout' }"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              <span class="ml-2">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-4 lg:p-6 main-content">
        <!-- Newsfeed Tab -->
        <div v-if="activeTab === 'newsfeed'">
          <!-- Search and Filter Section -->
          <div class="mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <!-- Search -->
              <div class="flex-1 max-w-md">
                <div class="form-control">
                  <div class="input-group">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm..." 
                      class="input input-bordered flex-1"
                    />
                    <button class="btn btn-square">
                      <MagnifyingGlassIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Filter Dropdown -->
              <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-outline">
                  Tất cả
                  <ChevronDownIcon class="w-4 h-4 ml-2" />
                </div>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a>Tất cả</a></li>
                  <li><a>Đang hiển thị</a></li>
                  <li><a>Chờ phê duyệt</a></li>
                  <li><a>Hết hạn</a></li>
                </ul>
              </div>
            </div>
            
            <!-- Filter Tabs -->
            <div class="flex flex-wrap gap-2 filter-tabs">
              <button class="btn btn-primary btn-sm">Tất cả (5)</button>
              <button class="btn btn-outline btn-sm">Đang hiển thị (2)</button>
              <button class="btn btn-outline btn-sm">Chờ phê duyệt (2)</button>
              <button class="btn btn-outline btn-sm">Hết hạn (1)</button>
            </div>
          </div>

          <!-- Posts Feed -->
          <div class="space-y-6">
            <!-- Sample Post Card -->
            <div class="card bg-base-100 shadow-sm border border-base-300 post-card">
              <div class="card-body p-4 lg:p-6">
                <!-- Post Header -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div class="avatar">
                      <div class="w-10 rounded-full">
                        <img src="/images/default-avatar.png" alt="User Avatar" />
                      </div>
                    </div>
                    <div>
                      <h4 class="font-semibold text-base-content">{{ form.fullName || 'Hoàng Trung Hiếu' }}</h4>
                      <p class="text-sm text-base-content/70">1 giờ</p>
                    </div>
                  </div>
                  <button class="btn btn-ghost btn-sm">
                    <EllipsisVerticalIcon class="w-5 h-5" />
                  </button>
                </div>
                
                <!-- Post Content -->
                <div class="mb-4">
                  <h3 class="text-lg font-bold text-base-content mb-2">
                    Đình Thôn-- ccmn đẹp + giá rẻ+ ở ngay tháng 10
                  </h3>
                  
                  <div class="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-3 post-meta">
                    <div class="flex items-center space-x-1">
                      <span class="text-lg font-bold text-error">5.000.000 vnđ/tháng</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <span class="text-lg font-bold text-error">30m²</span>
                      <Square3Stack3DIcon class="w-4 h-4 text-base-content/70" />
                    </div>
                    <div class="flex items-center space-x-1">
                      <BuildingOfficeIcon class="w-4 h-4 text-base-content/70" />
                      <span class="text-base-content/70">Chung cư mini</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <MapPinIcon class="w-4 h-4 text-base-content/70" />
                      <span class="text-base-content/70">Thanh xuân - Hà Nội</span>
                    </div>
                  </div>
                  
                  <p class="text-base-content/80 mb-3">
                    Cho thuê phòng trọ gần Đại học Kinh tế, đầy đủ tiện nghi Mình có 1 phòng trọ mới xây cần cho thuê tại Quận 3, TP.HCM.
                  </p>
                  
                  <ul class="space-y-1 text-sm text-base-content/70">
                    <li>• Diện tích: 20m², có cửa sổ thoáng mát.</li>
                    <li>• Tiện ích: Máy lạnh, WC riêng, WiFi tốc độ cao.</li>
                    <li>• Giá thuê: 3.500.000đ/tháng (bao điện nước cơ bản).</li>
                    <li>• Khu vực an ninh, yên tĩnh, gần siêu thị và trạm xe bus.</li>
                  </ul>
                </div>
                
                <!-- Post Images -->
                <div class="carousel carousel-center max-w-full space-x-4 bg-base-200 rounded-box mb-4">
                  <div class="carousel-item">
                    <img src="/images/sample1.jpg" class="rounded-box w-32 h-24 object-cover" alt="Room 1" />
                  </div>
                  <div class="carousel-item">
                    <img src="/images/sample2.jpg" class="rounded-box w-32 h-24 object-cover" alt="Room 2" />
                  </div>
                  <div class="carousel-item">
                    <img src="/images/sample3.jpg" class="rounded-box w-32 h-24 object-cover" alt="Room 3" />
                  </div>
                </div>
                
                <!-- Post Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 post-actions">
                  <div class="flex items-center space-x-4">
                    <button class="btn btn-ghost btn-sm">
                      <HandThumbUpIcon class="w-4 h-4 mr-1" />
                      14
                    </button>
                    <button class="btn btn-ghost btn-sm">
                      <ChatBubbleLeftIcon class="w-4 h-4 mr-1" />
                      14
                    </button>
                    <button class="btn btn-ghost btn-sm">
                      <ArrowPathIcon class="w-4 h-4 mr-1" />
                      52
                    </button>
                  </div>
                  <button class="btn btn-error btn-sm text-white">
                    <TrashIcon class="w-4 h-4 mr-1" />
                    Xoá bài viết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Create Post Tab -->
        <div v-else-if="activeTab === 'create-post'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body">
              <h2 class="text-2xl font-bold mb-4">Đăng tin mới</h2>
              <p class="text-base-content/70">Chức năng đăng tin mới sẽ được phát triển...</p>
            </div>
          </div>
        </div>
        
        <!-- Notifications Tab -->
        <div v-else-if="activeTab === 'notifications'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body">
              <h2 class="text-2xl font-bold mb-4">Thông báo</h2>
              <p class="text-base-content/70">Bạn có 99+ thông báo mới...</p>
            </div>
          </div>
        </div>
        
        <!-- Change Password Tab -->
        <div v-else-if="activeTab === 'change-password'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body">
              <h2 class="text-2xl font-bold mb-4">Đổi mật khẩu</h2>
              <p class="text-base-content/70">Chức năng đổi mật khẩu sẽ được phát triển...</p>
            </div>
          </div>
        </div>
        
        <!-- Logout Tab -->
        <div v-else-if="activeTab === 'logout'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body">
              <h2 class="text-2xl font-bold mb-4 text-error">Đăng xuất</h2>
              <p class="text-base-content/70">Bạn có chắc chắn muốn đăng xuất?</p>
              <button class="btn btn-error mt-4">Xác nhận đăng xuất</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <div v-if="showMobileSidebar" class="lg:hidden fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="toggleMobileSidebar"></div>
      <div class="fixed left-0 top-0 h-full w-80 bg-base-100 border-r border-base-300 p-6 overflow-y-auto">
        <!-- User Profile Card -->
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body p-6">
            <div class="flex flex-col items-center text-center">
              <!-- Avatar -->
              <div class="avatar mb-4">
                <div class="w-20 rounded-full">
                  <img src="/images/default-avatar.png" alt="User Avatar" />
                </div>
              </div>
              
              <!-- User Name -->
              <h3 class="text-lg font-semibold text-base-content mb-4">{{ form.fullName || 'Hoàng Trung Hiếu' }}</h3>
              
              <!-- About Section -->
              <div class="w-full">
                <h4 class="text-sm font-medium text-base-content mb-3">About</h4>
                
                <!-- Email -->
                <div class="flex items-center space-x-2 mb-2">
                  <EnvelopeIcon class="w-4 h-4 text-base-content/70" />
                  <span class="text-sm text-base-content/70">{{ form.email || 'hoanghieu.nd.4820@gmail.com' }}</span>
                </div>
                
                <!-- Phone -->
                <div class="flex items-center space-x-2 mb-4">
                  <PhoneIcon class="w-4 h-4 text-base-content/70" />
                  <span class="text-sm text-base-content/70">{{ form.phone || '0852560408' }}</span>
                </div>
                
                <!-- Edit Button -->
                <button @click="showEditModal = true" class="btn btn-primary btn-sm w-full">
                  <PencilIcon class="w-4 h-4 mr-2" />
                  Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Menu -->
        <div class="mt-6">
          <div class="flex flex-col gap-2 w-full">
            <button 
              @click="switchTab('newsfeed')"
              class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'newsfeed', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'newsfeed' }"
            >
              <Squares2X2Icon class="w-5 h-5" />
              <span class="ml-2">Bảng tin</span>
            </button>
            <button 
              @click="switchTab('create-post')"
              class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'create-post', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'create-post' }"
            >
              <DocumentPlusIcon class="w-5 h-5" />
              <span class="ml-2">Đăng tin mới</span>
            </button>
            <button 
              @click="switchTab('notifications')"
              class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'notifications', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'notifications' }"
            >
              <BellIcon class="w-5 h-5" />
              <span class="ml-2">Thông báo</span>
              <span class="badge badge-error badge-sm ml-2">99+</span>
            </button>
            <button 
              @click="switchTab('change-password')"
              class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'change-password', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'change-password' }"
            >
              <LockClosedIcon class="w-5 h-5" />
              <span class="ml-2">Đổi mật khẩu</span>
            </button>
            <button 
              @click="switchTab('logout')"
              class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
              :class="{ 'border-red-500 text-red-700': activeTab === 'logout', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'logout' }"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              <span class="ml-2">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed bottom-4 right-4 z-50 mobile-nav-toggle">
      <button @click="toggleMobileSidebar" class="btn btn-primary btn-circle">
        <Bars3Icon class="w-6 h-6" />
      </button>
    </div>

    <!-- Profile Edit Modal -->
    <ProfileEditModal
      :show="showEditModal"
      :initial-data="form"
      @close="showEditModal = false"
      @update="handleUpdateProfile"
    />

    <!-- Toast Notifications -->
    <ClientOnly>
      <div v-if="toast.show" class="toast toast-top toast-end z-50">
        <div 
          class="alert"
          :class="{
            'alert-success': toast.type === 'success',
            'alert-error': toast.type === 'error',
            'alert-warning': toast.type === 'warning',
            'alert-info': toast.type === 'info'
          }"
        >
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// ===== IMPORTS =====
import type { ToastMessage } from '~/types/auth'
import {
  BellIcon,
  DocumentPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  Squares2X2Icon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  Square3Stack3DIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  TrashIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

// ===== PAGE META =====
definePageMeta({
  layout: 'default'
})

// ===== COMPOSABLES =====
const { get, put } = useApi()

// ===== REACTIVE STATE =====
// Form data
const form = reactive({
  fullName: '',
  email: '',
  phone: ''
})

// UI state
const loading = ref(false)
const showMobileSidebar = ref(false)
const showEditModal = ref(false)
const activeTab = ref('newsfeed')

// Toast state
const toast = reactive<ToastMessage & { show: boolean }>({
  show: false,
  type: 'info',
  message: '',
  duration: 3000
})

// ===== METHODS =====
// Show toast function
const showToast = (type: ToastMessage['type'], message: string, duration = 3000) => {
  toast.type = type
  toast.message = message
  toast.duration = duration
  toast.show = true
  
  setTimeout(() => {
    toast.show = false
  }, duration)
}

// Toggle mobile sidebar
const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

// Switch tab
const switchTab = (tabName: string) => {
  activeTab.value = tabName
  console.log('Switched to tab:', tabName)
}

// Load user profile
const loadProfile = async () => {
  try {
    // Mock data thay vì API call
    const user = {
      fullName: 'Hoàng Trung Hiếu',
      email: 'hoanghieu.nd.4820@gmail.com',
      phone: '0852560408'
    }
    
    form.fullName = user.fullName
    form.email = user.email
    form.phone = user.phone
  } catch (error: any) {
    console.error('Lỗi tải thông tin:', error)
    showToast('error', 'Không thể tải thông tin người dùng')
  }
}

// Update profile
const handleUpdateProfile = async (data?: { fullName: string; phone: string }) => {
  loading.value = true
  
  try {
    const updateData = data || {
      fullName: form.fullName,
      phone: form.phone
    }
    
    // Mock update - giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    form.fullName = updateData.fullName
    form.phone = updateData.phone
    
    showToast('success', 'Cập nhật thông tin thành công!')
    showEditModal.value = false
  } catch (error: any) {
    console.error('Lỗi cập nhật:', error)
    showToast('error', error.message || 'Có lỗi xảy ra khi cập nhật')
  } finally {
    loading.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadProfile()
})
</script>