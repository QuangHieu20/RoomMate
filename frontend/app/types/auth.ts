// Login DTO
export interface LoginDto {
  email: string
  password: string
}

// Register DTO
export interface RegisterDto {
  email: string
  phone: string
  fullName: string
  password: string
  avatar?: string
}

// Login Response DTO
export interface LoginResponseDto {
  access_token: string
}

// User interface
export interface User {
  id: string
  email: string
  phone: string
  fullName: string
  avatar?: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
  emailVerifiedAt: string
}

// Form validation errors
export interface FormErrors {
  email?: string
  password?: string
  phone?: string
  fullName?: string
}

// Toast message types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  type: ToastType
  message: string
  duration?: number
}
