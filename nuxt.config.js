require('dotenv').config()
export default {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons' }
    ]
  },

  loading: { color: '#9ccc65', height: '3px' },

  css: [
    { src: 'vue-material/dist/vue-material.min.css', lang: 'css' },
    { src: '@/assets/theme.scss', lang: 'scss' }
  ],

  plugins: [
    '@/plugins/firestore.js',
    '@/plugins/vue-material.js',
    '@/plugins/axios.js',
    '@/plugins/date-format'
  ],
  axios: {
    credentials: true,
    proxy: true
  },
  // https://newsapi.org/v2/top-headlines?country="jp"
  proxy: {
    '/api/': {
      target: 'https://newsapi.org/v2/',
      pathRewrite: { '^/api/': '' }
    }
  },

  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/dotenv'
  ],

  build: {

    extend (config, ctx) {
    }
  }
}
