import { createRouter, createWebHashHistory } from 'vue-router'

const routerHistory = createWebHashHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      redirect: '/workflow'
    },
    {
      path: '/workflow',
      component: () => import('../views/workflow/index.vue')
    }
  ]
})

export default router
