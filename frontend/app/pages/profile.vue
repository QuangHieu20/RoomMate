<script setup lang="ts">
import type { ToastMessage, PostFormData, CreatePostTab, ProfileTab } from '~/types'
import { toTypedSchema } from '@vee-validate/yup'
import { useValidationSchema } from '~/composables/useValidation'
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
import { getLocalStorage } from '~/ultils/localStorage'
import BaseInput from '~/components/base/Input.vue'
import BaseSelect from '~/components/base/Select.vue'
import BaseButton from '~/components/base/Button.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const { posts, loading: postsLoading, error: postsError, loadUserPosts } = usePosts()
const { createPost, loading: createPostLoading, error: createPostError } = useCreatePost()

// Validation setup
const { postFormSchema } = useValidationSchema()
const validationSchema = toTypedSchema(postFormSchema.value)

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
const activeTab = ref<ProfileTab>('newsfeed')
const createPostTab = ref<CreatePostTab>('rent-out')
const postFormRef = ref()
const findRoomFormRef = ref()
const userInfo = reactive({
  id: '',
  email: '',
  fullName: '',
  avatar: '',
  phone: ''
})

// Load user info from localStorage on client side
onMounted(() => {
  if (process.client) {
    const savedUserInfo = getLocalStorage('userInfo')
    if (savedUserInfo) {
      Object.assign(userInfo, savedUserInfo)
    }
  }
})

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

const getRoomTypeLabel = (roomType: string) => {
  const labels: Record<string, string> = {
    'single_room': 'Phòng đơn',
    'shared_room': 'Phòng chung',
    'apartment': 'Căn hộ',
    'house': 'Nhà riêng',
    'studio': 'Studio'
  }
  return labels[roomType] || roomType
}

const getGenderRequirementLabel = (gender: string) => {
  const labels: Record<string, string> = {
    'male': 'Nam',
    'female': 'Nữ',
    'any': 'Bất kỳ'
  }
  return labels[gender] || gender
}

// Load posts on mount
onMounted(async () => {
  try {
    await loadUserPosts()
  } catch (error) {
    console.error('Error loading posts:', error)
  }
})

// Post form data for "Cho thuê trọ"
const postForm = reactive<PostFormData>({
  // Location
  province: '',
  district: '',
  ward: '',
  address: '',
  locationId: null,
  latitude: null,
  longitude: null,
  
  // Room details
  roomType: 'single_room',
  price: null,
  priceType: 'monthly',
  area: null,
  
  // Content
  title: '',
  description: '',
  
  // Requirements
  genderRequirement: 'any',
  maxOccupants: 1,
  availableFrom: '',
  
  // Contact
  contactName: '',
  contactPhone: ''
})

// Find room form data for "Tìm phòng trọ" - simplified with 3 fields
const findRoomForm = reactive({
  // Content - required fields
  title: '',
  description: '',
  roomType: 'single_room'
})

// Media upload state
const uploadedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const base64Files = ref<string[]>([]) // Store base64 strings
const isUploading = ref(false)

// Get validation schemas from composable
const { findRoomSchema } = useValidationSchema()
const findRoomValidationSchema = toTypedSchema(findRoomSchema.value)

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
const switchTab = (tabName: ProfileTab) => {
  activeTab.value = tabName
}

// Load user profile
const loadProfile = async () => {
  try {
    form.fullName = userInfo.fullName
    form.email = userInfo.email
    form.phone = userInfo.phone
  } catch (error: any) {
    console.error('Lỗi tải thông tin:', error)
    showToast('error', 'Không thể tải thông tin người dùng')
  }
}

// Handle create post
const handleCreatePost = async (values: any) => {
  loading.value = true

  try {
    
    // Validate required fields for rent-out tab
    if (createPostTab.value === 'rent-out') {
      if (!values.province || !values.district || !values.ward || !values.address) {
        showToast('error', 'Vui lòng điền đầy đủ thông tin địa chỉ')
        return
      }
      if (!values.roomType || !values.price || !values.area) {
        showToast('error', 'Vui lòng điền đầy đủ thông tin phòng')
        return
      }
    }
    
    // Map form data to API format
    const postData = {
      type: createPostTab.value === 'rent-out' ? 'for_rent' : 'looking_for',
      title: values.title,
      description: values.description,
      price: values.price,
      priceType: values.priceType,
      area: values.area,
      address: values.address,
      locationId: postForm.locationId,
      latitude: postForm.latitude,
      longitude: postForm.longitude,
      roomType: values.roomType,
      genderRequirement: 'any', // Fixed value
      maxOccupants: 2, // Fixed value
      availableFrom: new Date().toISOString().split('T')[0], // Fixed to today
      contactName: values.contactName || undefined,
      contactPhone: values.contactPhone || undefined
    }

    // Remove undefined values
    const cleanPostData = Object.fromEntries(
      Object.entries(postData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    )


    // Convert base64 files to File objects
    const mediaFiles: File[] = []
    if (base64Files.value && base64Files.value.length > 0) {
      for (let i = 0; i < base64Files.value.length; i++) {
        const base64String = base64Files.value[i]
        if (base64String) {
          const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
          if (matches && matches.length === 3) {
            const mimeType = matches[1]
            const base64Data = matches[2]
            if (mimeType && base64Data) {
              const byteCharacters = atob(base64Data)
              const byteNumbers = new Array(byteCharacters.length)
              for (let j = 0; j < byteCharacters.length; j++) {
                byteNumbers[j] = byteCharacters.charCodeAt(j)
              }
              const byteArray = new Uint8Array(byteNumbers)
              const file = new File([byteArray], `image_${i}.${mimeType.split('/')[1]}`, { type: mimeType })
              mediaFiles.push(file)
            }
          }
        }
      }
    }

    
    // Call API with separate parameters
    await createPost(cleanPostData as any, mediaFiles)

    showToast('success', $t('post.create.messages.createSuccess'))

    // Reset form
    resetPostForm()

    // Reload posts
    await loadUserPosts()
    
    // Switch to newsfeed tab
    activeTab.value = 'newsfeed'

  } catch (error: any) {
    console.error('Lỗi đăng tin:', error)
    showToast('error', error.message || $t('post.create.messages.createError'))
  } finally {
    loading.value = false
  }
}

// Handle find room submit
const handleFindRoomSubmit = async (values: any) => {
  loading.value = true
  try {
    
    // TODO: Implement find room post creation API
    // For now, just show success message
    showToast('success', 'Tạo tin tìm phòng trọ thành công!')
    resetFindRoomForm()
    
    // TODO: Add API call for find room posts
    // const result = await createFindRoomPost({
    //   ...values,
    //   userId: user.value?.id
    // })
  } catch (error: any) {
    console.error('Lỗi tạo tin tìm phòng trọ:', error)
    showToast('error', 'Có lỗi xảy ra khi tạo tin tìm phòng trọ')
  } finally {
    loading.value = false
  }
}

// Reset post form
const resetPostForm = () => {
  // Reset form using VeeForm ref if available
  if (postFormRef.value) {
    postFormRef.value.resetForm()
  }
  
  // Reset reactive form data
  Object.assign(postForm, {
    province: '',
    district: '',
    ward: '',
    address: '',
    locationId: null,
    latitude: null,
    longitude: null,
    roomType: 'single_room',
    price: null,
    priceType: 'monthly',
    area: null,
    title: '',
    description: '',
    genderRequirement: 'any', // Fixed value
    maxOccupants: 2, // Fixed value  
    availableFrom: new Date().toISOString().split('T')[0], // Fixed to today
    contactName: '',
    contactPhone: ''
  })
}

// Handle find room form submit (for VeeForm)
const onSubmitFindRoom = async (values: any) => {
  loading.value = true
  
  try {
    
    // Validate required fields
    if (!values.title?.trim()) {
      showToast('error', 'Vui lòng nhập tiêu đề')
      return
    }
    
    if (!values.description?.trim()) {
      showToast('error', 'Vui lòng nhập mô tả')
      return
    }
    
    // Map form data to API format with default values
    const postData = {
      type: 'looking_for',
      title: values.title.trim(),
      description: values.description.trim(),
      roomType: values.roomType || findRoomForm.roomType,
      // Set default values for all other fields
      genderRequirement: 'any', // Fixed value
      maxOccupants: 2, // Fixed value
      availableFrom: new Date().toISOString().split('T')[0], // Today's date
      contactName: userInfo.fullName || 'Người dùng',
      contactPhone: userInfo.phone || '',
      // Optional fields with defaults
      price: null,
      priceType: 'monthly',
      area: null,
      address: null,
      locationId: null,
      latitude: null,
      longitude: null,
      // Add base64 files for upload - will be validated by form schema
      mediaFiles: base64Files.value
    }
    
    // Remove undefined values
    const cleanPostData = Object.fromEntries(
      Object.entries(postData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    )
    
    
    // Call API using the same createPost function
    await createPost(cleanPostData as any)
    
    showToast('success', 'Đăng tin tìm phòng trọ thành công!')
    
    // Reset form
    resetFindRoomForm()
    
    // Reload posts
    await loadUserPosts()
    
    // Switch to newsfeed tab
    activeTab.value = 'newsfeed'
    
  } catch (error: any) {
    console.error('Lỗi đăng tin tìm phòng trọ:', error)
    showToast('error', error.message || 'Có lỗi xảy ra khi đăng tin tìm phòng trọ')
  } finally {
    loading.value = false
  }
}

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  try {
    // Process files - validation will be handled by form schema
    for (const file of Array.from(files)) {
      // Convert to base64
      const base64 = await fileToBase64(file)
      
      // Store original file and base64
      uploadedFiles.value.push(file)
      base64Files.value.push(base64)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      previewUrls.value.push(url)
    }
    
    showToast('success', `Đã thêm ${files.length} file`)
  } catch (error: any) {
    showToast('error', 'Có lỗi xảy ra khi xử lý file')
  }
}

// Remove file
const removeFile = (index: number) => {
  // Revoke URL to free memory
  if (previewUrls.value[index]) {
    URL.revokeObjectURL(previewUrls.value[index])
  }
  
  uploadedFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
  base64Files.value.splice(index, 1)
  
  showToast('success', 'Đã xóa file')
}

// Get file type icon
const getFileIcon = (file: File | undefined) => {
  if (!file) return '📁'
  if (file.type.startsWith('video/')) {
    return '🎥'
  }
  return '📷'
}

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Reset form function for "Tìm phòng trọ"
const resetFindRoomForm = () => {
  // Reset form using VeeForm ref if available
  if (findRoomFormRef.value) {
    findRoomFormRef.value.resetForm()
  }
  
  // Reset reactive form data - 3 fields
  Object.assign(findRoomForm, {
    title: '',
    description: '',
    roomType: 'single_room'
  })
  
  // Reset media files
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  uploadedFiles.value = []
  previewUrls.value = []
  base64Files.value = []
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

// ===== IMMEDIATE DATA LOADING =====
// Load data ngay lập tức khi component được tạo
loadProfile()

// Load posts với error handling
loadUserPosts().catch(error => {
  showToast('error', 'Không thể tải bài viết của người dùng')
})

// ===== LIFECYCLE =====
onMounted(() => {
  // Setup sau khi DOM đã render (nếu cần)
})

onUnmounted(() => {
  // Cleanup preview URLs to prevent memory leaks
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  // Clear base64 data
  base64Files.value = []
})
</script>
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
                  <EnvelopeIcon class="w-4 h-[38.5px] text-cyan-500 text-base-content/70"/>
                  <span class="text-sm text-base-content/70">{{ form.email || 'hoanghieu.nd.4820@gmail.com' }}</span>
                </div>

                <!-- Phone -->
                <div class="flex items-center space-x-2">
                  <PhoneIcon class="w-4 h-[38.5px] text-cyan-500 text-base-content/70"/>
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
        <div class="mt-6">
          <ClientOnly>
            <div class="flex flex-col gap-2 w-full">
              <button
                  @click="switchTab('newsfeed')"
                  class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'newsfeed', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'newsfeed' }"
              >
                <Squares2X2Icon class="w-5 h-5"/>
                <span class="ml-2">Bảng tin</span>
              </button>
              <button
                  @click="switchTab('create-post')"
                  class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'create-post', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'create-post' }"
              >
                <DocumentPlusIcon class="w-5 h-5"/>
                <span class="ml-2">Đăng tin mới</span>
              </button>
              <button
                  @click="switchTab('notifications')"
                  class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'notifications', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'notifications' }"
              >
                <BellIcon class="w-5 h-5"/>
                <span class="ml-2">Thông báo</span>
                <span class="badge badge-error badge-sm ml-2 text-white">99+</span>
              </button>
              <button
                  @click="switchTab('change-password')"
                  class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700 !bg-cyan-50': activeTab === 'change-password', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'change-password' }"
              >
                <LockClosedIcon class="w-5 h-5"/>
                <span class="ml-2">Đổi mật khẩu</span>
              </button>
              <button
                  @click="switchTab('logout')"
                  class="btn rounded-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-red-500 text-red-700 !bg-cyan-50': activeTab === 'logout', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'logout' }"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5"/>
                <span class="ml-2">Đăng xuất</span>
              </button>
            </div>
          </ClientOnly>
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

        <!-- Create Post Tab -->
        <div v-else-if="activeTab === 'create-post'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body p-4 lg:p-6">
              <!-- Tab Navigation -->
              <div role="tablist" class="tabs tabs-bordered w-full border-b border-gray-200 mb-6">
                <a 
                  role="tab" 
                  @click="createPostTab = 'rent-out'"
                  :class="['tab flex-1 text-base font-medium', 
                    createPostTab === 'rent-out' ? 'tab-active text-cyan-600 !border-b-cyan-500 !border-b-2' : 'text-gray-600'
                  ]"
                >
                  {{ $t('post.create.tabs.rentOut') }}
                </a>
                <a 
                  role="tab"
                  @click="createPostTab = 'find-room'"
                  :class="['tab flex-1 text-base font-medium',
                    createPostTab === 'find-room' ? 'tab-active text-cyan-600 !border-b-cyan-500 !border-b-2' : 'text-gray-600'
                  ]"
                >
                  {{ $t('post.create.tabs.findRoom') }}
                </a>
              </div>

              <!-- Form Content -->
              <VeeForm 
               v-if="createPostTab === 'rent-out'"
                ref="postFormRef"
                @submit="handleCreatePost" 
                :validation-schema="validationSchema"
                :initial-values="postForm"
                v-slot="{ errors, meta }"
                class="space-y-6"
              >
                <!-- Cho thuê trọ form -->
                <div>
                  <!-- Khu vực -->
                  <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
                    <div class="card-body p-4">
                      <h3 class="card-title">{{ $t('post.create.sections.location') }}</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <!-- Tỉnh/thành phố -->
                        <div>
                          <VeeField
                            v-slot="{ field, errorMessage }"
                            name="province"
                          >
                            <BaseSelect
                              :model-value="field.value"
                              :name="field.name"
                              @update:model-value="field.onChange"
                              @blur="field.onBlur"
                              :label="$t('post.create.fields.province')"
                              :placeholder="$t('post.create.placeholders.selectProvince')"
                              :required="true"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              :options="[
                                { value: 'hanoi', label: 'Hà Nội' },
                                { value: 'hcm', label: 'TP. Hồ Chí Minh' },
                                { value: 'danang', label: 'Đà Nẵng' }
                              ]"
                              class="w-full !bg-[#E7F0FE] !border-0"
                            />
                          </VeeField>
                        </div>

                        <!-- Quận/huyện -->
                        <div>
                          <VeeField
                            v-slot="{ field, errorMessage }"
                            name="district"
                          >
                            <BaseSelect
                              :model-value="field.value"
                              :name="field.name"
                              @update:model-value="field.onChange"
                              @blur="field.onBlur"
                              :label="$t('post.create.fields.district')"
                              :placeholder="$t('post.create.placeholders.selectDistrict')"
                              :required="true"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              :options="[
                                { value: 'cau-giay', label: 'Cầu Giấy' },
                                { value: 'dong-da', label: 'Đống Đa' },
                                { value: 'ba-dinh', label: 'Ba Đình' }
                              ]"
                              class="w-full !bg-[#E7F0FE] !border-0"
                            />
                          </VeeField>
                        </div>
                      </div>

                      <!-- Phường/xã -->
                      <div class="mb-4 w-[48%]">
                        <VeeField
                          v-slot="{ field, errorMessage }"
                          name="ward"
                        >
                            <BaseSelect
                              :model-value="field.value"
                              :name="field.name"
                              @update:model-value="field.onChange"
                              @blur="field.onBlur"
                              :label="$t('post.create.fields.ward')"
                              :placeholder="$t('post.create.placeholders.selectWard')"
                              :required="true"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              :options="[
                                { value: 'dich-vong', label: 'Dịch Vọng' },
                                { value: 'mai-dich', label: 'Mai Dịch' },
                                { value: 'quan-hoa', label: 'Quan Hoa' }
                              ]"
                              class="w-[50%] !bg-[#E7F0FE] !border-0"
                            />
                        </VeeField>
                      </div>

                      <!-- Địa chỉ chính xác -->
                      <div>
                        <VeeField
                          v-slot="{ field, errorMessage }"
                          name="address"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :name="field.name"
                            @update:model-value="field.onChange"
                            @blur="field.onBlur"
                            type="text"
                            :label="$t('post.create.fields.address')"
                            :placeholder="$t('post.create.placeholders.enterAddress')"
                            :error="!!errorMessage"
                            :error-message="errorMessage"
                            class="w-full !bg-[#F7FAFC]"
                          />
                        </VeeField>
                      </div>
                    </div>
                  </div>

            
                  <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
                          <!-- Loại phòng -->
                    <div class="card-body p-4">
                      <VeeField
                        v-slot="{ field, errorMessage }"
                        name="roomType"
                      >
                        <BaseSelect
                          :model-value="field.value"
                          :name="field.name"
                          @update:model-value="field.onChange"
                          @blur="field.onBlur"
                          :label="$t('post.create.fields.roomType')"
                          :placeholder="$t('post.create.placeholders.selectRoomType')"
                          :required="true"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                          :options="[
                            { value: 'single_room', label: 'Phòng đơn' },
                            { value: 'shared_room', label: 'Phòng chung' },
                            { value: 'apartment', label: 'Căn hộ' },
                            { value: 'house', label: 'Nhà riêng' },
                            { value: 'studio', label: 'Studio' }
                          ]"
                          class="w-full !bg-[#F7FAFC]"
                        />
                      </VeeField>
                    </div>
                                        <!-- Giá và Diện tích -->
                                        <div class="card-body p-4">
                   
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Giá -->
                        <div>
                          <VeeField
                            v-slot="{ field, errorMessage }"
                            name="price"
                          >
                            <BaseInput
                              :model-value="field.value"
                              :name="field.name"
                              @update:model-value="field.onChange"
                              @blur="field.onBlur"
                              type="number"
                              :label="$t('post.create.fields.price')"
                              :placeholder="$t('post.create.placeholders.enterPrice')"
                              :required="true"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              class="w-full !bg-[#F7FAFC]"
                            >
                              <template #subTitle>
                                Triệu/tháng
                              </template>
                            </BaseInput>
                          </VeeField>
                        </div>

                        <!-- Diện tích -->
                        <div>
                          <VeeField
                            v-slot="{ field, errorMessage }"
                            name="area"
                          >
                            <BaseInput
                              :model-value="field.value"
                            :name="field.name"
                            @update:model-value="field.onChange"
                            @blur="field.onBlur"
                              type="number"
                              :label="$t('post.create.fields.area')"
                              :placeholder="$t('post.create.placeholders.enterArea')"
                              :required="true"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              class="w-full !bg-[#F7FAFC]"
                            >
                              <template #subTitle>
                                M2
                              </template>
                            </BaseInput>
                          </VeeField>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Thông tin mô tả -->
                  <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
                    <div class="card-body p-4">  
                      <h3 class="card-title">{{ $t('post.create.sections.description') }}</h3>
                      <div class="mb-4">
                        <VeeField
                          v-slot="{ field, errorMessage }"
                          name="title"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :name="field.name"
                            @update:model-value="field.onChange"
                            @blur="field.onBlur"
                            type="text"
                            :label="$t('post.create.fields.title')"
                            :placeholder="$t('post.create.placeholders.enterTitle')"
                            :required="true"
                            :maxlength="150"
                            :error="!!errorMessage"
                            :error-message="errorMessage"
                            class="w-full !bg-[#F7FAFC]"
                          />
                          <ClientOnly>
                            <div class="text-right text-sm text-gray-500 mt-1">
                              {{ postForm.title.length }}/150 ký tự
                            </div>
                          </ClientOnly>
                        </VeeField>
                      </div>

                      <!-- Mô tả -->
                      <div class="mb-4">
                        <VeeField
                          v-slot="{ field, errorMessage }"
                          name="description"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :name="field.name"
                            @update:model-value="field.onChange"
                            @blur="field.onBlur"
                            type="textarea"
                            :label="$t('post.create.fields.description')"
                            :placeholder="$t('post.create.placeholders.enterDescription')"
                            :required="true"
                            :maxlength="5000"
                            :rows="6"
                            :error="!!errorMessage"
                            :error-message="errorMessage"
                            class="w-full !bg-[#F7FAFC]"
                          />
                          <ClientOnly>
                            <div class="text-right text-sm text-gray-500 mt-1">
                              {{ postForm.description.length }}/5000 ký tự
                            </div>
                          </ClientOnly>
                        </VeeField>
                      </div>
                    </div>
                  </div>


                  <!-- Thông tin liên hệ -->
                  <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
                    <div class="card-body p-4">
                      <h3 class="card-title">Thông tin liên hệ</h3>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Tên liên hệ -->
                        <div>
                          <VeeField
                            v-slot="{ field, errorMessage }"
                            name="contactName"
                          >
                            <BaseInput
                              :model-value="field.value"
                            :name="field.name"
                            @update:model-value="field.onChange"
                            @blur="field.onBlur"
                              type="text"
                              :label="$t('post.create.fields.contactName')"
                              :placeholder="$t('post.create.placeholders.enterContactName')"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              class="w-full !bg-[#F7FAFC]"
                            />
                          </VeeField>
                        </div>

                        <!-- Số điện thoại -->
                        <div>
                          <VeeField
                            v-slot="{ field, errorMessage }"
                            name="contactPhone"
                          >
                            <BaseInput
                              :model-value="field.value"
                            :name="field.name"
                            @update:model-value="field.onChange"
                            @blur="field.onBlur"
                              type="tel"
                              :label="$t('post.create.fields.contactPhone')"
                              :placeholder="$t('post.create.placeholders.enterContactPhone')"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                              class="w-full !bg-[#F7FAFC]"
                            />
                          </VeeField>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Hình ảnh/video -->
                  <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
                    <div class="card-body p-4">
                      <h3 class="card-title">Hình ảnh/video</h3>
                      
                      <!-- Upload area -->
                      <div class="mb-4">
                        <!-- Horizontal layout for upload and previews -->
                        <div class="flex flex-wrap gap-4 items-start">
                          <!-- Upload input slot (always first) -->
                          <div class="flex flex-col items-center space-y-2">
                            <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-cyan-400 transition-colors cursor-pointer">
                              <input 
                                type="file" 
                                multiple 
                                accept="image/*,video/*"
                                @change="handleFileUpload"
                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div class="text-xs text-gray-500 text-center">
                              Tải ảnh/video
                            </div>
                          </div>
                          
                          <!-- Preview slots for uploaded files -->
                          <div 
                            v-for="(url, index) in previewUrls" 
                            :key="index"
                            class="flex flex-col items-center space-y-2"
                          >
                            <!-- Image/Video container with remove button -->
                            <div class="relative group">
                              <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md">
                                <!-- Image preview -->
                                <img 
                                  v-if="uploadedFiles[index]?.type.startsWith('image/')"
                                  :src="url" 
                                  :alt="`Preview ${index + 1}`"
                                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                                <!-- Video preview -->
                                <video 
                                  v-else-if="uploadedFiles[index]?.type.startsWith('video/')"
                                  :src="url"
                                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  muted
                                />
                                <!-- Fallback -->
                                <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span class="text-2xl">{{ getFileIcon(uploadedFiles[index]) }}</span>
                                </div>
                              </div>
                              
                              <!-- Remove button -->
                              <button
                                @click="removeFile(index)"
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100"
                              >
                                ×
                              </button>
                            </div>
                            
                            <!-- File info -->
                            <div class="text-center">
                              <div class="text-xs text-gray-500 font-medium">
                                {{ formatFileSize(uploadedFiles[index]?.size || 0) }}
                              </div>
                              <div class="text-xs text-gray-400 truncate max-w-16">
                                {{ uploadedFiles[index]?.name?.split('.')[0] || 'file' }}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Info text -->
                        <p class="text-sm text-gray-600 mt-4">
                          Tối đa 5 ảnh/video với tin đăng. Tổng dung lượng không quá 8MB. Chỉ được upload tối đa 1 video.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    class="btn btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
                    @click="resetPostForm"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button 
                    type="submit" 
                    class="btn bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 order-1 sm:order-2"
                    :disabled="loading || createPostLoading || !meta.valid"
                  >
                    <span v-if="loading || createPostLoading" class="loading loading-spinner loading-sm"></span>
                    {{ (loading || createPostLoading) ? $t('post.create.buttons.submitLoading') : $t('post.create.buttons.submit') }}
                  </button>
                </div>

              </VeeForm>
              <!-- Form Content -->
              <VeeForm 
                v-if="createPostTab === 'find-room'"
                ref="findRoomFormRef"
                @submit="onSubmitFindRoom"
                :validation-schema="findRoomValidationSchema"
                :initial-values="findRoomForm"
                v-slot="{ errors, meta, values, setErrors, resetForm }"
                class="space-y-6"
              >
                <!-- Tìm phòng trọ form (có chọn loại phòng) -->
                <div>
                  <!-- Thông tin mô tả -->
                  <div>
                    <h3 class="card-title">Thông tin mô tả</h3>
                    
                    <!-- Tiêu đề -->
                    <div class="mb-4">
                      <VeeField
                        v-slot="{ field, errorMessage }"
                        name="title"
                      >
                        <BaseInput
                          :model-value="field.value"
                          :name="field.name"
                          @update:model-value="field.onChange"
                          @blur="field.onBlur"
                          type="text"
                          :label="$t('post.create.fields.title')"
                          :placeholder="$t('post.create.placeholders.enterTitle')"
                          :required="true"
                          :maxlength="150"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                          class="!bg-[#F7FAFC]"
                        />
                        <ClientOnly>
                          <div class="text-right text-sm text-gray-500 mt-1">
                            {{ values.title?.length || 0 }}/150 ký tự
                          </div>
                        </ClientOnly>
                      </VeeField>
                    </div>

                    <!-- Mô tả -->
                    <div class="mb-4">
                      <VeeField
                        v-slot="{ field, errorMessage }"
                        name="description"
                      >
                        <BaseInput
                          :model-value="field.value"
                          :name="field.name"
                          @update:model-value="field.onChange"
                          @blur="field.onBlur"
                          type="textarea"
                          :label="$t('post.create.fields.description')"
                          :placeholder="$t('post.create.placeholders.enterDescription')"
                          :required="true"
                          :maxlength="5000"
                          :rows="8"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                          class="!bg-[#F7FAFC] min-h-[192px]"
                        />
                        <ClientOnly>
                          <div class="text-right text-sm text-gray-500 mt-1">
                            {{ values.description?.length || 0 }}/5000 {{ $t('profile.characterCount') }}
                          </div>
                        </ClientOnly>
                      </VeeField>
                    </div>
                  </div>

                  <!-- Thông tin yêu cầu -->
                  <div class="mt-6">
                    <h3 class="card-title">{{ $t('post.create.sections.requirements') }}</h3>
                    
                    <!-- Loại phòng -->
                    <div class="mb-4">
                      <VeeField
                        v-slot="{ field, errorMessage }"
                        name="roomType"
                      >
                        <BaseSelect
                          :model-value="field.value"
                          :name="field.name"
                          @update:model-value="field.onChange"
                          @blur="field.onBlur"
                          :label="$t('post.create.fields.roomType')"
                          :placeholder="$t('post.create.placeholders.selectRoomType')"
                          :required="true"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                          :options="[
                            { value: 'single_room', label: 'Phòng đơn' },
                            { value: 'shared_room', label: 'Phòng chung' },
                            { value: 'apartment', label: 'Căn hộ' },
                            { value: 'house', label: 'Nhà riêng' },
                            { value: 'studio', label: 'Studio' }
                          ]"
                          class="w-full !bg-[#F7FAFC]"
                        />
                      </VeeField>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    class="btn btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
                    @click="resetFindRoomForm"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button 
                    type="submit" 
                    class="btn bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 order-1 sm:order-2"
                    :disabled="loading || createPostLoading"
                  >
                    <span v-if="loading || createPostLoading" class="loading loading-spinner loading-sm"></span>
                    {{ (loading || createPostLoading) ? $t('post.create.buttons.submitLoading') : $t('post.create.buttons.submit') }}
                  </button>
                </div>
              </VeeForm>
            </div>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div v-else-if="activeTab === 'notifications'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body">
              <h2 class="text-2xl font-bold mb-4">{{ $t('profile.notifications.title') }}</h2>
              <p class="text-base-content/70">{{ $t('profile.notifications.newCount') }}</p>
            </div>
          </div>
        </div>

        <!-- Change Password Tab -->
        <div v-else-if="activeTab === 'change-password'">
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div class="card-body">
              <h2 class="text-2xl font-bold mb-4">{{ $t('profile.changePassword.title') }}</h2>
              <p class="text-base-content/70">{{ $t('profile.changePassword.comingSoon') }}</p>
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
                  <img src="/images/default-avatar.png" alt="User Avatar"/>
                </div>
              </div>

              <!-- User Name -->
              <h3 class="text-lg font-semibold text-base-content mb-4">{{ form.fullName || 'Hoàng Trung Hiếu' }}</h3>

              <!-- About Section -->
              <div class="w-full">
                <h4 class="text-sm font-medium text-base-content mb-3">{{ $t('profile.userInfo.about') }}</h4>

                <!-- Email -->
                <div class="flex items-center space-x-2 mb-2">
                  <EnvelopeIcon class="w-4 h-4 text-base-content/70"/>
                  <span class="text-sm text-base-content/70">{{ form.email || 'hoanghieu.nd.4820@gmail.com' }}</span>
                </div>

                <!-- Phone -->
                <div class="flex items-center space-x-2 mb-4">
                  <PhoneIcon class="w-4 h-4 text-base-content/70"/>
                  <span class="text-sm text-base-content/70">{{ form.phone || '0852560408' }}</span>
                </div>

                <!-- Edit Button -->
                <button @click="showEditModal = true" class="btn btn-primary btn-sm w-full">
                  <PencilIcon class="w-4 h-4 mr-2"/>
                  {{ $t('profile.userInfo.editInfo') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="mt-6">
          <ClientOnly>
            <div class="flex flex-col gap-2 w-full">
              <button
                  @click="switchTab('newsfeed')"
                  class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'newsfeed', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'newsfeed' }"
              >
                <Squares2X2Icon class="w-5 h-5"/>
                <span class="ml-2">Bảng tin</span>
              </button>
              <button
                  @click="switchTab('create-post')"
                  class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'create-post', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'create-post' }"
              >
                <DocumentPlusIcon class="w-5 h-5"/>
                <span class="ml-2">Đăng tin mới</span>
              </button>
              <button
                  @click="switchTab('notifications')"
                  class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'notifications', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'notifications' }"
              >
                <BellIcon class="w-5 h-5"/>
                <span class="ml-2">Thông báo</span>
                <span class="badge badge-error badge-sm ml-2">99+</span>
              </button>
              <button
                  @click="switchTab('change-password')"
                  class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-cyan-500 text-cyan-700': activeTab === 'change-password', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'change-password' }"
              >
                <LockClosedIcon class="w-5 h-5"/>
                <span class="ml-2">Đổi mật khẩu</span>
              </button>
              <button
                  @click="switchTab('logout')"
                  class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                  :class="{ 'border-red-500 text-red-700': activeTab === 'logout', 'border-transparent text-gray-600 hover:bg-cyan-50': activeTab !== 'logout' }"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5"/>
                <span class="ml-2">Đăng xuất</span>
              </button>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed bottom-4 right-4 z-50 mobile-nav-toggle">
      <button @click="toggleMobileSidebar" class="btn btn-primary btn-circle">
        <Bars3Icon class="w-6 h-6"/>
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
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg"
               class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg"
               class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
