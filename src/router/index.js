import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'ProvinceDashboard',
    component: () => import('../views/ProvinceDashboard.vue'),
    meta: { title: '贵州省旅游数智互联平台暨旅游驾驶舱' },
  },
  {
    path: '/city/:code',
    name: 'CityDashboard',
    component: () => import('../views/CityDashboard.vue'),
    meta: { title: '市州文旅数据大屏' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '贵州省旅游数智互联平台暨旅游驾驶舱'
  next()
})

export default router
