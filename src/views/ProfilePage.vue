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
    <h1>个人资料</h1>
    
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
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.profile-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  display: inline-block;
  margin-bottom: 20px;
}

.avatar-display {
  font-size: 80px;
  line-height: 1;
}

.avatar-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.avatar-option {
  background: none;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
}

.avatar-option:hover {
  border-color: #07c160;
}

.avatar-option.selected {
  border-color: #07c160;
  background-color: #f1f8e9;
}

.profile-form .form-group {
  margin-bottom: 25px;
}

.profile-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #07c160;
}

.form-value {
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 4px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.edit-button, .save-button, .cancel-button, .logout-button, .login-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #07c160;
  color: white;
}

.edit-button:hover {
  background-color: #06a852;
}

.save-button {
  background-color: #07c160;
  color: white;
}

.save-button:hover {
  background-color: #06a852;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #e9e9e9;
}

.logout-button {
  background-color: #ee0a24;
  color: white;
}

.logout-button:hover {
  background-color: #c8081e;
}

.login-button {
  background-color: #07c160;
  color: white;
}

.login-button:hover {
  background-color: #06a852;
}

.not-logged-in {
  text-align: center;
  padding: 50px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.not-logged-in p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}
</style>