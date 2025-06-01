import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100, // Optional: tweak polling frequency
      },
      hmr: {
        host: 'localhost', // or use your Windows IP
        port: 24678,        // consistent HMR port (optional)
      }
    },
    plugins: [
      tailwindcss()
    ]
  },
  tailwindcss: {
    config: "./tailwind.config.ts"
  }
})