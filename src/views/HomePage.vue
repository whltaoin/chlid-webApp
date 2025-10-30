<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// 使用路由
const router = useRouter();
// 使用用户状态管理
const userStore = useUserStore();

// 导航功能将在模板中直接使用router.push

// 跳转到登录页面
const goToLogin = () => {
  router.push({ name: 'login' });
};

// 退出登录
const logout = () => {
  userStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="home-page">
    <div class="home-header">
      <h1>欢迎来到智能幼教系统</h1>
      
      <!-- 幼儿园信息展示 -->
      <div class="kindergarten-info">
        <div class="kindergarten-header">
          <div class="kindergarten-logo">🏫</div>
          <div class="kindergarten-details">
            <h2 class="kindergarten-name">阳光幼儿园</h2>
            <p class="kindergarten-slogan">用心呵护，用爱教育</p>
          </div>
        </div>
        <div class="kindergarten-description">
          <p>阳光幼儿园是一所致力于为3-6岁儿童提供优质学前教育的现代化幼儿园。</p>
          <p>我们注重培养儿童的综合素质，提供安全、温馨、充满爱的成长环境。</p>
        </div>
        <div class="kindergarten-stats">
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">班级数量</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">300+</span>
            <span class="stat-label">在园幼儿</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">40+</span>
            <span class="stat-label">专业教师</span>
          </div>
        </div>
      </div>
      
      <div v-if="userStore.isLoggedIn" class="user-info">
        <span>当前登录: {{ userStore.user?.username }}</span>
        <span>角色: {{ userStore.user?.role }}</span>
        <button class="logout-button" @click="logout">退出登录</button>
      </div>
      <div v-else>
        <button class="login-button" @click="goToLogin">请登录</button>
      </div>
    </div>
    
    <div class="home-content">
      <!-- <h2 class="role-title">
        {{ userStore.isTeacher ? '教师功能' : 
           userStore.isParent ? '家长功能' : 
           userStore.isInspectionTeam ? '验收小组功能' : 
           '系统功能' }}
      </h2>
       -->
     
      
     
        
      
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 20px;
  text-align: center;
}

.home-header {
  margin-bottom: 40px;
}

.home-header h1 {
  color: #333;
  margin-bottom: 20px;
}

/* 幼儿园信息样式 */
.kindergarten-info {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kindergarten-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.kindergarten-logo {
  font-size: 48px;
  line-height: 1;
}

.kindergarten-details {
  text-align: left;
}

.kindergarten-name {
  font-size: 24px;
  font-weight: bold;
  color: #0288d1;
  margin: 0 0 5px 0;
}

.kindergarten-slogan {
  font-size: 16px;
  color: #0277bd;
  margin: 0;
  font-style: italic;
}

.kindergarten-description {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.kindergarten-description p {
  margin: 8px 0;
  line-height: 1.6;
  color: #333;
}

.kindergarten-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #01579b;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #0288d1;
  margin-top: 5px;
}

.role-title {
  color: #333;
  margin-bottom: 30px;
  font-size: 20px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.login-button, .logout-button {
  padding: 8px 16px;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button {
  background-color: #ee0a24;
}

.login-button:hover, .logout-button:hover {
  opacity: 0.8;
}

.home-content {
  max-width: 800px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.feature-desc {
  font-size: 14px;
  color: #666;
}
</style>