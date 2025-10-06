// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Post related interfaces
export interface Post {
  id: string;
  userId: string;
  type: 'for_rent' | 'looking_for';
  title: string;
  description?: string;
  price?: number;
  priceType: 'monthly' | 'daily';
  area?: number;
  address?: string;
  locationId?: number;
  latitude?: string;
  longitude?: string;
  roomType?: 'single_room' | 'shared_room' | 'apartment' | 'house' | 'studio';
  genderRequirement: 'male' | 'female' | 'any';
  maxOccupants: number;
  availableFrom?: string;
  contactName?: string;
  contactPhone?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'rented';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// Create Post DTO
export interface CreatePostDto {
  type: 'for_rent' | 'looking_for';
  title: string;
  description?: string;
  price?: number;
  priceType?: 'monthly' | 'daily';
  area?: number;
  address?: string;
  locationId?: number;
  latitude?: number;
  longitude?: number;
  roomType?: 'single_room' | 'shared_room' | 'apartment' | 'house' | 'studio';
  genderRequirement?: 'male' | 'female' | 'any';
  maxOccupants?: number;
  availableFrom?: string;
  contactName?: string;
  contactPhone?: string;
}

// Get Posts DTO
export interface GetPostsByUserIdDto {
  userId: string;
}
