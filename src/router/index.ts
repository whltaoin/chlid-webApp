import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/ai-assistant',
    name: 'aiAssistant',
    component: () => import('../views/AIAssistantPage.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/check-in', name: 'checkIn', component: () => import('../views/CheckInPage.vue'), meta: { requiresAuth: true } },
  { path: '/class/:id', name: 'classDetail', component: () => import('../views/ClassDetailPage.vue'), meta: { requiresAuth: true } },
  { path: '/danger-behaviors', name: 'dangerBehaviors', component: () => import('../views/DangerBehaviorPage.vue'), meta: { requiresAuth: true } },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  // 404 页面重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 创建用户store实例
  const userStore = useUserStore();
  
  // 如果已经登录，并且尝试访问登录页，则重定向到首页
  if (to.name === 'login' && userStore.isLoggedIn) {
    next({ name: 'home' });
    return;
  }
  
  // 检查页面是否需要登录
  if (to.meta?.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login' });
    return;
  }
  
  // 默认允许访问
  next();
});

export default router;