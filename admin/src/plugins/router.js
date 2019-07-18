import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home.vue'
import user from '@/views/user.vue'
import userImport from '@/views/userimport.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/user/import',
      name: 'userImport',
      component: userImport
    }
  ]
})
