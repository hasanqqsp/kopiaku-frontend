import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/photoverification',
      component: () => import('@/pages/PhotoVerificationPage.vue'),
    },
    {
      path: '/',
      component: () => import('@/pages/DashboardPage.vue'),
    },
    {
      path: '/stock',
      component: () => import('@/pages/StockPage.vue'),
    },
    {
      path: '/transaction',
      component: () => import('@/pages/TransactionPage.vue'),
    },
    {
      path: '/cashier',
      component: () => import('@/pages/CashierPage.vue'),
    },
    {
      path: '/employee',
      component: () => import('@/pages/EmployeePage.vue'),
    },
    {
      path: '/content',
      component: () => import('@/pages/ContentManagementPage.vue'),
    },
    {
      path: '/recipes',
      component: () => import('@/pages/RecipesPage.vue'),
    },
    {
      path: '/account',
      component: () => import('@/pages/AccountPage.vue'),
    },
  ],
})

export default router
