import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home.vue'
import user from '@/views/user.vue'
import userImport from '@/views/userimport.vue'
import course from '@/views/course.vue'
import courseImport from '@/views/courseimport.vue'
import file from '@/views/file.vue'
import ucmap from '@/views/ucmap.vue'

Vue.use(Router)

export default new Router({
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
    },
    {
      path: '/course',
      name: 'course',
      component: course
    },
    {
      path: '/course/import',
      name: 'courseImport',
      component: courseImport
    },
    {
      path: '/file',
      name: 'file',
      component: file
    },
    {
      path: '/ucmap',
      name: 'ucmap',
      component: ucmap
    }
  ]
})
