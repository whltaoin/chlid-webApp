<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 使用路由
const router = useRouter();

// 定义聊天消息列表
const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是智能幼教助手，有什么可以帮助你的吗？'
  }
]);

// 定义输入消息
const inputMessage = ref('');

// 模拟AI回复的预设答案
const presetReplies = [
  '对于幼儿早期教育，建议多进行互动式学习，培养孩子的动手能力和创造力。',
  '幼儿语言发展关键期是0-6岁，家长可以通过多讲故事、唱儿歌等方式促进语言能力发展。',
  '孩子注意力持续时间有限，学习活动应该保持多样化，每次不宜过长。',
  '培养孩子的社交能力很重要，鼓励他们与同龄人一起玩耍和分享。',
  '正面激励比批评更有效，多表扬孩子的进步，增强他们的自信心。'
];

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value
  });
  
  const userInput = inputMessage.value;
  inputMessage.value = '';
  
  // 模拟AI回复延迟
  setTimeout(() => {
    // // 简单匹配关键词，提供更相关的回复
    // let reply: string = presetReplies[Math.floor(Math.random() * presetReplies.length)];
    
    // if (userInput.includes('语言') || userInput.includes('说话')) {
    //   reply = presetReplies[1] || '';
    // } else if (userInput.includes('注意力') || userInput.includes('专注')) {
    //   reply = presetReplies[2] || '';
    // } else if (userInput.includes('社交') || userInput.includes('朋友')) {
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
  margin: 0 auto;
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