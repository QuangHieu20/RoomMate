<script setup lang="ts">
import {
  UserCircleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
} from '@heroicons/vue/24/outline';

// Auth composable
const { isAuthenticated, currentUser, removeToken } = useAuth();
const router = useRouter();

// UI state
const showUserDropdown = ref(false);
const messageCount = ref(10);
const noticeCount = ref(99);

// No need for loadUserData anymore - user data comes from login response

// Logout function
const handleLogout = async () => {
  try {
    await removeToken();
    showUserDropdown.value = false;
    await router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Toggle user dropdown
const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
};

// Close dropdown when clicking outside
const closeDropdown = () => {
  showUserDropdown.value = false;
};

// No need to watch auth state - currentUser is reactive
</script>

<template>
  <div
    class="w-11/12 h-[82px] mx-auto flex justify-between items-center py-2 bg-white"
  >
    <!-- Logo -->
    <div class="w-3/12">
      <NuxtLink to="/">
        <img
          class="w-[180px] h-[27px]"
          src="/assets/images/logo-in-page.svg"
          alt="RoomMate"
        />
      </NuxtLink>
    </div>

    <!-- Navigation Items -->
    <div class="flex items-center gap-4">
      <ClientOnly>
        <!-- Messages Icon -->
        <NuxtLink
          to="/messages"
          class="relative p-2 text-gray-600 hover:text-cyan-500 transition-colors"
          v-if="isAuthenticated"
        >
          <ChatBubbleLeftRightIcon class="w-6 h-6" />
          <span
            v-if="messageCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ messageCount > 99 ? '99+' : messageCount }}
          </span>
        </NuxtLink>

        <!-- Notifications Icon -->
        <button
          class="relative p-2 text-gray-600 hover:text-cyan-500 transition-colors"
          v-if="isAuthenticated"
        >
          <BellIcon class="w-6 h-6" />
          <span
            v-if="noticeCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ noticeCount > 99 ? '99+' : noticeCount }}
          </span>
        </button>

        <!-- User Avatar Dropdown -->
        <div class="relative" v-if="isAuthenticated">
          <button
            @click="toggleUserDropdown"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img
              :src="currentUser?.avatar || '/images/default-avatar.png'"
              :alt="currentUser?.fullName"
              class="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              @error="$event.target.src = '/images/default-avatar.png'"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40"
          >
            <div class="py-2">
              <!-- User Info -->
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">
                  {{ currentUser?.fullName || 'User' }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ currentUser?.email || 'user@example.com' }}
                </p>
              </div>

              <!-- Menu Items -->
              <NuxtLink
                to="/profile"
                @click="closeDropdown"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Thông tin cá nhân
              </NuxtLink>

              <NuxtLink
                to="/settings"
                @click="closeDropdown"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cài đặt
              </NuxtLink>

              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <!-- Đăng tin Button -->
        <NuxtLink
          to="/profile?tab=create-post"
          class="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
          v-if="isAuthenticated"
        >
          <PencilIcon class="w-4 h-4" />
          <span class="text-sm font-medium">Đăng tin</span>
        </NuxtLink>

        <!-- Login Button (when not authenticated) -->
        <NuxtLink
          to="/login"
          class="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
          v-if="!isAuthenticated"
        >
          <UserCircleIcon class="w-4 h-4" />
          <span class="text-sm font-medium">Đăng nhập</span>
        </NuxtLink>
      </ClientOnly>
    </div>
  </div>

  <!-- Overlay to close dropdown -->
  <ClientOnly>
    <div
      v-if="showUserDropdown"
      @click="closeDropdown"
      class="fixed inset-0 z-30"
    ></div>
  </ClientOnly>
</template>

<style scoped></style>
