import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import SafetyOverviewPage from '../views/SafetyOverviewPage.vue';
import TemporaryPickupPage from '../views/TemporaryPickupPage.vue';
import ExpiryWarningPage from '../views/ExpiryWarningPage.vue';

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
  // 入离园管理 - 教师可访问
  { 
    path: '/check-in', 
    name: 'checkIn', 
    component: () => import('../views/CheckInPage.vue'), 
    meta: { 
      requiresAuth: true, 
      roles: ['teacher', '教师'] // 仅限教师访问
    } 
  },
  // 危险行为预警 - 教师可访问
  { 
    path: '/danger-behaviors', 
    name: 'dangerBehaviors', 
    component: () => import('../views/DangerBehaviorPage.vue'), 
    meta: { 
      requiresAuth: true, 
      roles: ['teacher', '教师'] // 仅限教师访问
    } 
  },
  // 安全动态总览 - 家长可访问
  { 
    path: '/safety-overview', 
    name: 'safetyOverview', 
    component: SafetyOverviewPage, 
    meta: { 
      requiresAuth: true, 
      roles: ['parent', '家长'] // 仅限家长访问
    } 
  },
  // 临时接送 - 家长可访问
  { 
    path: '/temporary-pickup', 
    name: 'temporaryPickup', 
    component: TemporaryPickupPage, 
    meta: { 
      requiresAuth: true, 
      roles: ['parent', '家长'] // 仅限家长访问
    } 
  },
  // 预警信息 - 验收小组可访问
  { 
    path: '/expiry-warning', 
    name: 'expiryWarning', 
    component: ExpiryWarningPage, 
    meta: { 
      requiresAuth: true, 
      roles: ['inspection', '验收小组'] // 仅限验收小组访问
    } 
  },
  // 物品录入页面 - 验收小组可访问
  { 
    path: '/item-entry', 
    name: 'itemEntry', 
    component: () => import('../views/ItemEntryPage.vue'), 
    meta: { 
      requiresAuth: true, 
      roles: ['inspection', '验收小组'] // 仅限验收小组访问
    } 
  },
  // AI助手页面 - 所有角色都可访问
  {
    path: '/ai-assistant',
    name: 'aiAssistant',
    component: () => import('../views/AIAssistantPage.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['teacher', '教师', 'parent', '家长', 'inspection', '验收小组'] // 所有角色都可访问
    }
  },
  // 班级详情页面 - 所有角色都可访问
  { 
    path: '/class/:id', 
    name: 'classDetail', 
    component: () => import('../views/ClassDetailPage.vue'), 
    meta: { 
      requiresAuth: true,
      roles: ['teacher', '教师', 'parent', '家长', 'inspection', '验收小组'] // 所有角色都可访问
    } 
  },
  // 个人资料页面 - 所有角色都可访问
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['teacher', '教师', 'parent', '家长', 'inspection', '验收小组'] // 所有角色都可访问
    }
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
router.beforeEach((to, _from, next) => {
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
  
  // 检查用户角色是否有权限访问该页面
  if (to.meta?.requiresAuth && to.meta?.roles) {
    const userRole = userStore.user?.role;
    // 检查用户角色是否在允许的角色列表中
    if (!userRole || !Array.isArray(to.meta.roles) || !to.meta.roles.includes(userRole)) {
      // 无权限访问，重定向到首页
      next({ name: 'home' });
      return;
    }
  }
  
  // 默认允许访问
  next();
});

export default router;