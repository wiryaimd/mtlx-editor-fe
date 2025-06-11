// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      api: {
        base: "http://localhost:8080/api"
      }
    }
  },

  modules: ["@pinia/nuxt"]
})