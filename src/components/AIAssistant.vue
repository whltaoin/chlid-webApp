<template>
  <div class="ai-page">
    <h1 class="simple-page-title">AI助手</h1>
    
    <!-- AI助手欢迎区域 -->
    <div class="ai-welcome">
      <div class="ai-avatar">🤖</div>
      <h2>欢迎使用AI助手！</h2>
      <p>我是你的智能小助手，可以回答问题、提供帮助和支持</p>
    </div>
    
    <!-- 功能卡片区域 -->
    <div class="ai-features">
      <div class="feature-card">
        <div class="card-icon">💬</div>
        <h3>聊天问答</h3>
        <p>问我任何问题，我会尽力为你解答</p>
      </div>
      
      <div class="feature-card">
        <div class="card-icon">📚</div>
        <h3>学习资源</h3>
        <p>获取适合孩子的学习资料和建议</p>
      </div>
      
      <div class="feature-card">
        <div class="card-icon">🎨</div>
        <h3>创意活动</h3>
        <p>探索有趣的手工和创意活动</p>
      </div>
      
      <div class="feature-card">
        <div class="card-icon">🎵</div>
        <h3>儿歌故事</h3>
        <p>听儿歌、讲故事，寓教于乐</p>
      </div>
    </div>
    
    <!-- 聊天界面模拟 -->
    <div class="chat-simulation">
      <div class="chat-header">
        <h3>开始对话</h3>
      </div>
      
      <div class="chat-messages">
        <div class="ai-message">
          <div class="message-avatar">🤖</div>
          <div class="message-content">你好！我是未来之星幼儿园的AI助手，有什么可以帮助你的吗？</div>
        </div>
      </div>
      
      <div class="chat-input-area">
        <input 
          type="text" 
          placeholder="请输入你的问题..." 
          class="chat-input"
        />
        <button class="send-button">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AI助手组件逻辑
</script>

<style scoped>
.ai-page {
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

/* AI欢迎区域 */
.ai-welcome {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ai-avatar {
  font-size: 80px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

.ai-welcome h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.ai-welcome p {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

/* 功能卡片区域 */
.ai-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #333;
  font-size: 18px;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

/* 聊天模拟界面 */
.chat-simulation {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  padding: 15px 20px;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.chat-messages {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
  min-height: 150px;
}

.ai-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.message-avatar {
  font-size: 24px;
  margin-right: 10px;
}

.message-content {
  background: #f1f1f1;
  padding: 12px 16px;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  color: #333;
  max-width: 80%;
  line-height: 1.4;
}

.chat-input-area {
  display: flex;
  padding: 15px 20px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.chat-input:focus {
  border-color: #4CAF50;
}

.send-button {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 20px;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.send-button:hover {
  transform: scale(1.05);
}

.send-button:active {
  transform: scale(0.95);
}

/* 动画效果 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-features {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .message-content {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .ai-features {
    grid-template-columns: 1fr;
  }
  
  .ai-avatar {
    font-size: 60px;
  }
  
  .simple-page-title {
    font-size: 24px;
  }
}
</style>