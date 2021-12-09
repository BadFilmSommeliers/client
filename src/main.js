import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import vuetify from './plugins/vuetify'
import CommonMethodsPlugin from './plugins/CommonMethodsPlugin'

Vue.config.productionTip = false
Vue.use(CommonMethodsPlugin)

Vue.prototype.$serverURL = process.env.VUE_APP_SERVER_URL
Vue.prototype.$API_KEY = process.env.VUE_APP_TMDB_API_KEY

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
