import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/views/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('@/views/user/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('@/views/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('@/views/power/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import('@/views/goods/Cate.vue')
      },
      {
        path: '/params',
        component: () => import('@/views/goods/Params.vue')
      },
      {
        path: '/goods',
        component: () => import('@/views/goods/List.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/views/goods/Add.vue')
      },
      {
        path: '/orders',
        component: () => import('@/views/order/Order.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
