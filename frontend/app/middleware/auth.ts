import { getLocalStorage } from '~/ultils/localStorage';

export default defineNuxtRouteMiddleware(async to => {
  // Chỉ check auth trên client
  if (process.client) {
    try {
      const user = getLocalStorage('userInfo');

      // Nếu chưa login thì đá về login
      if (!user || !user.id) {
        return navigateTo('/login');
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return navigateTo('/login');
    }
  } else {
    // Trên server-side, cho phép truy cập (sẽ được check lại trên client)
  }
});
