<script setup lang="ts">
import { ref } from 'vue';

// 定义聊天消息列表
const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是智能幼教助手，有什么可以帮助你的吗？'
  }
]);

// 定义输入消息
const inputMessage = ref('');

// 简化AI助手功能

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value
  });
  
  inputMessage.value = '';
  
  // 模拟AI回复延迟
  setTimeout(() => {
    // 简单回复
    //   reply = presetReplies[3] || '';
    // } else if (userInput.includes('表扬') || userInput.includes('鼓励') || userInput.includes('自信')) {
    //   reply = presetReplies[4] || '';
    // }
    
    // 添加AI回复
    // messages.value.push({
    //   role: 'assistant',
    //   content: reply
    // });
    
    // 滚动到底部
    scrollToBottom();
  }, 500);
};

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 100);
};
</script>

<template>
  <div class="ai-assistant-page">
    <h1>AI幼教助手</h1>
    
    <div id="chat-container" class="chat-container">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    
    <div class="input-container">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="请输入您的问题..."
        class="message-input"
      />
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant-page {
  max-width: 800px;
  padding: 20px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background-color: #07c160;
  color: white;
}

.message.assistant .message-content {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.input-container {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
}

.message-input:focus {
  border-color: #07c160;
}

.send-button {
  padding: 12px 24px;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #06a852;
}
</style>