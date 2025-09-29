// Composable for making authenticated API calls with HttpOnly cookies
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'https://roommate.id.vn'

  // Generic API call with automatic token inclusion
  const apiCall = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    try {
      const response = await $fetch<T>(endpoint, {
        baseURL,
        credentials: 'include', // Automatically include HttpOnly cookies
        ...options
      })
      return response
    } catch (error: any) {
      // Handle authentication errors
      if (error.status === 401) {
        // Token expired or invalid, redirect to login
        const { removeToken } = useAuth()
        await removeToken()
        await navigateTo('/login')
        throw new Error('Phiên đăng nhập đã hết hạn')
      }
      throw error
    }
  }

  // GET request
  const get = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'GET', ...options })
  }

  // POST request
  const post = async <T>(endpoint: string, body: any, options: any = {}): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'POST', body, ...options })
  }

  // PUT request
  const put = async <T>(endpoint: string, body: any, options: any = {}): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'PUT', body, ...options })
  }

  // DELETE request
  const del = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'DELETE', ...options })
  }

  // PATCH request
  const patch = async <T>(endpoint: string, body: any, options: any = {}): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'PATCH', body, ...options })
  }

  return {
    apiCall,
    get,
    post,
    put,
    del,
    patch
  }
}
