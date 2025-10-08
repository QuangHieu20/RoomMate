// User related interfaces
export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string;
}

// Login DTO
export interface LoginDto {
  email: string;
  password: string;
}

// Register DTO
export interface RegisterDto {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  avatar?: string;
}

// Login Response DTO
export interface LoginResponseDto {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string | null;
      phone: string;
    };
  };
  timestamp: string;
  path: string;
}

// User Profile Form
export interface UserProfileForm {
  fullName: string;
  email: string;
  phone: string;
}

//User Response Update Profile
export interface UserResponseUpdateProfile {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string
    fullName: string;
    avatar: string;
    phone: string;
  };
  timestamp: string;
  path: string;
}
