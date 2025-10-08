<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import {
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  Squares2X2Icon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  DocumentPlusIcon,
} from '@heroicons/vue/24/outline';

import PostSkeleton from '~/components/base/PostSkeleton.vue';
import { useValidationSchema } from '~/composables/useValidation';
import { usePosts } from '~/composables/usePosts';
import { useCreatePost } from '~/composables/useCreatePost';
import { useProfileNavigation } from '~/composables/useProfileNavigation';
import { getLocalStorage } from '~/ultils/localStorage';
import type {
  ToastMessage,
  PostFormData,
  CreatePostTab,
  ProfileTab,
} from '~/types';
import {
  RoomType,
  PriceType,
  PostType,
  APP_CONSTANTS,
  DEFAULT_FORM_VALUES,
} from '~/types/enums';
const { getMediaUrl } = useApiUrl();

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

// Async components for lazy loading
const NewsfeedTab = defineAsyncComponent(
  () => import('./_components/NewsfeedTab.vue')
);
const CreatePostTab = defineAsyncComponent(
  () => import('./_components/CreatePostTab.vue')
);
const NotificationsTab = defineAsyncComponent(
  () => import('./_components/NotificationsTab.vue')
);
const ChangePasswordTab = defineAsyncComponent(
  () => import('./_components/ChangePasswordTab.vue')
);
const LogoutTab = defineAsyncComponent(
  () => import('./_components/LogoutTab.vue')
);


const {
  posts,
  loading: postsLoading,
  error: postsError,
  loadUserPosts,
} = usePosts();
const {
  createPost,
  loading: createPostLoading,
  error: createPostError,
} = useCreatePost();
const { getInitialTab, cleanUrl } = useProfileNavigation();

// Validation setup
const { postFormSchema } = useValidationSchema();
const validationSchema = toTypedSchema(postFormSchema.value);

// Form data
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
});

// UI state
const loading = ref(false);
const showMobileSidebar = ref(false);
const showEditModal = ref(false);
const activeTab = ref<ProfileTab>('newsfeed');
const createPostTab = ref<CreatePostTab>('rent-out');
const postFormRef = ref();
const findRoomFormRef = ref();
const userInfo = reactive({
  id: '',
  email: '',
  fullName: '',
  avatar: '',
  phone: '',
});


onMounted(() => {
  if (process.client) {
    const savedUserInfo = getLocalStorage('userInfo');
    if (savedUserInfo) {
      Object.assign(userInfo, savedUserInfo);
    }
  }
});

// Load posts on mount
onMounted(async () => {
  try {
    // Handle query parameters for tab navigation
    const { activeTab: initialTab, createPostTab: initialCreateTab } =
      getInitialTab();

    if (
      [
        'newsfeed',
        'create-post',
        'notifications',
        'change-password',
        'logout',
      ].includes(initialTab)
    ) {
      activeTab.value = initialTab as ProfileTab;

      // If navigating to create-post, also handle createPostTab
      if (initialTab === 'create-post' && initialCreateTab) {
        if (['rent-out', 'find-room'].includes(initialCreateTab)) {
          createPostTab.value = initialCreateTab as CreatePostTab;
        }
      }

      // Clean up URL after setting tab
      cleanUrl();
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }
});

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
  roomType: RoomType.SINGLE_ROOM,
  price: null,
  priceType: PriceType.MONTHLY,
  area: null,

  // Content
  title: '',
  description: '',

  // Requirements
  genderRequirement: DEFAULT_FORM_VALUES.GENDER_REQUIREMENT,
  maxOccupants: DEFAULT_FORM_VALUES.MAX_OCCUPANTS_SINGLE,
  availableFrom: '',

  // Contact
  contactName: '',
  contactPhone: '',
});

// Find room form data for "Tìm phòng trọ" - simplified with 3 fields
const findRoomForm = reactive({
  // Content - required fields
  title: '',
  description: '',
  roomType: RoomType.SINGLE_ROOM,
});

// Media upload state
const uploadedFiles = ref<File[]>([]);
const previewUrls = ref<string[]>([]);
const base64Files = ref<string[]>([]); // Store base64 strings


// Toast state
const toast = reactive<ToastMessage & { show: boolean }>({
  show: false,
  type: 'info',
  message: '',
  duration: APP_CONSTANTS.TOAST_DURATION,
});

// ===== METHODS =====
// Show toast function
const showToast = (
  type: ToastMessage['type'],
  message: string,
  duration = APP_CONSTANTS.TOAST_DURATION
) => {
  toast.type = type;
  toast.message = message;
  toast.duration = duration;
  toast.show = true;

  setTimeout(() => {
    toast.show = false;
  }, duration);
};

// Toggle mobile sidebar
const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};

// Switch tab
const switchTab = (tabName: ProfileTab) => {
  activeTab.value = tabName;
};


// Load user profile
const loadProfile = async () => {
  try {
    const userInfoStr = getLocalStorage('userInfo');
    if (userInfoStr) {
      form.fullName = userInfoStr.fullName || '';
      form.email = userInfoStr.email || '';
      form.phone = userInfoStr.phone || '';
    }
  } catch (error: any) {
    console.error('Lỗi tải thông tin:', error);
    showToast('error', 'Không thể tải thông tin người dùng');
  }
};

// Handle create post
const handleCreatePost = async (values: any) => {
  loading.value = true;

  try {
    // Validate required fields for rent-out tab
    if (createPostTab.value === 'rent-out') {
      if (
        !values.province ||
        !values.district ||
        !values.ward ||
        !values.address
      ) {
        showToast('error', 'Vui lòng điền đầy đủ thông tin địa chỉ');
        return;
      }
      if (!values.roomType || !values.price || !values.area) {
        showToast('error', 'Vui lòng điền đầy đủ thông tin phòng');
        return;
      }
    }

    // Map form data to API format
    const postData = {
      type:
        createPostTab.value === 'rent-out'
          ? PostType.FOR_RENT
          : PostType.LOOKING_FOR,
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
      genderRequirement: DEFAULT_FORM_VALUES.GENDER_REQUIREMENT, // Fixed value
      maxOccupants: DEFAULT_FORM_VALUES.MAX_OCCUPANTS, // Fixed value
      availableFrom: DEFAULT_FORM_VALUES.AVAILABLE_FROM(), // Fixed to today
      contactName: values.contactName || undefined,
      contactPhone: values.contactPhone || undefined,
    };

    // Remove undefined values
    const cleanPostData = Object.fromEntries(
      Object.entries(postData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    // Convert base64 files to File objects
    const mediaFiles: File[] = [];
    if (base64Files.value && base64Files.value.length > 0) {
      for (let i = 0; i < base64Files.value.length; i++) {
        const base64String = base64Files.value[i];
        console.log(
          `Processing file ${i}:`,
          base64String ? base64String.substring(0, 50) + '...' : 'null'
        );
        if (base64String) {
          const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
          console.log(
            `Matches for file ${i}:`,
            matches ? matches.length : 'null'
          );
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            if (mimeType && base64Data) {
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let j = 0; j < byteCharacters.length; j++) {
                byteNumbers[j] = byteCharacters.charCodeAt(j);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const fileExtension = mimeType.split('/')[1] || APP_CONSTANTS.DEFAULT_FILE_EXTENSION;
              const fileName = mimeType.startsWith('video/')
                ? `video_${i}.${fileExtension}`
                : `image_${i}.${fileExtension}`;
              const file = new File([byteArray], fileName, { type: mimeType });
              mediaFiles.push(file);
            }
          }
        }
      }
    } else {
      console.log('No base64Files found or empty array');
    }


    // Call API with separate parameters
    await createPost(cleanPostData as any, mediaFiles);

    showToast('success', $t('post.create.messages.createSuccess'));

    // Reset form
    resetPostForm();

    // Reload posts
    await loadUserPosts();

    // Switch to newsfeed tab
    activeTab.value = 'newsfeed';
  } catch (error: any) {
    console.error('Lỗi đăng tin:', error);
    showToast('error', error.message || $t('post.create.messages.createError'));
  } finally {
    loading.value = false;
  }
};


// Reset post form
const resetPostForm = () => {
  // Reset form using VeeForm ref if available
  if (postFormRef.value) {
    postFormRef.value.resetForm();
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
    roomType: DEFAULT_FORM_VALUES.ROOM_TYPE,
    price: null,
    priceType: DEFAULT_FORM_VALUES.PRICE_TYPE,
    area: null,
    title: '',
    description: '',
    genderRequirement: DEFAULT_FORM_VALUES.GENDER_REQUIREMENT,
    maxOccupants: DEFAULT_FORM_VALUES.MAX_OCCUPANTS,
    availableFrom: DEFAULT_FORM_VALUES.AVAILABLE_FROM(),
    contactName: '',
    contactPhone: '',
  });

  // Reset media files
  base64Files.value = [];
};

// Handle find room form submit (for VeeForm)
const onSubmitFindRoom = async (values: any) => {
  loading.value = true;

  try {
    // Validate required fields
    if (!values.title?.trim()) {
      showToast('error', 'Vui lòng nhập tiêu đề');
      return;
    }

    if (!values.description?.trim()) {
      showToast('error', 'Vui lòng nhập mô tả');
      return;
    }

    // Map form data to API format with default values
    const postData = {
      type: PostType.LOOKING_FOR,
      title: values.title.trim(),
      description: values.description.trim(),
      roomType: values.roomType || findRoomForm.roomType,
      // Set default values for all other fields
      genderRequirement: DEFAULT_FORM_VALUES.GENDER_REQUIREMENT, // Fixed value
      maxOccupants: DEFAULT_FORM_VALUES.MAX_OCCUPANTS, // Fixed value
      availableFrom: DEFAULT_FORM_VALUES.AVAILABLE_FROM(), // Today's date
      contactName: userInfo.fullName || APP_CONSTANTS.DEFAULT_USER_NAME,
      contactPhone: userInfo.phone || '',
      // Optional fields with defaults
      price: null,
      priceType: DEFAULT_FORM_VALUES.PRICE_TYPE,
      area: null,
      address: null,
      locationId: null,
      latitude: null,
      longitude: null,
      // Add base64 files for upload - will be validated by form schema
      mediaFiles: base64Files.value,
    };

    // Remove undefined values
    const cleanPostData = Object.fromEntries(
      Object.entries(postData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    // Call API using the same createPost function
    await createPost(cleanPostData as any);

    showToast('success', 'Đăng tin tìm phòng trọ thành công!');

    // Reset form
    resetFindRoomForm();

    // Reload posts
    await loadUserPosts();

    // Switch to newsfeed tab
    activeTab.value = 'newsfeed';
  } catch (error: any) {
    console.error('Lỗi đăng tin tìm phòng trọ:', error);
    showToast(
      'error',
      error.message || 'Có lỗi xảy ra khi đăng tin tìm phòng trọ'
    );
  } finally {
    loading.value = false;
  }
};

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  try {
    // Process files - validation will be handled by form schema
    for (const file of Array.from(files)) {
      // Convert to base64
      const base64 = await fileToBase64(file);

      // Store original file and base64
      uploadedFiles.value.push(file);
      base64Files.value.push(base64);

      // Create preview URL
      const url = URL.createObjectURL(file);
      previewUrls.value.push(url);
    }

    showToast('success', `Đã thêm ${files.length} file`);
  } catch (error: any) {
    showToast('error', 'Có lỗi xảy ra khi xử lý file');
  }
};

// Remove file
const removeFile = (index: number) => {
  // Revoke URL to free memory
  if (previewUrls.value[index]) {
    URL.revokeObjectURL(previewUrls.value[index]);
  }

  uploadedFiles.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
  base64Files.value.splice(index, 1);

  showToast('success', 'Đã xóa file');
};

// Helper functions moved to CreatePostTab component

// Reset form function for "Tìm phòng trọ"
const resetFindRoomForm = () => {
  // Reset form using VeeForm ref if available
  if (findRoomFormRef.value) {
    findRoomFormRef.value.resetForm();
  }

  // Reset reactive form data - 3 fields
  Object.assign(findRoomForm, {
    title: '',
    description: '',
    roomType: DEFAULT_FORM_VALUES.ROOM_TYPE,
  });

  // Reset media files
  previewUrls.value.forEach(url => URL.revokeObjectURL(url));
  uploadedFiles.value = [];
  previewUrls.value = [];
  base64Files.value = [];
};

// Update profile
const handleUpdateProfile = async () => {
  loading.value = true;

  try {
    // Load lại profile từ localStorage sau khi ProfileEditModal đã cập nhật thành công
    await loadProfile();
    
    showToast('success', 'Cập nhật thông tin thành công!');
    showEditModal.value = false;
  } catch (error: any) {
    console.error('Lỗi cập nhật:', error);
    showToast('error', error.message || 'Có lỗi xảy ra khi cập nhật');
  } finally {
    loading.value = false;
  }
};

if (process.client) {
  await loadProfile();
}


// Load posts với error handling
await loadUserPosts().catch(error => {
  showToast('error', 'Không thể tải bài viết của người dùng');
});


onUnmounted(() => {
  previewUrls.value.forEach(url => URL.revokeObjectURL(url));
  base64Files.value = [];
});
</script>
<template>
  <div class="min-h-screen bg-base-100">
    <div class="flex">
      <!-- Desktop Sidebar -->
      <div
        :class="`${APP_CONSTANTS.SIDEBAR_WIDTH} bg-base-100 border-r border-base-300 min-h-screen p-4 hidden lg:block sidebar sidebar-scroll`"
      >
        <!-- User Profile Card -->
        <div class="card shadow-sm border border-base-300">
          <div class="card-body p-4">
            <div class="flex flex-col items-center text-center">
              <!-- Avatar -->
              <div class="avatar mb-4">
                <div class="w-20 rounded-full">
                  <img :src="getMediaUrl(userInfo.avatar)"  @error="$event.target.src = '/images/default-avatar.png'" alt="User Avatar" />
                </div>
              </div>

              <!-- User Name -->
              <h2 class="text-lg font-semibold text-base-content mb-4">
                {{ form.fullName || APP_CONSTANTS.DEFAULT_USER.FULL_NAME }}
              </h2>

              <!-- About Section -->
              <div :class="`w-full bg-[${APP_CONSTANTS.BACKGROUND_LIGHT}] rounded-[${APP_CONSTANTS.BORDER_RADIUS}] p-2 mb-1`">
                <h3
                  class="text-cyan-500 text-xl font-medium text-base-content text-left mb-3"
                >
                  {{ $t('profile.userInfo.about') }}
                </h3>

                <!-- Email -->
                <div
                  class="flex items-center space-x-2 mb-2 border-b border-gray-200"
                >
                  <EnvelopeIcon
                    :class="`w-4 ${APP_CONSTANTS.ICON_SIZE} text-cyan-500 text-base-content/70`"
                  />
                  <span class="text-sm text-base-content/70">{{
                    form.email || APP_CONSTANTS.DEFAULT_USER.EMAIL
                  }}</span>
                </div>

                <!-- Phone -->
                <div class="flex items-center space-x-2">
                  <PhoneIcon
                    :class="`w-4 ${APP_CONSTANTS.ICON_SIZE} text-cyan-500 text-base-content/70`"
                  />
                  <span class="text-sm text-base-content/70">{{
                    form.phone || APP_CONSTANTS.DEFAULT_USER.PHONE
                  }}</span>
                </div>
              </div>
              <!-- Edit Button -->
              <button
                @click="showEditModal = true"
                class="btn bg-cyan-500 text-white btn-sm w-full"
              >
                {{ $t('profile.userInfo.editInfo') }}
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
                :class="{
                  'border-cyan-500 text-cyan-700 !bg-cyan-50':
                    activeTab === 'newsfeed',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'newsfeed',
                }"
              >
                <Squares2X2Icon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.newsfeed') }}</span>
              </button>
              <button
                @click="switchTab('create-post')"
                class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-cyan-500 text-cyan-700 !bg-cyan-50':
                    activeTab === 'create-post',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'create-post',
                }"
              >
                <DocumentPlusIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.createPost') }}</span>
              </button>
              <button
                @click="switchTab('notifications')"
                class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-cyan-500 text-cyan-700 !bg-cyan-50':
                    activeTab === 'notifications',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'notifications',
                }"
              >
                <BellIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.notifications') }}</span>
                <span class="badge badge-error badge-sm ml-2 text-white"
                  >{{ APP_CONSTANTS.NOTIFICATION_BADGE_COUNT }}+</span
                >
              </button>
              <button
                @click="switchTab('change-password')"
                class="btn rounded-tl-none rounded-bl-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-cyan-500 text-cyan-700 !bg-cyan-50':
                    activeTab === 'change-password',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'change-password',
                }"
              >
                <LockClosedIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.changePassword') }}</span>
              </button>
              <button
                @click="switchTab('logout')"
                class="btn rounded-none justify-start bg-transparent border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-red-500 text-red-700 !bg-cyan-50':
                    activeTab === 'logout',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'logout',
                }"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.logout') }}</span>
              </button>
            </div>
          </ClientOnly>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-4 lg:p-6 main-content">
        <!-- Newsfeed Tab -->
        <Suspense>
          <template #default>
            <NewsfeedTab
              v-if="activeTab === 'newsfeed'"
              :posts="posts"
              :posts-loading="postsLoading"
              :posts-error="postsError"
              :form="form"
              @load-user-posts="loadUserPosts"
            />
          </template>
          <template #fallback>
            <PostSkeleton :count="3" />
          </template>
        </Suspense>

        <!-- Create Post Tab -->
        <Suspense>
          <template #default>
            <CreatePostTab
              v-if="activeTab === 'create-post'"
              :create-post-tab="createPostTab"
              :post-form="postForm"
              :find-room-form="findRoomForm"
              :uploaded-files="uploadedFiles"
              :preview-urls="previewUrls"
              :base64-files="base64Files"
              :loading="loading"
              :create-post-loading="createPostLoading"
              @update:create-post-tab="createPostTab = $event"
              @update:post-form="postForm = $event"
              @update:find-room-form="findRoomForm = $event"
              @update:uploaded-files="uploadedFiles = $event"
              @update:preview-urls="previewUrls = $event"
              @update:base64-files="base64Files = $event"
              @handle-create-post="handleCreatePost"
              @on-submit-find-room="onSubmitFindRoom"
              @reset-post-form="resetPostForm"
              @reset-find-room-form="resetFindRoomForm"
              @handle-file-upload="handleFileUpload"
              @remove-file="removeFile"
            />
          </template>
          <template #fallback>
            <div class="flex justify-center items-center h-64">
              <div class="loading loading-spinner loading-lg"></div>
            </div>
          </template>
        </Suspense>

        <!-- Notifications Tab -->
        <Suspense>
          <template #default>
            <NotificationsTab v-if="activeTab === 'notifications'" />
          </template>
          <template #fallback>
            <div class="flex justify-center items-center h-64">
              <div class="loading loading-spinner loading-lg"></div>
            </div>
          </template>
        </Suspense>

        <!-- Change Password Tab -->
        <Suspense>
          <template #default>
            <ChangePasswordTab v-if="activeTab === 'change-password'" />
          </template>
          <template #fallback>
            <div class="flex justify-center items-center h-64">
              <div class="loading loading-spinner loading-lg"></div>
            </div>
          </template>
        </Suspense>

        <!-- Logout Tab -->
        <Suspense>
          <template #default>
            <LogoutTab v-if="activeTab === 'logout'" />
          </template>
          <template #fallback>
            <div class="flex justify-center items-center h-64">
              <div class="loading loading-spinner loading-lg"></div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <div v-if="showMobileSidebar" class="lg:hidden fixed inset-0 z-50">
      <div
        class="fixed inset-0 bg-black bg-opacity-50"
        @click="toggleMobileSidebar"
      ></div>
      <div
        class="fixed left-0 top-0 h-full w-80 bg-base-100 border-r border-base-300 p-6 overflow-y-auto"
      >
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
              <h3 class="text-lg font-semibold text-base-content mb-4">
                {{ form.fullName || APP_CONSTANTS.DEFAULT_USER.FULL_NAME }}
              </h3>

              <!-- About Section -->
              <div class="w-full">
                <h4 class="text-sm font-medium text-base-content mb-3">
                  {{ $t('profile.userInfo.about') }}
                </h4>

                <!-- Email -->
                <div class="flex items-center space-x-2 mb-2">
                  <EnvelopeIcon class="w-4 h-4 text-base-content/70" />
                  <span class="text-sm text-base-content/70">{{
                    form.email || APP_CONSTANTS.DEFAULT_USER.EMAIL
                  }}</span>
                </div>

                <!-- Phone -->
                <div class="flex items-center space-x-2 mb-4">
                  <PhoneIcon class="w-4 h-4 text-base-content/70" />
                  <span class="text-sm text-base-content/70">{{
                    form.phone || APP_CONSTANTS.DEFAULT_USER.PHONE
                  }}</span>
                </div>

                <!-- Edit Button -->
                <button
                  @click="showEditModal = true"
                  class="btn btn-primary btn-sm w-full"
                >
                  <PencilIcon class="w-4 h-4 mr-2" />
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
                :class="{
                  'border-cyan-500 text-cyan-700': activeTab === 'newsfeed',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'newsfeed',
                }"
              >
                <Squares2X2Icon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.newsfeed') }}</span>
              </button>
              <button
                @click="switchTab('create-post')"
                class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-cyan-500 text-cyan-700': activeTab === 'create-post',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'create-post',
                }"
              >
                <DocumentPlusIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.createPost') }}</span>
              </button>
              <button
                @click="switchTab('notifications')"
                class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-cyan-500 text-cyan-700':
                    activeTab === 'notifications',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'notifications',
                }"
              >
                <BellIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.notifications') }}</span>
                <span class="badge badge-error badge-sm ml-2">{{ APP_CONSTANTS.NOTIFICATION_BADGE_COUNT }}+</span>
              </button>
              <button
                @click="switchTab('change-password')"
                class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-cyan-500 text-cyan-700':
                    activeTab === 'change-password',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'change-password',
                }"
              >
                <LockClosedIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.changePassword') }}</span>
              </button>
              <button
                @click="switchTab('logout')"
                class="btn justify-start bg-cyan-50 border-l-2 border-0 border-t-0 border-r-0 border-b-0"
                :class="{
                  'border-red-500 text-red-700': activeTab === 'logout',
                  'border-transparent text-gray-600 hover:bg-cyan-50':
                    activeTab !== 'logout',
                }"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                <span class="ml-2">{{ $t('profile.navigation.logout') }}</span>
              </button>
            </div>
          </ClientOnly>
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
      @close="handleUpdateProfile"
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
            'alert-info': toast.type === 'info',
          }"
        >
          <svg
            v-if="toast.type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
