import Vue from 'vue'
import Router from 'vue-router'
import Europe from '@/components/Europe'
import World from '@/components/World'
import 'jquery'; 
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Europe',
      component: Europe
    },
    {
      path: '/world',
      name: 'World',
      component: World
    }
  ]
})
