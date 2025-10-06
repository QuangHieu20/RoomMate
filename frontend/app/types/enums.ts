/**
 * Frontend enum types - sync with backend enums
 * These enums are shared across the frontend application
 */

export enum PostStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  RENTED = 'rented',
}

export enum PostType {
  FOR_RENT = 'for_rent',
  LOOKING_FOR = 'looking_for',
}

export enum PriceType {
  MONTHLY = 'monthly',
  DAILY = 'daily',
}

export enum RoomType {
  SINGLE_ROOM = 'single_room',
  SHARED_ROOM = 'shared_room',
  APARTMENT = 'apartment',
  HOUSE = 'house',
  STUDIO = 'studio',
}

export enum GenderRequirement {
  MALE = 'male',
  FEMALE = 'female',
  ANY = 'any',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export enum UserRole {
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  LOCATION = 'location',
  CONTACT = 'contact',
}

/**
 * Type definitions for better type safety
 */
export type PostStatusType = keyof typeof PostStatus;
export type PostTypeType = keyof typeof PostType;
export type PriceTypeType = keyof typeof PriceType;
export type RoomTypeType = keyof typeof RoomType;
export type GenderRequirementType = keyof typeof GenderRequirement;
export type UserStatusType = keyof typeof UserStatus;
export type UserRoleType = keyof typeof UserRole;
export type MessageTypeType = keyof typeof MessageType;

/**
 * Helper functions for enum usage
 */
export const getRoomTypeLabel = (roomType: RoomType): string => {
  const labels: Record<RoomType, string> = {
    [RoomType.SINGLE_ROOM]: 'Phòng đơn',
    [RoomType.SHARED_ROOM]: 'Phòng chung',
    [RoomType.APARTMENT]: 'Căn hộ',
    [RoomType.HOUSE]: 'Nhà riêng',
    [RoomType.STUDIO]: 'Studio',
  };
  return labels[roomType] || roomType;
};

export const getGenderRequirementLabel = (
  gender: GenderRequirement
): string => {
  const labels: Record<GenderRequirement, string> = {
    [GenderRequirement.MALE]: 'Nam',
    [GenderRequirement.FEMALE]: 'Nữ',
    [GenderRequirement.ANY]: 'Bất kỳ',
  };
  return labels[gender] || gender;
};

export const getPriceTypeLabel = (priceType: PriceType): string => {
  const labels: Record<PriceType, string> = {
    [PriceType.MONTHLY]: 'Tháng',
    [PriceType.DAILY]: 'Ngày',
  };
  return labels[priceType] || priceType;
};

export const getPostTypeLabel = (postType: PostType): string => {
  const labels: Record<PostType, string> = {
    [PostType.FOR_RENT]: 'Cho thuê',
    [PostType.LOOKING_FOR]: 'Tìm phòng',
  };
  return labels[postType] || postType;
};

/**
 * Enum options for form selects
 */
export const roomTypeOptions = [
  {
    value: RoomType.SINGLE_ROOM,
    label: getRoomTypeLabel(RoomType.SINGLE_ROOM),
  },
  {
    value: RoomType.SHARED_ROOM,
    label: getRoomTypeLabel(RoomType.SHARED_ROOM),
  },
  { value: RoomType.APARTMENT, label: getRoomTypeLabel(RoomType.APARTMENT) },
  { value: RoomType.HOUSE, label: getRoomTypeLabel(RoomType.HOUSE) },
  { value: RoomType.STUDIO, label: getRoomTypeLabel(RoomType.STUDIO) },
];

export const priceTypeOptions = [
  { value: PriceType.MONTHLY, label: getPriceTypeLabel(PriceType.MONTHLY) },
  { value: PriceType.DAILY, label: getPriceTypeLabel(PriceType.DAILY) },
];

export const genderRequirementOptions = [
  {
    value: GenderRequirement.ANY,
    label: getGenderRequirementLabel(GenderRequirement.ANY),
  },
  {
    value: GenderRequirement.MALE,
    label: getGenderRequirementLabel(GenderRequirement.MALE),
  },
  {
    value: GenderRequirement.FEMALE,
    label: getGenderRequirementLabel(GenderRequirement.FEMALE),
  },
];

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  // UI Constants
  SIDEBAR_WIDTH: 'w-80',
  AVATAR_SIZE: 'w-20',
  ICON_SIZE: 'h-[38.5px]',
  TOAST_DURATION: 3000,
  NOTIFICATION_BADGE_COUNT: 99,
  
  // Form Defaults
  DEFAULT_MAX_OCCUPANTS: 2,
  DEFAULT_MAX_OCCUPANTS_SINGLE: 1,
  DEFAULT_FILE_EXTENSION: 'jpg',
  DEFAULT_USER_NAME: 'Người dùng',
  
  // Colors
  BACKGROUND_LIGHT: '#F8F8F8',
  BORDER_RADIUS: '8px',
  PRIMARY_COLOR: 'cyan-500',
  
  // Default User Data (for development)
  DEFAULT_USER: {
    FULL_NAME: 'Room Mate User',
    EMAIL: 'roommate@gmail.com',
    PHONE: '0899999999',
  },
} as const;

/**
 * Default form values
 */
export const DEFAULT_FORM_VALUES = {
  GENDER_REQUIREMENT: GenderRequirement.ANY,
  PRICE_TYPE: PriceType.MONTHLY,
  ROOM_TYPE: RoomType.SINGLE_ROOM,
  MAX_OCCUPANTS: APP_CONSTANTS.DEFAULT_MAX_OCCUPANTS,
  MAX_OCCUPANTS_SINGLE: APP_CONSTANTS.DEFAULT_MAX_OCCUPANTS_SINGLE,
  AVAILABLE_FROM: () => new Date().toISOString().split('T')[0],
} as const;
