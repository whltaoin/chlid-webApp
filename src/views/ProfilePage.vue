<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// 使用路由
const router = useRouter();
// 使用用户状态管理
const userStore = useUserStore();

// 定义表单数据
const profileForm = ref({
  username: '',
  role: '',
  email: '',
  phone: '',
  avatar: '👤'
});

// 定义编辑状态
const isEditing = ref(false);

// 计算属性：检查是否已登录
const isLoggedIn = computed(() => userStore.isLoggedIn);

// 初始化页面
onMounted(() => {
  if (isLoggedIn.value && userStore.user) {
    profileForm.value.username = userStore.user.username || '';
    profileForm.value.role = userStore.user.role || '';
    
    // 从本地存储加载其他信息
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      profileForm.value.email = profileData.email || '';
      profileForm.value.phone = profileData.phone || '';
      profileForm.value.avatar = profileData.avatar || '👤';
    }
  }
});

// 开始编辑
const startEditing = () => {
  isEditing.value = true;
};

// 保存资料
const saveProfile = () => {
  // 更新用户信息
      if (isLoggedIn.value) {
        userStore.updateUserInfo({
          username: profileForm.value.username,
          role: profileForm.value.role as string
        });
      }
  
  // 保存其他信息到本地存储
  const profileData = {
    email: profileForm.value.email,
    phone: profileForm.value.phone,
    avatar: profileForm.value.avatar
  };
  localStorage.setItem('userProfile', JSON.stringify(profileData));
  
  isEditing.value = false;
  
  // 显示保存成功提示（实际应用中可以使用更好的提示方式）
  alert('资料保存成功！');
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
  // 重置表单
  if (isLoggedIn.value && userStore.user) {
    profileForm.value.username = userStore.user.username || '';
    profileForm.value.role = userStore.user.role || '';
  }
  
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    const profileData = JSON.parse(savedProfile);
    profileForm.value.email = profileData.email || '';
    profileForm.value.phone = profileData.phone || '';
    profileForm.value.avatar = profileData.avatar || '👤';
  }
};

// 退出登录
const logout = () => {
  userStore.logout();
  router.push({ name: 'login' });
};

// 跳转到登录页面
const goToLogin = () => {
  router.push({ name: 'login' });
};

// 可选头像
const avatarOptions = ['👤', '👨‍🏫', '👩‍🏫', '👨', '👩', '👧', '👦'];
</script>

<template>
  <div class="profile-page">
    <h1 class="profile-title">
      <span class="title-decoration">🌟</span> 个人资料 <span class="title-decoration">🌟</span>
    </h1>
    
    <div v-if="isLoggedIn" class="profile-content">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar">
            <div v-if="isEditing" class="avatar-selector">
              <button 
                v-for="option in avatarOptions" 
                :key="option"
                @click="profileForm.avatar = option"
                :class="['avatar-option', { 'selected': profileForm.avatar === option }]"
              >
                {{ option }}
              </button>
            </div>
            <div v-else class="avatar-display">
              {{ profileForm.avatar }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-if="isEditing" 
            v-model="profileForm.username" 
            type="text" 
            class="form-input"
          />
          <div v-else class="form-value">{{ profileForm.username }}</div>
        </div>
        
        <div class="form-group">
          <label>角色</label>
          <div class="form-value">{{ profileForm.role }}</div>
        </div>
        
        <div class="form-group">
          <label>邮箱</label>
          <input 
            v-if="isEditing" 
            v-model="profileForm.email" 
            type="email" 
            placeholder="请输入邮箱" 
            class="form-input"
          />
          <div v-else class="form-value">{{ profileForm.email || '未设置' }}</div>
        </div>
        
        <div class="form-group">
          <label>手机号</label>
          <input 
            v-if="isEditing" 
            v-model="profileForm.phone" 
            type="tel" 
            placeholder="请输入手机号" 
            class="form-input"
          />
          <div v-else class="form-value">{{ profileForm.phone || '未设置' }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button 
          v-if="!isEditing" 
          @click="startEditing" 
          class="edit-button"
        >
          编辑资料
        </button>
        <div v-else class="edit-actions">
          <button @click="saveProfile" class="save-button">保存</button>
          <button @click="cancelEditing" class="cancel-button">取消</button>
        </div>
        
        <button @click="logout" class="logout-button">退出登录</button>
      </div>
    </div>
    
    <div v-else class="not-logged-in">
      <p>请先登录以查看个人资料</p>
      <button @click="goToLogin" class="login-button">去登录</button>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器样式 */
.profile-page {
  max-width: 600px;
  padding: 16px;
  min-height: 100vh;
  background-color: #f9f3e5; /* 温暖的米黄色背景 */
  background-image: 
    radial-gradient(circle, #ffedc6 10px, transparent 10px),
    radial-gradient(circle, #ffedc6 10px, transparent 10px);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
  position: relative;
}

/* 装饰性元素 */
.profile-page::before {
  content: '🌈';
  position: fixed;
  top: 10%;
  left: 5%;
  font-size: 24px;
  animation: float 6s ease-in-out infinite;
}

.profile-page::after {
  content: '🌟';
  position: fixed;
  bottom: 10%;
  right: 5%;
  font-size: 24px;
  animation: float 4s ease-in-out infinite 1s;
}

/* 标题样式 */
.profile-title {
  text-align: center;
  color: #3a86ff;
  font-size: 2.2rem;
  font-weight: bold;
  margin: 20px 0;
  position: relative;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-decoration {
  display: inline-block;
  animation: twinkle 2s infinite alternate;
}

.title-decoration:first-child {
  animation-delay: 0.5s;
}

/* 闪烁动画 */
@keyframes twinkle {
  from { opacity: 0.7; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1.1); }
}

/* 浮动动画 */
@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

/* 主内容卡片 */
.profile-content {
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  border: 3px solid #ffd670;
}

.profile-content::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  height: 6px;
  background: linear-gradient(90deg, #ff9e00, #fecb45, #ff9e00);
  border-radius: 5px;
}

/* 头像部分 */
.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  display: inline-block;
  position: relative;
}

.avatar-display {
  font-size: 120px;
  line-height: 1;
  margin-bottom: 16px;
  animation: pulse 3s infinite;
}

/* 头像脉冲动画 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 头像选择器 */
.avatar-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background-color: #fff9e6;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  border: 2px dashed #ffd670;
}

.avatar-option {
  background: white;
  border: 3px solid #ffd670;
  border-radius: 15px;
  font-size: 32px;
  cursor: pointer;
  padding: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.avatar-option::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.avatar-option:active::after {
  width: 100px;
  height: 100px;
}

.avatar-option:hover {
  border-color: #ff9e00;
  transform: scale(1.1) rotate(5deg);
}

.avatar-option.selected {
  border-color: #ff9e00;
  background-color: #fff9e6;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 158, 0, 0.3);
}

/* 表单样式 */
.profile-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #3a86ff;
  margin-bottom: 10px;
  font-size: 1.1rem;
  position: relative;
  padding-left: 20px;
}

.form-group label::before {
  content: '✨';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 14px 20px;
  border: 3px solid #c2e7ff;
  border-radius: 25px;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background-color: white;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #3a86ff;
  box-shadow: 0 0 0 4px rgba(58, 134, 255, 0.2);
  transform: translateY(-2px);
}

.form-value {
  padding: 14px 20px;
  background-color: #e6f7ff;
  border-radius: 25px;
  color: var(--color-text);
  border: 3px solid #91d5ff;
  font-size: 16px;
  min-height: 52px;
  display: flex;
  align-items: center;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.form-value::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background-image: linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.3) 45%, rgba(255, 255, 255, 0.3) 55%, transparent 55%);
  border-radius: 50%;
}

/* 按钮组 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
}

.edit-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
}

/* 按钮样式 - 简化版本，更符合移动端设计 */
.edit-button, .save-button, .cancel-button, .logout-button, .login-button {
  padding: 14px 24px;
  border: none;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 130px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.edit-button::before, .save-button::before, .login-button::before, .logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s;
  z-index: -1;
}

.edit-button:hover::before, .save-button:hover::before, .login-button:hover::before, .logout-button:hover::before {
  transform: translateX(100%);
}

/* 主要按钮 - 彩虹渐变 */
.edit-button, .save-button, .login-button {
  background: linear-gradient(135deg, #4ade80, #22c55e, #16a34a);
  color: white;
  border: 2px solid #bbf7d0;
}

.edit-button:hover, .save-button:hover, .login-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
}

/* 次要按钮 - 云朵风格 */
.cancel-button {
  background-color: #f0f9ff;
  color: #0ea5e9;
  border: 3px solid #7dd3fc;
  background-image: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 60%);
}

.cancel-button:hover {
  background-color: #e0f2fe;
  transform: translateY(-2px) scale(1.02);
  border-color: #0ea5e9;
}

/* 退出按钮 - 太阳风格 */
.logout-button {
  background: linear-gradient(135deg, #f97316, #ea580c, #c2410c);
  color: white;
  border: 2px solid #fdba74;
}

.logout-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
}

/* 按钮点击波纹效果 */
.edit-button, .save-button, .cancel-button, .logout-button, .login-button {
  overflow: hidden;
}

.edit-button::after, .save-button::after, .cancel-button::after, .logout-button::after, .login-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.edit-button:active::after, .save-button:active::after, .cancel-button:active::after, .logout-button:active::after, .login-button:active::after {
  width: 300px;
  height: 300px;
}

/* 未登录状态 */
.not-logged-in {
  text-align: center;
  padding: 50px 25px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border: 3px dashed #91d5ff;
  background-image: 
    radial-gradient(circle, #fff 10px, transparent 10px),
    radial-gradient(circle, #fff 10px, transparent 10px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
}

.not-logged-in p {
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .profile-page {
    padding: 12px;
    background-size: 40px 40px;
  }
  
  .profile-page::before,
  .profile-page::after {
    font-size: 20px;
  }
  
  .profile-title {
    font-size: 1.8rem;
    margin: 16px 0;
    gap: 8px;
  }
  
  .profile-content {
    padding: 20px;
    border-radius: 25px;
  }
  
  .avatar-display {
    font-size: 100px;
  }
  
  .avatar-selector {
    gap: 12px;
    padding: 16px;
  }
  
  .avatar-option {
    font-size: 28px;
    padding: 12px;
  }
  
  .form-input,
  .form-value {
    padding: 12px 16px;
    border-radius: 20px;
  }
  
  .form-group label {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .edit-actions {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }
  
  .edit-button, .save-button, .cancel-button, .logout-button, .login-button {
    width: 100%;
    max-width: 300px;
    padding: 16px;
    font-size: 18px;
  }
  
  .not-logged-in {
    padding: 40px 20px;
    border-radius: 25px;
  }
}
</style>