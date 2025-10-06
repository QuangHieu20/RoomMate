// UI related interfaces
export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// Form validation errors
export interface FormErrors {
  email?: string
  password?: string
  phone?: string
  fullName?: string
  title?: string
  description?: string
  price?: string
  area?: string
  address?: string
}

// Post Form Data
export interface PostFormData {
  // Location
  province: string
  district: string
  ward: string
  address: string
  locationId: number | null
  latitude: number | null
  longitude: number | null
  
  // Room details
  roomType: 'single_room' | 'shared_room' | 'apartment' | 'house' | 'studio'
  price: number | null
  priceType: 'monthly' | 'daily'
  area: number | null
  
  // Content
  title: string
  description: string
  
  // Requirements
  genderRequirement: 'male' | 'female' | 'any'
  maxOccupants: number
  availableFrom: string
  
  // Contact
  contactName: string
  contactPhone: string
}

// Tab types
export type CreatePostTab = 'rent-out' | 'find-room'
export type ProfileTab = 'newsfeed' | 'create-post' | 'notifications' | 'change-password' | 'logout'
