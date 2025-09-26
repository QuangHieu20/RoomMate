module.exports = {
  content: [
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
  plugins: [require("daisyui")],
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
