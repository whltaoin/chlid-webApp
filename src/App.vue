<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from './stores/userStore';
import { Tabbar, TabbarItem } from 'vant';
import { showToast } from 'vant';

// 初始化路由和状态管理
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 响应式数据
const isNavOpen = ref<boolean>(false); // 默认关闭，点击汉堡菜单打开
const activeTab = ref<string>('home'); // 底部导航栏当前选中项

// 切换导航菜单显示状态
const toggleNav = () => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    // 未登录时显示提示信息
    showToast('请先登录后再访问功能');
    return;
  }
  
  isNavOpen.value = !isNavOpen.value;
};

// 点击页面其他区域关闭菜单
const closeNavOnClickOutside = (event: MouseEvent) => {
  const navMenu = document.querySelector('.nav-menu');
  const menuIcon = document.querySelector('.menu-icon');
  
  // 如果点击的不是导航菜单或菜单图标，且菜单是打开的，则关闭菜单
  if (navMenu && menuIcon && 
      !navMenu.contains(event.target as Node) && 
      !menuIcon.contains(event.target as Node) && 
      isNavOpen.value) {
    isNavOpen.value = false;
  }
};

// 处理导航项点击
const handleNavItemClick = (routeName: string) => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    // 未登录时显示提示信息
    showToast('请先登录后再访问功能');
    // 关闭菜单
    isNavOpen.value = false;
    return;
  }
  
  // 已登录时正常导航
  router.push({ name: routeName });
  isNavOpen.value = false; // 点击后关闭菜单
};

// 组件挂载后执行
onMounted(() => {
  document.addEventListener('click', closeNavOnClickOutside);
});

// 组件卸载前移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeNavOnClickOutside);
});
</script>

<template>
    <div class="app-container">
      <!-- 顶部导航栏 - 只在非登录页面和非班级详情页面显示 -->
      <header v-if="route.name !== 'login' && route.name !== 'classDetail'" class="top-nav">
        <!-- 汉堡菜单按钮 -->
        <div class="menu-icon" @click.stop="toggleNav">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </header>
      
      <!-- 导航菜单内容 - 根据用户角色显示可访问的菜单项 -->
      <div v-if="isNavOpen" class="nav-menu">
        <!-- 教师角色可访问的菜单项 -->
        <div v-if="userStore.isTeacher" class="nav-item" @click="handleNavItemClick('checkIn')">
          <span>📋 入离园管理</span>
        </div>
        <div v-if="userStore.isTeacher" class="nav-item" @click="handleNavItemClick('dangerBehaviors')">
          <span>⚠️ 危险行为提醒</span>
        </div>
        
        <!-- 家长角色可访问的菜单项 -->
        <div v-if="userStore.isParent" class="nav-item" @click="handleNavItemClick('safetyOverview')">
          <span>🛡️ 安全动态总览</span>
        </div>
        <div v-if="userStore.isParent" class="nav-item" @click="handleNavItemClick('temporaryPickup')">
          <span>📋 临时接送</span>
        </div>
        
        <!-- 验收小组可访问的菜单项 -->
        <div v-if="userStore.isInspectionTeam" class="nav-item" @click="handleNavItemClick('expiryWarning')">
          <span>⚠️ 预警信息</span>
        </div>
        <div v-if="userStore.isInspectionTeam" class="nav-item" @click="handleNavItemClick('itemEntry')">
          <span>📋 物品录入</span>
        </div>
      </div>
      
      <!-- 导航遮罩层 -->
      <div v-if="isNavOpen" class="nav-overlay" @click="isNavOpen = false"></div>
      
      <!-- 内容包装器 -->
      <div class="content-wrapper">
        <!-- 使用router-view显示当前路由对应的组件 -->
        <router-view />
      </div>
      
      <!-- 底部导航栏 - 只在非登录页面和非班级详情页面显示 -->
      <div v-if="route.name !== 'login' && route.name !== 'classDetail'">
        <van-tabbar v-model="activeTab" route>
            <van-tabbar-item name="home" icon="home-o" to="/" title="首页"></van-tabbar-item>
            <van-tabbar-item name="aiAssistant" icon="chat-o" to="/ai-assistant" title="AI助手"></van-tabbar-item>
            <van-tabbar-item name="profile" icon="user-o" to="/profile" title="个人中心"></van-tabbar-item>
          </van-tabbar>
      </div>
    </div>
</template>

<style scoped>
/* 移除全局文本强制颜色，使用CSS变量确保样式一致性 */
:deep(*) {
  color: var(--text-color) !important;
}

/* 特殊元素颜色设置 */
:deep(.van-tabbar-item--active),
:deep(.van-tabbar-item--active .van-icon),
.nav-text,
.bottom-nav .active .nav-text {
  color: var(--primary-color) !important;
}

.kindergarten-name,
.kindergarten-slogan {
  color: white !important;
}

/* 自定义vant底部导航栏样式 */
:deep(.van-tabbar-item--active) {
  color: var(--primary-color) !important;
}

:deep(.van-tabbar-item__icon) {
  font-size: 24px;
  transition: transform var(--transition-fast);
}

:deep(.van-tabbar-item--active .van-tabbar-item__icon) {
  transform: scale(1.1);
}

:deep(.van-tabbar) {
  height: 60px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  background-color: var(--card-background) !important;
  border-top: 1px solid var(--border-color);
}

:deep(.van-tabbar-item__text) {
  font-size: 12px;
  font-weight: 500;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: inherit;
  background-color: var(--background-color);
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

/* 顶部导航栏样式 - 增强童真风格 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  transition: all var(--transition-normal);
}

/* 顶部导航栏滚动效果 */
.top-nav.scrolled {
  height: 56px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 汉堡菜单图标样式 - 更有趣的动画效果 */
.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  cursor: pointer;
  z-index: 101;
  padding: 2px;
  transition: transform var(--transition-fast);
}

.menu-icon:hover {
  transform: scale(1.1);
}

.bar {
  width: 28px;
  height: 3px;
  background-color: #ffffff;
  border-radius: 5px;
  transition: all var(--transition-normal);
  position: relative;
}

/* 汉堡菜单动画状态 */
.menu-icon.open .bar:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-icon.open .bar:nth-child(2) {
  opacity: 0;
}

.menu-icon.open .bar:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* 导航菜单样式 - 优化外观和动画 */
.nav-menu {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: var(--card-background);
  z-index: 99;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 12px 8px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  animation: slideDown var(--transition-normal) ease-out;
}

/* 导航菜单动画 */
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 移除重复的导航项样式 */

/* 内容包装器样式 - 优化布局和滚动体验 */
.content-wrapper {
  padding-top: 60px; /* 为顶部导航栏留出空间 */
  padding-bottom: 120px; /* 为底部导航栏留出空间 */
  min-height: 100vh;
  background-color: var(--background-color);
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/* 优化导航遮罩层样式 - 移除重复定义 */

/* 优化导航菜单项样式 - 增强互动效果 */
.nav-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  transition: var(--transition-normal);
  border-radius: var(--border-radius-lg);
  margin: 6px 12px;
  position: relative;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  font-size: 16px;
  font-weight: 500;
}

.nav-item:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);
  border-color: var(--primary-light);
}

.nav-item:active {
  background-color: var(--primary-light);
  transform: translateY(0) scale(0.99);
}

/* 导航项点击波纹效果 */
.nav-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.nav-item:active::after {
  width: 300px;
  height: 300px;
}

.nav-icon {
  font-size: 24px;
  margin-right: 16px;
  width: 28px;
  text-align: center;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

.nav-text {
  font-size: 16px;
  color: var(--text-color);
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航遮罩层 - 增强视觉效果 */
.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.2), rgba(132, 204, 22, 0.08));
  z-index: 98;
  animation: fadeIn var(--transition-normal) ease;
  backdrop-filter: blur(5px);
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1;
    backdrop-filter: blur(5px);
  }
}

/* 内容包装器 - 移除重复定义 */

/* 确保页面背景始终为浅色 */
.home-page, .ai-page, .profile-page {
  background-color: var(--background-color) !important;
}

/* 简单页面标题样式 - 优化外观 */
.simple-page-title {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin: 24px 16px;
  padding: 20px 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-fun);
  position: relative;
  overflow: hidden;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

/* 标题装饰效果 */
.simple-page-title::before {
  content: '🌈';
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  animation: bounce 2s infinite;
}

.simple-page-title::after {
  content: '🌟';
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  animation: float 3s infinite;
}

/* 个人中心样式 - 增强视觉效果 */
.profile-info {
  display: flex;
  align-items: center;
  padding: 24px;
  margin: 20px 16px;
  background-color: var(--background-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 3px solid var(--primary-light);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.profile-info:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* 个人信息卡片装饰 */
.profile-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.avatar {
  font-size: 72px;
  margin-right: 24px;
  background-color: white;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: var(--transition-normal);
  border: 4px solid var(--primary-light);
}

.avatar:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.user-basic-info {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.user-id {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 确保所有卡片和容器都有浅色背景 */
.kindergarten-info, .features-section {
  background-color: var(--background-color) !important;
}

.content-wrapper::-webkit-scrollbar {
  width: 4px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
  border-radius: 10px;
}

/* 首页样式 - 优化童真风格布局 */
.home-page {
  padding: 0;
  margin-top: 0;
  background-color: var(--background-color);
}

/* 头部区域 - 增强绿色童真风格渐变背景 */
.kindergarten-header {
  position: relative;
  text-align: center;
  color: white;
  height: 260px;
  overflow: hidden;
  border-bottom-left-radius: 36px;
  border-bottom-right-radius: 36px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  overflow: hidden;
}

/* 增强童真风格云朵装饰 */
.header-bg::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  width: 70px;
  height: 45px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 25px;
  box-shadow: 
    100px 25px 0 0 rgba(255, 255, 255, 0.25),
    50px 35px 0 0 rgba(255, 255, 255, 0.25),
    150px 45px 0 0 rgba(255, 255, 255, 0.25);
  animation: float 12s ease-in-out infinite;
}

/* 童真风格太阳效果 */
.header-bg::after {
  content: '☀️';
  position: absolute;
  bottom: 30px;
  right: 30px;
  font-size: 50px;
  animation: spin 25s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 添加更多装饰元素 */
.header-bg .cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.header-bg .cloud:nth-child(1) {
  top: 60px;
  left: 15%;
  width: 40px;
  height: 30px;
  animation: float 8s ease-in-out infinite 1s;
}

.header-bg .cloud:nth-child(2) {
  top: 100px;
  right: 20%;
  width: 50px;
  height: 35px;
  animation: float 9s ease-in-out infinite 0.5s;
}

.kindergarten-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 800;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  margin: 0;
  letter-spacing: 0.8px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 24px;
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  /* 添加可爱的装饰性星星 */
  text-decoration: none;
}

.kindergarten-name::before,
.kindergarten-name::after {
  content: '⭐';
  font-size: 20px;
  margin: 0 8px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.kindergarten-slogan {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
  font-weight: 500;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 15px;
  backdrop-filter: blur(3px);
}

/* 信息卡片 - 优化童真风格设计 */
.kindergarten-info, .features-section {
  padding: 28px;
  background-color: var(--background-color);
  margin-bottom: 24px;
  border-radius: var(--border-radius-lg);
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 24px;
  box-shadow: var(--shadow-md);
  border: 3px solid var(--primary-light);
  position: relative;
  overflow: hidden;
  transition: var(--transition-normal);
  z-index: 1;
  background-image: 
    url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z' fill='%2384cc16' fill-opacity='0.2'/%3E%3Cpath d='M8 8C9.1 8 10 8.9 10 10C10 11.1 9.1 12 8 12C6.9 12 6 11.1 6 10C6 8.9 6.9 8 8 8Z' fill='%2384cc16' fill-opacity='0.2'/%3E%3Cpath d='M16 8C17.1 8 18 8.9 18 10C18 11.1 17.1 12 16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8Z' fill='%2384cc16' fill-opacity='0.2'/%3E%3C/svg%3E");
  background-size: 50px 50px;
}

.kindergarten-info:hover, .features-section:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* 卡片装饰元素 */
.kindergarten-info::after, .features-section::after {
  content: '';
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.kindergarten-info::before, .features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
}

/* 标题样式 - 优化童真风格 */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 24px;
  position: relative;
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.section-title::before {
  content: '✨';
  font-size: 22px;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1) rotate(10deg); }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .kindergarten-header {
    height: 220px;
  }
  
  .simple-page-title {
    font-size: 22px;
    padding: 16px;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }
}

/* 确保平滑滚动 */
.content-wrapper {
  scroll-behavior: smooth;
}

/* 优化按钮在应用中的显示 */
:deep(.van-button) {
  border-radius: var(--border-radius) !important;
  transition: var(--transition-normal) !important;
}

:deep(.van-button--primary) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-light) !important;
}

:deep(.van-button--primary:hover) {
  background-color: var(--primary-dark) !important;
}

/* 优化输入框样式 */
:deep(.van-field__control) {
  font-size: 16px;
  color: var(--text-color);
}

/* 优化卡片样式 */
:deep(.van-card) {
  border-radius: var(--border-radius) !important;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

:deep(.van-card:hover) {
  box-shadow: var(--shadow-md);
}

.section-title::after {
  content: '';
  flex-grow: 1;
  height: 2px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color), transparent);
  margin-left: 12px;
  opacity: 0.5;
}

.info-content p {
  color: #1f2937;
  line-height: 1.7;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  background-color: white;
  padding: 12px 16px;
  border-radius: 16px;
  border-left: 4px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 特色课程网格布局 */
.features-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 特色课程项 - 增强童真风格卡片 */
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background-color: white; /* 白色背景更符合童真风格 */
  border-radius: 24px;
  transition: var(--transition-normal);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.15);
  border: 3px solid var(--primary-light);
  position: relative;
  overflow: hidden;
  transform: perspective(1000px) rotateX(5deg);
  /* 添加可爱的云朵图案装饰 */
  background-image: 
    url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%2322c55e' fill-opacity='0.2'/%3E%3C/svg%3E");
  /* 设置固定高度确保所有模块一致 */
  height: 200px;
  justify-content: space-between;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.feature-item:hover {
  transform: perspective(1000px) rotateX(0deg) translateY(-5px);
  box-shadow: 0 10px 24px rgba(34, 197, 94, 0.15);
}

.feature-item:active {
  transform: perspective(1000px) rotateX(0deg) translateY(0);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
}

.feature-item:active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(34, 197, 94, 0.08);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
  filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.15));
  transform: scale(1);
  transition: transform 0.3s ease, rotate 0.3s ease;
  background-color: white;
  border-radius: 50%;
  padding: 10px;
  border: 3px dashed var(--primary-color);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  /* 确保图标区域大小一致 */
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-item:hover .feature-icon {
  transform: scale(1.2);
  rotate: 10deg;
  animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: scale(1.2) rotate(0deg); }
  25% { transform: scale(1.2) rotate(-5deg); }
  50% { transform: scale(1.2) rotate(5deg); }
  75% { transform: scale(1.2) rotate(-5deg); }
}

.feature-text {
  font-size: 16px;
  color: #1e3a8a; /* 深蓝色确保在浅色背景上清晰可见 */
  font-weight: 600;
  text-align: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--primary-light);
  /* 确保文本区域大小一致 */
  width: 100%;
  margin: 0;
}

/* 其他页面样式 */
.ai-page, .profile-page {
  padding: 24px;
  text-align: center;
  min-height: 100%;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 20px;
}

.page-description {
  color: var(--text-color-secondary);
  line-height: 1.7;
  font-size: 14px;
}

/* 底部导航栏样式调整 - 童真风格 */
:deep(.van-tabbar) {
  background-color: white;
  box-shadow: 0 -4px 20px rgba(34, 197, 94, 0.1);
  border-top: 2px solid var(--primary-light);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-top: 8px;
  padding-bottom: env(safe-area-inset-bottom, 8px);
}

:deep(.van-tabbar-item--active) {
  color: var(--primary-color) !important;
}

/* 底部导航栏激活图标渐变效果 - 童真风格 */
:deep(.van-tabbar-item--active .van-icon) {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* 保留登录按钮样式，因为在个人中心页面仍会使用 */
.login-button {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 已登录状态下在个人中心显示登出按钮 */
.logout-button {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.logout-button:active {
  transform: translateY(0);
}

/* 登录提示样式 */
.login-prompt {
  text-align: center;
  padding: 40px 20px;
  background-color: #f0fdf4;
  margin: 20px 16px;
  border-radius: 20px;
  border: 2px dashed var(--primary-light);
}

.login-prompt p {
  font-size: 16px;
  color: var(--text-color);
  margin: 0;
}
  </style>
