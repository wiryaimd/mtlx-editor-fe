// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  srcDir: 'src/',

  runtimeConfig: {
    public: {
      api: {
        base: "http://localhost:8080/api"
      }
    }
  },
  css: ['@/assets/css/fonts.css'],
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"]
})