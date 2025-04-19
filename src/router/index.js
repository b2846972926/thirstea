import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: 'products',
          component: () => import('../views/ProductsView.vue'),
        },
        {
          path: 'orders',
          component: () => import('../views/OrdersView.vue'),
        },
        {
          path: 'coupons',
          component: () => import('../views/CouponsView.vue'),
        },
      ],
    },
    {
      path: '/user',
      component: () => import('../views/UserboardView.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/UserHome.vue'),
        },
        {
          path: 'cart',
          component: () => import('../views/UserCart.vue'),
        },
        {
          path: 'products',
          component: () => import('../views/UserProducts.vue'),
        },
        {
          path: 'products/:productId',
          component: () => import('../views/UserProductDetail.vue'),
        },
        {
          path: 'checkout/:orderId',
          component: () => import('../views/UserCheckout.vue'),
        },
        {
          path: 'aboutus',
          component: () => import('../views/UserAboutUs.vue'),
        },
      ],
    },
  ],
})

export default router
