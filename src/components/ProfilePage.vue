<template>
  <div class="profile-page">
    <h1 class="simple-page-title">个人中心</h1>
    
    <!-- 未登录状态 -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <div class="prompt-icon">🔒</div>
      <p>请先登录查看个人信息</p>
      <button class="login-button" @click="handleLoginClick">立即登录</button>
    </div>
    
    <!-- 已登录状态 -->
    <div v-else class="profile-content">
      <!-- 用户基本信息卡片 -->
      <div class="user-info-card">
        <div class="avatar">👤</div>
        <div class="user-details">
          <h3>欢迎回来！</h3>
          <p>您已成功登录系统</p>
          <p v-if="userRole" class="user-role">角色：{{ userRole }}</p>
        </div>
      </div>
      
      <!-- 功能菜单 -->
      <div class="profile-menu">
        <div class="menu-item">
          <div class="menu-icon">📝</div>
          <div class="menu-text">个人资料</div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item">
          <div class="menu-icon">📚</div>
          <div class="menu-text">我的课程</div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item">
          <div class="menu-icon">📅</div>
          <div class="menu-text">活动记录</div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item">
          <div class="menu-icon">⚙️</div>
          <div class="menu-text">设置</div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item">
          <div class="menu-icon">❓</div>
          <div class="menu-text">帮助与反馈</div>
          <div class="menu-arrow">›</div>
        </div>
      </div>
      
      <!-- 登出按钮 -->
      <button class="logout-button" @click="handleLogout">退出登录</button>
      
      <!-- 版本信息 -->
      <div class="version-info">
        <p>未来之星幼儿园 v1.0.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义props
const props = defineProps<{
  isLoggedIn: boolean;
  userRole?: string;
}>();

// 定义emits
const emit = defineEmits<{
  'login': [];
  'logout': [];
}>();

// 处理登录按钮点击
const handleLoginClick = () => {
  emit('login');
};

// 处理登出
const handleLogout = () => {
  emit('logout');
};
</script>

<style scoped>
.profile-page {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
}

.simple-page-title {
  text-align: center;
  color: #4CAF50;
  font-size: 28px;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 未登录状态样式 */
.login-prompt {
  background: white;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.prompt-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.login-prompt p {
  color: #666;
  font-size: 18px;
  margin-bottom: 30px;
}

.login-button {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 已登录状态样式 */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 用户信息卡片 */
.user-info-card {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.avatar {
  font-size: 100px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.user-details h3 {
  font-size: 24px;
  margin: 0 0 10px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.user-details p {
  font-size: 16px;
  margin: 5px 0;
  opacity: 0.9;
}

.user-role {
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: 5px 15px;
  border-radius: 15px;
  margin-top: 10px;
  font-size: 14px;
}

/* 功能菜单 */
.profile-menu {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f9f9f9;
}

.menu-icon {
  font-size: 24px;
  margin-right: 15px;
  color: #4CAF50;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  color: #999;
  font-size: 20px;
}

/* 登出按钮 */
.logout-button {
  background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4);
}

.logout-button:active {
  transform: translateY(0);
}

/* 版本信息 */
.version-info {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .simple-page-title {
    font-size: 24px;
  }
  
  .avatar {
    font-size: 80px;
  }
  
  .user-info-card {
    padding: 25px 20px;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 15px;
  }
  
  .login-prompt {
    padding: 30px 15px;
  }
  
  .prompt-icon {
    font-size: 60px;
  }
  
  .menu-item {
    padding: 15px;
  }
}
</style>