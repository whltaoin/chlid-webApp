# 儿童管理系统前端应用

## 项目概述
这是一个基于Vue 3 + TypeScript + Vite构建的儿童管理系统前端应用，提供了儿童安全监控、签到、临时接送等功能模块。

## 技术栈
- **前端框架**: Vue 3
- **构建工具**: Vite
- **编程语言**: TypeScript
- **UI组件库**: Vant 4
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **媒体录制**: vue-media-recorder

## 项目结构

```
├── public/           # 静态资源
├── src/              # 源代码
│   ├── assets/       # 项目资源文件
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia状态管理
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   ├── main.ts       # 入口文件
│   └── style.css     # 全局样式
├── index.html        # HTML模板
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript配置
└── vite.config.ts    # Vite配置
```

## 功能模块

### 主要页面
- **首页** (HomePage.vue): 系统主界面
- **登录页面** (LoginPage.vue): 用户登录入口
- **签到页面** (CheckInPage.vue): 儿童签到管理
- **临时接送页面** (TemporaryPickupPage.vue): 临时接送授权管理
- **安全概览页面** (SafetyOverviewPage.vue): 安全监控总览
- **危险行为页面** (DangerBehaviorPage.vue): 危险行为监测
- **AI助手页面** (AIAssistantPage.vue): 智能助手功能
- **班级详情页面** (ClassDetailPage.vue): 班级信息管理
- **物品登记页面** (ItemEntryPage.vue): 物品登记管理
- **过期警告页面** (ExpiryWarningPage.vue): 物品过期提醒
- **个人资料页面** (ProfilePage.vue): 用户个人信息

### 核心功能
1. **用户认证**：登录验证和权限控制
2. **儿童签到管理**：记录儿童到校和离校情况
3. **临时接送授权**：管理临时接送人员信息
4. **安全监控**：实时监测儿童安全状况
5. **AI辅助功能**：提供智能助手服务
6. **物品管理**：登记和管理儿童物品

## 安装与运行

### 前置要求
- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 开发说明

### 组件使用规范
- 使用Vue 3的`<script setup>`语法编写单文件组件
- 遵循TypeScript类型规范，为所有组件属性和函数添加类型注解
- 使用Vant组件库的组件样式保持一致性

### 状态管理
- 使用Pinia进行状态管理，主要包括用户信息等全局状态

### 路由配置
- 使用Vue Router进行页面路由管理
- 未登录用户访问受保护页面时会显示提示信息

## 项目特点

1. **现代化技术栈**：基于Vue 3、TypeScript和Vite构建，提供良好的开发体验
2. **响应式设计**：适配不同屏幕尺寸的设备
3. **类型安全**：全面使用TypeScript确保代码质量
4. **组件化开发**：合理的组件拆分和复用
5. **用户友好**：简洁直观的界面设计和交互体验

## 注意事项

- 项目中使用了Vant UI组件库，在调用Toast等提示组件时需注意正确的调用方式
- 媒体录制功能依赖于浏览器的MediaRecorder API，请确保目标浏览器支持相关功能
- 开发过程中可使用`npm run dev -- --host`在局域网内访问开发服务器
