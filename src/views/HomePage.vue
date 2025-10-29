<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// 使用路由
const router = useRouter();
// 使用用户状态管理
const userStore = useUserStore();

// 跳转到AI助手页面
const goToAIAssistant = () => {
  router.push({ name: 'aiAssistant' });
};

// 跳转到入离园管理页面
const goToCheckIn = () => {
  router.push({ name: 'checkIn' });
};

// 跳转到危险行为预警页面
const goToDangerBehaviors = () => {
  router.push({ name: 'dangerBehaviors' });
};

// 跳转到安全动态总览页面
const goToSafetyOverview = () => {
  router.push({ name: 'safetyOverview' });
};

// 跳转到临时接送页面
const goToTemporaryPickup = () => {
  router.push({ name: 'temporaryPickup' });
};

// 跳转到预警信息页面
const goToExpiryWarning = () => {
  router.push({ name: 'expiryWarning' });
};

// 跳转到物品录入页面
const goToItemEntry = () => {
  router.push({ name: 'itemEntry' });
};

// 跳转到个人资料页面
const goToProfile = () => {
  router.push({ name: 'profile' });
};

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
      <h2 class="role-title">
        {{ userStore.isTeacher ? '教师功能' : 
           userStore.isParent ? '家长功能' : 
           userStore.isInspectionTeam ? '验收小组功能' : 
           '系统功能' }}
      </h2>
      
      <div class="feature-grid">
        <!-- 所有角色都可访问的功能 -->
        <div class="feature-card" @click="goToAIAssistant">
          <div class="feature-icon">🤖</div>
          <div class="feature-title">AI助手</div>
          <div class="feature-desc">获取智能教育建议</div>
        </div>
        
        <div class="feature-card" @click="goToProfile">
          <div class="feature-icon">👤</div>
          <div class="feature-title">个人资料</div>
          <div class="feature-desc">管理个人信息</div>
        </div>
        
        <!-- 教师角色可访问的功能 -->
        <div v-if="userStore.isTeacher" class="feature-card" @click="goToCheckIn">
          <div class="feature-icon">✅</div>
          <div class="feature-title">入离园管理</div>
          <div class="feature-desc">幼儿出勤记录</div>
        </div>
        
        <div v-if="userStore.isTeacher" class="feature-card" @click="goToDangerBehaviors">
          <div class="feature-icon">⚠️</div>
          <div class="feature-title">危险行为预警</div>
          <div class="feature-desc">监控幼儿行为安全</div>
        </div>
        
        <!-- 家长角色可访问的功能 -->
        <div v-if="userStore.isParent" class="feature-card" @click="goToSafetyOverview">
          <div class="feature-icon">📊</div>
          <div class="feature-title">安全动态总览</div>
          <div class="feature-desc">查看幼儿安全状况</div>
        </div>
        
        <div v-if="userStore.isParent" class="feature-card" @click="goToTemporaryPickup">
          <div class="feature-icon">👨‍👩‍👧‍👦</div>
          <div class="feature-title">临时接送</div>
          <div class="feature-desc">管理临时接送人员</div>
        </div>
        
        <!-- 验收小组可访问的功能 -->
        <div v-if="userStore.isInspectionTeam" class="feature-card" @click="goToExpiryWarning">
          <div class="feature-icon">⏰</div>
          <div class="feature-title">预警信息</div>
          <div class="feature-desc">查看物品到期预警</div>
        </div>
        
        <div v-if="userStore.isInspectionTeam" class="feature-card" @click="goToItemEntry">
          <div class="feature-icon">📋</div>
          <div class="feature-title">物品录入</div>
          <div class="feature-desc">录入和管理物品信息</div>
        </div>
      </div>
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
  margin: 0 auto;
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