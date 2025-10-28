<script setup lang="ts">
import { ref } from 'vue';

// 定义登录表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 定义登录错误信息
const loginError = ref('');

// 定义props
const props = defineProps<{
  onLoginSuccess: () => void;
  onCancel: () => void;
}>();

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
    // 调用成功回调
    props.onLoginSuccess();
  } else {
    // 登录失败
    loginError.value = '账号或密码错误，请重试';
  }
};

// 跳转到首页（取消登录）
const navigateToHome = () => {
  loginForm.value = { username: '', password: '' };
  loginError.value = '';
  // 调用取消回调
  props.onCancel();
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
/* 登录页面样式 - 童真风格 */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 可爱的背景装饰 */
.login-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5C22.76 5 25 7.24 25 10C25 12.76 22.76 15 20 15C17.24 15 15 12.76 15 10C15 7.24 17.24 5 20 5Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3Cpath d='M5 20C7.76 20 10 22.24 10 25C10 27.76 7.24 30 5 30C2.24 30 0 27.76 0 25C0 22.24 2.24 20 5 20Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3Cpath d='M35 20C37.76 20 40 22.24 40 25C40 27.76 37.76 30 35 30C32.24 30 30 27.76 30 25C30 22.24 32.24 20 35 20Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3Cpath d='M20 35C22.76 35 25 37.24 25 40C25 42.76 22.76 45 20 45C17.24 45 15 42.76 15 40C15 37.24 17.24 35 20 35Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E");
  background-size: 30px 30px, 60px 60px;
  animation: float 20s ease-in-out infinite;
  z-index: 0;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, 10px) rotate(1deg); }
  50% { transform: translate(0, 20px) rotate(0deg); }
  75% { transform: translate(-10px, 10px) rotate(-1deg); }
}

.login-container {
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  border: 4px solid var(--primary-light);
  /* 添加可爱的背景图案 */
  background-image: radial-gradient(var(--primary-light) 1px, transparent 1px);
  background-size: 20px 20px;
  position: relative;
  z-index: 1;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 2px solid var(--primary-light);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.login-body {
  padding: 24px;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 2px solid #fecaca;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 3px solid var(--primary-light);
  border-radius: 16px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #f8fafc;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
  background-color: white;
}

.login-hint {
  background-color: #f0fdf4;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 2px dashed var(--primary-light);
}

.hint-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.login-hint p {
  margin: 4px 0;
  font-size: 14px;
  color: #4b5563;
}

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
</style>