import { defineStore } from 'pinia';

// 定义用户类型
interface User {
  id?: string;
  username: string;
  role: string; // 改为string类型以支持不同的角色名称
  avatar?: string;
}

// 定义用户状态类型
interface UserState {
  isLoggedIn: boolean;
  user: User | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || 'null') : null
  }),
  
  getters: {
    // 获取用户角色
    userRole(): string | null {
      return this.user?.role || null;
    },
    
    // 检查是否为管理员
    isAdmin(): boolean {
      return this.user?.role === '验收小组';
    },
    
    // 检查是否为教师（支持中英文角色名称）
    isTeacher(): boolean {
      const role = this.user?.role || '';
      return role === 'teacher' || role === '教师';
    },
    
    // 检查是否为家长（支持中英文角色名称）
    isParent(): boolean {
      const role = this.user?.role || '';
      return role === 'parent' || role === '家长';
    }
  },
  
  actions: {
    // 用户登录
    login(userData: Partial<User>) {
      this.isLoggedIn = true;
      // 确保包含所有必需字段，id是可选的
      this.user = {
        username: userData.username || '',
        role: userData.role || '',
        id: userData.id,
        avatar: userData.avatar
      } as User;
      
      // 保存到本地存储
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    
    // 用户登出
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      
      // 清除本地存储
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    },
    
    // 更新用户信息
    updateUserInfo(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    }
  }
});