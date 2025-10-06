/**
 * Composable để tạo debounced function
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): T => {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  }) as T;
};

/**
 * Composable để tạo debounced async function
 */
export const useDebounceAsync = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  const isPending = ref(false);

  const debouncedFunc = ((...args: Parameters<T>) => {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout
      timeoutId = setTimeout(async () => {
        try {
          isPending.value = true;
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          isPending.value = false;
        }
      }, delay);
    });
  }) as T;

  return Object.assign(debouncedFunc, { isPending: readonly(isPending) });
};
