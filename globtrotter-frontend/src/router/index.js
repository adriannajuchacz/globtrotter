import Vue from 'vue'
import Router from 'vue-router'
import Europe from '@/components/Europe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Europe',
      component: Europe
    }
  ]
})
