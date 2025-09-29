// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    devServer: {
        port: 3001
    },

    ssr: true,

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://roommate.id.vn'
        }
    },

    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/assets/images/favicon.svg' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
            ]
        }
    },

    modules: [
        '@nuxtjs/tailwindcss'
    ],
    alias: {
        '@': '<rootDir>',
        '@assets': '<rootDir>/assets',
        '@components': '<rootDir>/components',
        '@modules': '<rootDir>/src/modules',
        '@utils': '<rootDir>/utils',
        '@public': '<rootDir>/public'
    },
    
    vite: {
        assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    }
})
