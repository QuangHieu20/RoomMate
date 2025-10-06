/**
 * LocalStorage utility functions with ROOM_MATE_ prefix
 */

const STORAGE_NAME = 'ROOM_MATE_'

/**
 * Set item to localStorage with ROOM_MATE_ prefix
 * @param key - The key to store the value under
 * @param value - The value to store (will be JSON stringified)
 */
export const setLocalStorage = (key: string, value: any): void => {
  try {
    // Chỉ chạy trên client
    if (!process.client) {
      return
    }
    
    const prefixedKey = `${STORAGE_NAME}${key}`
    const stringValue = JSON.stringify(value)
    localStorage.setItem(prefixedKey, stringValue)
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

/**
 * Get item from localStorage with ROOM_MATE_ prefix
 * @param key - The key to retrieve the value for
 * @returns The parsed value or null if not found
 */
export const getLocalStorage = <T = any>(key: string): T | null => {
  try {
    // Chỉ chạy trên client
    if (!process.client) {
      return null
    }
    
    const prefixedKey = `${STORAGE_NAME}${key}`
    const item = localStorage.getItem(prefixedKey)
    
    if (item === null) {
      return null
    }
    
    return JSON.parse(item) as T
  } catch (error) {
    console.error('Error getting localStorage:', error)
    return null
  }
}

/**
 * Remove item from localStorage with ROOM_MATE_ prefix
 * @param key - The key to remove
 */
export const removeLocalStorage = (key: string): void => {
  try {
    const prefixedKey = `${STORAGE_NAME}${key}`
    localStorage.removeItem(prefixedKey)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}

/**
 * Clear all localStorage items with ROOM_MATE_ prefix
 */
export const clearLocalStorage = (): void => {
  try {
    const keysToRemove: string[] = []
    
    // Find all keys with ROOM_MATE_ prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_NAME)) {
        keysToRemove.push(key)
      }
    }
    
    // Remove all found keys
    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Check if a key exists in localStorage with ROOM_MATE_ prefix
 * @param key - The key to check
 * @returns True if the key exists, false otherwise
 */
export const hasLocalStorage = (key: string): boolean => {
  try {
    const prefixedKey = `${STORAGE_NAME}${key}`
    return localStorage.getItem(prefixedKey) !== null
  } catch (error) {
    console.error('Error checking localStorage:', error)
    return false
  }
}

/**
 * Get all keys that start with ROOM_MATE_ prefix
 * @returns Array of keys (without prefix)
 */
export const getAllLocalStorageKeys = (): string[] => {
  try {
    const keys: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_NAME)) {
        // Remove prefix to return clean key names
        keys.push(key.substring(STORAGE_NAME.length))
      }
    }
    
    return keys
  } catch (error) {
    console.error('Error getting localStorage keys:', error)
    return []
  }
}
