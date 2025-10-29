<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定义儿童信息接口
interface Child {
  id: number;
  name: string;
  className: string;
  checkInStatus: '已入园' | '未入园' | '无记录';
  checkInTime?: string;
}

// 模拟当前儿童数据
const currentChild = ref<Child>({
  id: 1,
  name: '小明',
  className: '小班（苹果班）',
  checkInStatus: '已入园',
  checkInTime: '08:20'
});

// 请假模态框状态
const showLeaveModal = ref(false);
const leaveReason = ref('');
const showSuccessMessage = ref(false);

// 计算当前时间是否超过8点半
const isAfterHalfPastEight = computed(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 8 || (hours === 8 && minutes >= 30);
});

// 计算显示的状态文本
const displayStatus = computed(() => {
  if (isAfterHalfPastEight.value && currentChild.value.checkInStatus !== '已入园') {
    return '进入无记录';
  }
  return currentChild.value.checkInStatus;
});

// 计算状态对应的样式类名
const statusClass = computed(() => {
  const status = displayStatus.value;
  switch (status) {
    case '已入园': return 'status-checked-in';
    case '未入园': return 'status-not-checked-in';
    case '进入无记录': return 'status-no-record';
    default: return '';
  }
});

// 打开请假模态框
const openLeaveModal = () => {
  showLeaveModal.value = true;
  leaveReason.value = '';
};

// 关闭请假模态框
const closeLeaveModal = () => {
  showLeaveModal.value = false;
  leaveReason.value = '';
};

// 提交请假申请
const submitLeaveRequest = () => {
  if (!leaveReason.value.trim()) {
    alert('请填写请假原因');
    return;
  }
  
  // 这里可以添加实际的提交逻辑
  console.log('提交请假申请:', {
    childId: currentChild.value.id,
    childName: currentChild.value.name,
    reason: leaveReason.value,
    timestamp: new Date().toISOString()
  });
  
  // 显示成功消息
  closeLeaveModal();
  showSuccessMessage.value = true;
  
  // 3秒后隐藏成功消息
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};
</script>

<template>
  <div class="safety-overview-page">
    <h1>安全动态总览</h1>
    
    <!-- 儿童信息卡片 -->
    <div class="child-info-card">
      <div class="child-basic-info">
        <h2>{{ currentChild.name }}</h2>
        <p class="child-class">{{ currentChild.className }}</p>
      </div>
      
      <!-- 入园状态 -->
      <div class="check-in-status">
        <div class="status-section">
          <span class="status-label">今日入园状态：</span>
          <span :class="['status-badge', statusClass]">{{ displayStatus }}</span>
        </div>
        
        <!-- 入园时间（仅在已入园时显示） -->
        <div v-if="currentChild.checkInStatus === '已入园'" class="check-in-time">
          <span class="time-label">入园时间：</span>
          <span class="time-value">{{ currentChild.checkInTime }}</span>
        </div>
        
        <!-- 一键请假按钮 -->
        <button @click="openLeaveModal" class="leave-button">
          一键请假
        </button>
      </div>
    </div>
    
    <!-- 请假成功消息 -->
    <div v-if="showSuccessMessage" class="success-message">
      ✅ 请假申请提交成功！
    </div>
    
    <!-- 请假模态框 -->
    <div v-if="showLeaveModal" class="modal-overlay" @click.self="closeLeaveModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>儿童请假</h3>
          <button @click="closeLeaveModal" class="close-button">×</button>
        </div>
        
        <div class="modal-body">
          <div class="child-info">
            <p><strong>儿童姓名：</strong>{{ currentChild.name }}</p>
            <p><strong>所属班级：</strong>{{ currentChild.className }}</p>
          </div>
          
          <div class="reason-section">
            <label for="leaveReason">请假原因：</label>
            <textarea 
              id="leaveReason"
              v-model="leaveReason"
              placeholder="请输入请假原因..."
              rows="4"
              class="reason-input"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeLeaveModal" class="cancel-button">取消</button>
          <button @click="submitLeaveRequest" class="submit-button">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.safety-overview-page {
  max-width: 800px;
  margin: 0 auto 120px;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.child-info-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #3742fa;
  margin-bottom: 20px;
}

.child-basic-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.child-basic-info h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 22px;
}

.child-class {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.check-in-status {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.status-checked-in {
  background-color: #2ed573;
}

.status-not-checked-in {
  background-color: #ffa502;
}

.status-no-record {
  background-color: #ff4757;
}

.check-in-time {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.time-label {
  font-weight: 500;
}

.time-value {
  font-weight: 600;
  color: #333;
}

.leave-button {
  background-color: #3742fa;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.leave-button:hover {
  background-color: #2f3542;
  transform: translateY(-1px);
}

.leave-button:active {
  transform: translateY(0);
}

/* 成功消息样式 */
.success-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #2ed573;
  color: white;
  padding: 20px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 25px;
}

.child-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.child-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.reason-section {
  margin-bottom: 20px;
}

.reason-section label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.reason-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  box-sizing: border-box;
}

.reason-input:focus {
  outline: none;
  border-color: #3742fa;
  box-shadow: 0 0 0 2px rgba(55, 66, 250, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 25px;
  border-top: 1px solid #f0f0f0;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #3742fa;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #2f3542;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .safety-overview-page {
    padding: 15px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .child-info-card {
    padding: 20px;
  }
  
  .child-basic-info h2 {
    font-size: 20px;
  }
  
  .status-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 15px;
  }
}
</style>