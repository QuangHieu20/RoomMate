/**
 * Global enum types for the application
 * These enums are shared across the entire application
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
