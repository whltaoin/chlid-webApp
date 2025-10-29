<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from './stores/userStore';
import { Tabbar, TabbarItem } from 'vant';

// 初始化路由和状态管理
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 响应式数据
const isNavOpen = ref<boolean>(false); // 默认关闭，点击汉堡菜单打开
const activeTab = ref<string>('home'); // 底部导航栏当前选中项

// 切换导航菜单显示状态
const toggleNav = () => {
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
      
      <!-- 导航菜单内容 - 使用vue-router进行导航 -->
      <div v-if="isNavOpen" class="nav-menu">
        <!-- <div class="nav-item" @click="handleNavItemClick('home')">
          <span>🏠 首页</span>
        </div>
        <div class="nav-item" @click="handleNavItemClick('aiAssistant')">
          <span>🤖 AI助手</span>
        </div> -->
        <div class="nav-item" @click="handleNavItemClick('checkIn')">
          <span>📋 入离园管理</span>
        </div>
        <div class="nav-item" @click="handleNavItemClick('dangerBehaviors')">
          <span>⚠️ 危险行为提醒</span>
        </div>
        <div class="nav-item" @click="handleNavItemClick('safetyOverview')">
          <span>🛡️ 安全动态总览</span>
        </div>
        <div class="nav-item" @click="handleNavItemClick('temporaryPickup')">
          <span>📋 临时接送</span>
        </div>
        <!-- <div class="nav-item" @click="handleNavItemClick('profile')">
          <span>👤 个人中心</span>
        </div> -->
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
/* 全局文本颜色设置 - 提高对比度确保可见性 */
:deep(*) { color: #333333 !important; }

/* 特殊元素颜色保持不变 */
:deep(.van-tabbar-item--active),
:deep(.van-tabbar-item--active .van-icon),
.kindergarten-name,
.kindergarten-slogan,
.nav-text,
.bottom-nav .active .nav-text {
  color: inherit !important;
}

/* 为内容区域添加底部内边距，避免被底部导航栏遮挡 */
.content-wrapper {
  margin-bottom: 60px;
}

/* 自定义vant底部导航栏样式 */
:deep(.van-tabbar-item--active) {
  color: #07c160 !important;
}

:deep(.van-tabbar-item__icon) {
  font-size: 22px;
}

:deep(.van-tabbar) {
  height: 50px;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 顶部导航栏样式 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* 汉堡菜单图标样式 */
.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
  z-index: 101;
}

.bar {
  width: 24px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* 导航菜单样式 */
.nav-menu {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  background-color: #ffffff;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}

/* 导航菜单项样式 */
.nav-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #333;
  transition: background-color 0.3s ease;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

/* 内容包装器样式 */
.content-wrapper {
  padding-top: 56px; /* 为顶部导航栏留出空间 */
  min-height: 100vh;
  background-color: #fafafa;
}

/* 导航遮罩层样式 */
.nav-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

/* 菜单动画 */
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

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  transition: var(--transition-fast);
  border-radius: 16px;
  margin: 4px 12px;
  position: relative;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
}

.nav-item:active {
  background-color: var(--primary-light);
  transform: translateY(0);
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

/* 导航遮罩层 - 童真柔和渐变 */
.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(34, 197, 94, 0.1), rgba(132, 204, 22, 0.05));
  z-index: 98;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(3px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.content-wrapper {
  margin-bottom: 50px;
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff; /* 明确设置为白色背景 */
  position: relative;
  z-index: 1;
  margin-top: 56px;
  scrollbar-width: thin;
  scrollbar-color: rgba(37, 99, 235, 0.3) transparent;
}

/* 确保登录页面占满整个容器 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 确保页面背景始终为浅色 */
.home-page, .ai-page, .profile-page {
  background-color: #ffffff !important;
}

/* 简单页面标题样式 */
.simple-page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  text-align: center;
  margin: 20px 0;
  padding: 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
  margin: 16px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* 个人中心样式 */
.profile-info {
  display: flex;
  align-items: center;
  padding: 20px;
  margin: 16px;
  background-color: #f0fdf4;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
  border: 2px solid var(--primary-light);
}

.avatar {
  font-size: 64px;
  margin-right: 20px;
  background-color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  background-color: #f0fdf4 !important;
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

/* 首页样式 - 科技感布局 */
.home-page {
  padding: 0;
  margin-top: 0;
}

/* 头部区域 - 绿色童真风格渐变背景 */
.kindergarten-header {
  position: relative;
  text-align: center;
  color: white;
  height: 240px;
  overflow: hidden;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
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

/* 童真风格云朵装饰 */
.header-bg::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  width: 60px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 
    80px 20px 0 0 rgba(255, 255, 255, 0.2),
    40px 30px 0 0 rgba(255, 255, 255, 0.2),
    120px 40px 0 0 rgba(255, 255, 255, 0.2);
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(20px) translateY(-10px); }
}

/* 童真风格太阳效果 */
.header-bg::after {
  content: '☀️';
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 40px;
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

/* 信息卡片 - 童真风格设计 */
.kindergarten-info, .features-section {
  padding: 24px;
  background-color: #f0fdf4;
  margin-bottom: 20px;
  border-radius: 28px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 20px;
  box-shadow: 0 6px 24px rgba(34, 197, 94, 0.15);
  border: 3px solid var(--primary-light);
  position: relative;
  overflow: hidden;
  /* 添加可爱的动物足迹装饰 */
  background-image: 
    url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z' fill='%2384cc16' fill-opacity='0.2'/%3E%3Cpath d='M8 8C9.1 8 10 8.9 10 10C10 11.1 9.1 12 8 12C6.9 12 6 11.1 6 10C6 8.9 6.9 8 8 8Z' fill='%2384cc16' fill-opacity='0.2'/%3E%3Cpath d='M16 8C17.1 8 18 8.9 18 10C18 11.1 17.1 12 16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8Z' fill='%2384cc16' fill-opacity='0.2'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  z-index: 1;
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

/* 标题样式 - 增强童真风格 */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 20px;
  position: relative;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 添加可爱的装饰图标 */
}

.section-title::before {
  content: '✨';
  font-size: 20px;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
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
