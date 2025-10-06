module.exports = {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Fira Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        'light': '#FAFAFB',
        'primary': '#FAFAFB',
        'surface': '#FAFAFB',
        'border-light': '#EAEAEA',
      },
    },
  },
  // Tối ưu hóa: chỉ giữ lại những theme cần thiết
  daisyui: {
    themes: ["light", "dark", "cupcake", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"],
    // Tối ưu hóa DaisyUI
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false, // Tắt logs để giảm noise
    themeRoot: ":root",
  },
  plugins: [
    require("daisyui"),
    function({ addUtilities }) {
      const newUtilities = {
        // Title classes
        '.title-xl': {
          '@apply text-3xl font-bold text-cyan-500': {},
        },
        '.title-lg': {
          '@apply text-2xl font-semibold text-cyan-500': {},
        },
        '.title-md': {
          '@apply text-xl font-semibold text-cyan-500': {},
        },
        '.title-sm': {
          '@apply text-lg font-semibold text-cyan-500': {},
        },
        '.title': {
          '@apply text-cyan-500': {},
        },
        
        // Button text classes
        '.btn-text': {
          '@apply text-black': {},
        },
        '.btn-text-secondary': {
          '@apply text-gray-600': {},
        },
        '.btn-text-white': {
          '@apply text-white': {},
        },
        
        // Common combinations
        '.card-title': {
          '@apply title-sm mb-4': {},
        },
        '.page-title': {
          '@apply title-lg mb-6': {},
        },
        '.section-title': {
          '@apply title-md mb-4': {},
        },
        '.form-label': {
          '@apply text-black font-medium': {},
        },
        '.error-text': {
          '@apply text-red-600 text-sm': {},
        },
      }
      addUtilities(newUtilities)
    }
  ],
  // Tối ưu hóa: chỉ giữ lại những core plugins cần thiết
  corePlugins: {
    preflight: true,
    container: false, // Không cần container utility
    accessibility: true,
    pointerEvents: true,
    visibility: true,
    position: true,
    inset: true,
    isolation: true,
    zIndex: true,
    order: true,
    gridColumn: true,
    gridColumnStart: true,
    gridColumnEnd: true,
    gridRow: true,
    gridRowStart: true,
    gridRowEnd: true,
    float: true,
    clear: true,
    objectFit: true,
    objectPosition: true,
    overflow: true,
    overscrollBehavior: true,
  }
}
