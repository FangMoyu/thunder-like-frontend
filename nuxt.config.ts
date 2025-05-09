// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  css: ['~/assets/scss/main.scss'],
  build: {
    transpile: ['element-plus/es'],
  },
  app: {
    head: {
      title: '博客点赞系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '使用Nuxt.js和Element Plus构建的博客点赞系统' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8081/api'
    }
  }
}) 