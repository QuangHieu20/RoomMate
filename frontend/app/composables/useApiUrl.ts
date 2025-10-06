/**
 * Composable để quản lý API URL và media URL
 */
export const useApiUrl = () => {
  const config = useRuntimeConfig();

  /**
   * Lấy base URL của API
   */
  const getApiBase = () => {
    return config.public.apiBase;
  };

  /**
   * Lấy base URL của media
   */
  const getMediaBase = () => {
    return config.public.mediaBase;
  };

  /**
   * Tạo URL cho media file
   * @param mediaUrl - URL của media từ API
   * @returns Full URL cho media
   */
  const getMediaUrl = (mediaUrl: string) => {
    if (!mediaUrl) return '';

    // Nếu đã là full URL thì trả về nguyên
    if (mediaUrl.startsWith('http')) {
      return mediaUrl;
    }

    // Nếu mediaUrl đã có /api/v1/ thì loại bỏ nó
    let cleanMediaUrl = mediaUrl;
    if (mediaUrl.startsWith('/api/v1/')) {
      cleanMediaUrl = mediaUrl.replace('/api/v1', '');
      console.log('Cleaned mediaUrl:', mediaUrl, '->', cleanMediaUrl);
    }

    // Sử dụng mediaBase thay vì apiBase cho media files
    // Xử lý path để tránh double slash
    const baseUrl = config.public.mediaBase.endsWith('/')
      ? config.public.mediaBase.slice(0, -1)
      : config.public.mediaBase;
    const mediaPath = cleanMediaUrl.startsWith('/')
      ? cleanMediaUrl
      : `/${cleanMediaUrl}`;

    // Kết quả: https://media.roommate.id.vn/uploads/posts/... hoặc https://roommate.id.vn/uploads/posts/...
    return `${baseUrl}${mediaPath}`;
  };

  /**
   * Tạo URL cho API endpoint
   * @param endpoint - Endpoint của API
   * @returns Full URL cho API
   */
  const getApiUrl = (endpoint: string) => {
    if (!endpoint) return '';

    // Nếu đã là full URL thì trả về nguyên
    if (endpoint.startsWith('http')) {
      return endpoint;
    }

    // Nếu là relative path thì thêm base URL
    // Xử lý path để tránh double slash
    const baseUrl = config.public.apiBase.endsWith('/')
      ? config.public.apiBase.slice(0, -1)
      : config.public.apiBase;
    const apiPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    return `${baseUrl}${apiPath}`;
  };

  return {
    getApiBase,
    getMediaBase,
    getMediaUrl,
    getApiUrl,
  };
};
