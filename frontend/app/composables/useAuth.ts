import type { LoginDto, RegisterDto, LoginResponseDto } from '~/types/auth'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'https://roommate.id.vn'
  // Check if user is authenticated
  const isAuthenticated = useState<boolean>('auth-isAuthenticated', () => false)
  const currentUser = useState('auth-currentUser', () => null)
  // Login function
  const login = async (credentials: LoginDto): Promise<LoginResponseDto> => {
    try {
   
      const response = await $fetch<LoginResponseDto>('/auth/login', {
        baseURL,
        method: 'POST',
        body: credentials,
        credentials: 'include' // Important for HttpOnly cookies
      })
      
      
      // Set authenticated state after successful login
      isAuthenticated.value = true
      currentUser.value = response.data.user
      console.log(isAuthenticated.value);
      
      
      return response
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.data?.message || 'Đăng nhập thất bại')
    }
  }

  // Register function
  const register = async (userData: RegisterDto): Promise<LoginResponseDto> => {
    try {
      const response = await $fetch<LoginResponseDto>('/auth/register', {
        baseURL,
        method: 'POST',
        body: userData,
        credentials: 'include' // Important for HttpOnly cookies
      })
      
      // Set authenticated state after successful registration
      isAuthenticated.value = true
      currentUser.value = response.data.user
      
      return response
    } catch (error: any) {
      // Preserve full error object for detailed handling
      const enhancedError = new Error(error.data?.message || 'Đăng ký thất bại')
      enhancedError.data = error.data
      enhancedError.status = error.status
      throw enhancedError
    }
  }

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
        await removeToken()
        await navigateTo('/login')
        throw new Error('Phiên đăng nhập đã hết hạn')
      }
      throw error
    }
  }

  // HttpOnly Cookie methods (Most secure)
  // Note: With HttpOnly cookies, token is automatically managed by backend
  // Frontend doesn't need to manually save/get tokens

  const saveToken = async (token: string) => {
    console.log('Token được tự động lưu vào HttpOnly cookie bởi backend')
    console.log('Frontend không cần xử lý token thủ công')
  }

  const getToken = async (): Promise<string | null> => {
    try {      
      // Call backend endpoint to get token from HttpOnly cookie
      const response = await $fetch<{ access_token: string }>('/auth/get-token', {
        baseURL,
        method: 'GET',
        credentials: 'include' // Important for cookies
      })
    
  
      return response.data.access_token
    } catch (error) {
      console.error('Failed to get token:', error)
      return null
    }
  }

  const removeToken = async () => {
    try {
      // Call backend endpoint to clear HttpOnly cookie
      await $fetch('/auth/clear-token', {
        baseURL,
        method: 'POST',
        credentials: 'include' // Important for cookies
      })
      
      // Clear authentication state
      isAuthenticated.value = false
      currentUser.value = null
    } catch (error) {
      console.error('Failed to remove token:', error)
    }
  }


  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = await getToken()
      isAuthenticated.value = !!token
    } catch (error) {
      console.log('error', error)
      isAuthenticated.value = false
    }
    
    return isAuthenticated.value
  }


  return {
    login,
    register,
    saveToken,
    removeToken,
    isAuthenticated,
    currentUser,
    apiCall,
  }
}
