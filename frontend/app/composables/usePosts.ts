import type { Post, ApiResponse } from '~/types';

export const usePosts = () => {
  const { apiCall } = useApi();

  // State
  const posts = reactive<Post[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Methods
  const loadUserPosts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiCall<ApiResponse>('/posts/user', {
        method: 'POST',
      });

      if (response.success && response.data) {
        Object.assign(posts, response.data);
      } else {
        throw new Error(response.message || 'Không thể tải bài viết');
      }
    } catch (err: any) {
      error.value = err.message || 'Không thể tải bài viết của người dùng';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refreshPosts = async () => {
    await loadUserPosts();
  };

  const clearPosts = () => {
    Object.assign(posts, []);
    error.value = null;
  };

  const deletePost = async (postId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiCall<ApiResponse>(`/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // Sử dụng cookie thay vì Bearer token
      });

      if (response.success) {
        // Remove post from local state
        const index = posts.findIndex(post => post.id === postId);
        if (index !== -1) {
          posts.splice(index, 1);
        }
        return true;
      } else {
        throw new Error(response.message || 'Không thể xóa bài viết');
      }
    } catch (err: any) {
      error.value = err.message || 'Không thể xóa bài viết';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    loadUserPosts,
    refreshPosts,
    clearPosts,
    deletePost,
  };
};
