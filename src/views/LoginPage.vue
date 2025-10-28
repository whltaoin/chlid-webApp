<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// 定义登录表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 定义登录错误信息
const loginError = ref('');

// 使用路由
const router = useRouter();
// 使用用户状态管理
const userStore = useUserStore();

// 处理登录
const handleLogin = () => {
  // 定义有效的账号密码组合
  const validAccounts = [
    { username: 'teacher', password: '123456', role: '教师' },
    { username: 'user', password: '123456', role: '家长' },
    { username: 'school', password: '123456', role: '验收小组' }
  ];
  
  // 验证账号密码
  const account = validAccounts.find(
    acc => acc.username === loginForm.value.username && acc.password === loginForm.value.password
  );
  
  if (account) {
    // 登录成功
    loginError.value = '';
    
    // 使用pinia存储用户信息
      userStore.login({
        username: account.username,
        role: account.role as string
      });
    
    // 跳转到首页
    router.push({ name: 'home' });
  } else {
    // 登录失败
    loginError.value = '账号或密码错误，请重试';
  }
};

// 跳转到首页（取消登录）
const navigateToHome = () => {
  loginForm.value = { username: '', password: '' };
  loginError.value = '';
  // 使用路由跳转到首页
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2 class="login-title">欢迎登录</h2>
        <button class="back-button" @click="navigateToHome">返回首页</button>
      </div>
      
      <div class="login-body">
        <!-- 错误信息显示 -->
        <div v-if="loginError" class="error-message">{{ loginError }}</div>
        
        <!-- 登录表单 -->
        <div class="login-form">
          <div class="form-group">
            <label for="username">账号</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入账号"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              class="form-input"
            />
          </div>
          
          <!-- 提示信息 -->
          <div class="login-hint">
            <p class="hint-title">可用账号:</p>
            <p>教师账号: teacher / 123456</p>
            <p>家长账号: user / 123456</p>
            <p>验收小组账号: school / 123456</p>
          </div>
          
          <button class="login-button" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
}

.login-title {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.back-button {
  background: none;
  border: none;
  color: #07c160;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #e8f5e9;
}

.login-body {
  padding: 20px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
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

.login-hint {
  background-color: #f1f8e9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.hint-title {
  font-weight: 500;
  margin-top: 0;
  color: #333;
}

.login-hint p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #06a852;
}
</style>