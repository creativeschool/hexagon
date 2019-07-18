import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import App from './app.vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
