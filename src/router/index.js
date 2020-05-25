import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/login',
    component: () => import('@/views/index/login.vue'),
    meta: {
      NoAuth: true,
    },
  },
  {
    path: '/index',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/index/output',
    children: [
      {
        path: '/index/output',
        component: () => import('@/views/menu/output.vue'),
      },
      {
        path: '/index/role',
        component: () => import('@/views/menu/role.vue'),
      },
      {
        path: '/index/user',
        component: () => import('@/views/menu/user.vue'),
      },
      {
        path: '/index/userInfo',
        component: () => import('@/views/menu/userInfo.vue'),
      },
      {
        path: '/index/xmMgr',
        component: () => import('@/views/menu/xmMgr.vue'),
      },
      {
        path: '/index/xUser',
        component: () => import('@/views/menu/xUser.vue'),
      },
      {
        path: '/index/turnover',
        component: () => import('@/views/menu/turnover.vue'),
      },
      {
        path: '/index/profit',
        component: () => import('@/views/menu/profit.vue'),
      },
      {
        path: '/index/echarts',
        component: () => import('@/views/menu/echarts.vue'),
      },
      {
        path: '/index/echarts2',
        component: () => import('@/views/menu/echarts2.vue'),
      },
      {
        path: '/index/echarts3',
        component: () => import('@/views/menu/echarts3.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
