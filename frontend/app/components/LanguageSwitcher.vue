<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span>{{ currentLocale?.name || 'Tiếng Việt' }}</span>
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="py-1">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          :class="{
            'bg-blue-50 text-blue-700': locale.code === currentLocale?.code,
          }"
        >
          <span class="text-lg">{{ getFlag(locale.code) }}</span>
          <span>{{ locale.name }}</span>
          <svg
            v-if="locale.code === currentLocale?.code"
            class="w-4 h-4 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

// Safe access to i18n
const { locale, locales, setLocale } = useI18n();

const availableLocales = computed(() => {
  try {
    return locales.value || [];
  } catch {
    return [
      { code: 'vi', name: 'Tiếng Việt' },
      { code: 'en', name: 'English' },
    ];
  }
});

const currentLocale = computed(() => {
  try {
    return (
      availableLocales.value.find(l => l.code === locale.value) ||
      availableLocales.value[0]
    );
  } catch {
    return { code: 'vi', name: 'Tiếng Việt' };
  }
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const switchLocale = async (localeCode: string) => {
  try {
    await setLocale(localeCode as 'vi' | 'en');

    // Update vee-validate locale
    const { setLocale: setVeeValidateLocale } = await import(
      '@vee-validate/i18n'
    );
    setVeeValidateLocale(localeCode);

    isOpen.value = false;
  } catch (error) {
    console.error('Error switching locale:', error);
  }
};

const getFlag = (code: string) => {
  const flags: Record<string, string> = {
    vi: '🇻🇳',
    en: '🇺🇸',
  };
  return flags[code] || '🌐';
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (!target?.closest('.relative')) {
      isOpen.value = false;
    }
  });
});
</script>
