// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: true,
  devtools: { enabled: true },
  srcDir: 'src/',
  robots: {
    allow: '/',
    disallow: ''
  },
  turnstile: {
    siteKey: '0x4AAAAAABhVVB-8WU1AaiHT'
  },
  runtimeConfig: {
    public: {
      api: {
        base: "https://mangatlx.com/api"
      }
    }
  },
  css: ['@/assets/css/fonts.css'],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/turnstile",
    "@nuxtjs/robots"
  ]
})