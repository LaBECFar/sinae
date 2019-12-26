import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // LOCATION ROUTES    
    {
      path: '/experimento',
      name: 'experimentoIndex',
      component: () => import(/* webpackChunkName: "locationIndex" */ './views/experimento/Index.vue')
    },
    {
      path: '/experimento/novo',
      name: 'locationNovo',
      component: () => import(/* webpackChunkName: "locationNew" */ './views/experimento/Novo.vue')
    },
    {
      path: '/experimento/:id/editar',
      name: 'experimentoEditar',
      component: () => import(/* webpackChunkName: "locationEdit" */ './views/experimento/Editar.vue')
    },
    {
      path: '/experimento/:experimentoCodigo/analises',
      name: 'analiseIndex',
      component: () => import(/* webpackChunkName: "analiseIndex" */ './views/analise/Index.vue')
    }
  ]
})
