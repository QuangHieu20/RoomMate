import type { CreatePostDto, ApiResponse } from '~/types'

export const useCreatePost = () => {
  const { apiCall } = useApi()
  
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  
  // Methods
  const createPost = async (postData: CreatePostDto, mediaFiles?: File[]): Promise<any> => {
    loading.value = true
    error.value = null
    
    try {
      
      // Tạo FormData từ postData
      const formData = new FormData()
      
      // Thêm các trường text
      formData.append('type', postData.type)
      formData.append('title', postData.title)
      
      if (postData.description) {
        formData.append('description', postData.description)
      }
      
      if (postData.price !== undefined) {
        formData.append('price', postData.price.toString())
      }
      
      if (postData.priceType) {
        formData.append('priceType', postData.priceType)
      }
      
      if (postData.area !== undefined) {
        formData.append('area', postData.area.toString())
      }
      
      if (postData.address) {
        formData.append('address', postData.address)
      }
      
      if (postData.locationId !== undefined) {
        formData.append('locationId', postData.locationId.toString())
      }
      
      if (postData.latitude !== undefined) {
        formData.append('latitude', postData.latitude.toString())
      }
      
      if (postData.longitude !== undefined) {
        formData.append('longitude', postData.longitude.toString())
      }
      
      if (postData.roomType) {
        formData.append('roomType', postData.roomType)
      }
      
      if (postData.genderRequirement) {
        formData.append('genderRequirement', postData.genderRequirement)
      }
      
      if (postData.maxOccupants !== undefined) {
        formData.append('maxOccupants', postData.maxOccupants.toString())
      }
      
      if (postData.availableFrom) {
        formData.append('availableFrom', new Date(postData.availableFrom).toISOString())
      }
      
      if (postData.contactName) {
        formData.append('contactName', postData.contactName)
      }
      
      if (postData.contactPhone) {
        formData.append('contactPhone', postData.contactPhone)
      }
      
      // Thêm media files nếu có
      if (mediaFiles && mediaFiles.length > 0) {
        mediaFiles.forEach((file, index) => {
          formData.append('mediaFiles', file)
        })
      }
      
      // Debug: Log FormData contents
      
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBase || 'https://roommate.id.vn'
      
      const response = await $fetch<ApiResponse>('/posts/create', {
        baseURL,
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      
      
      return response.data
    } catch (err: any) {
      console.error('❌ Create post failed:', err)
      error.value = err.message || 'Không thể tạo bài viết'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    createPost
  }
}
