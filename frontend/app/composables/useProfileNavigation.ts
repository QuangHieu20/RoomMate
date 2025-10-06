/**
 * Composable for profile page navigation
 * Handles tab navigation with query parameters
 */

export const useProfileNavigation = () => {
  const route = useRoute();
  const router = useRouter();

  /**
   * Get initial tab from query parameters
   */
  const getInitialTab = (): { activeTab: string; createPostTab?: string } => {
    const tabParam = route.query.tab as string;
    const createTabParam = route.query.createTab as string;

    return {
      activeTab: tabParam || 'newsfeed',
      createPostTab: createTabParam,
    };
  };

  /**
   * Navigate to profile with specific tab
   */
  const navigateToProfile = (tab: string, createTab?: string) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (createTab) {
      params.set('createTab', createTab);
    }

    router.push(`/profile?${params.toString()}`);
  };

  /**
   * Clean up URL after navigation
   */
  const cleanUrl = () => {
    router.replace({ path: '/profile' });
  };

  /**
   * Check if current tab is active
   */
  const isTabActive = (tab: string) => {
    return route.query.tab === tab;
  };

  return {
    getInitialTab,
    navigateToProfile,
    cleanUrl,
    isTabActive,
  };
};
