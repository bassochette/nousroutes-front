import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/apollo'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:5000/graphql' // in real app load from env var or a config vault
      }
    },
  },
})
