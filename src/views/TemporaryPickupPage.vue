<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NativeCameraCapture from '@/components/NativeCameraCapture.vue';
import { showToast } from 'vant';
// 路由实例
const router = useRouter();

// 表单数据引用
const pickupForm = ref({
  imageUrl: '',
  childId: '',
  pickupPerson: '',
  pickupRelationship: '',
  pickupDate: '',
  reason: ''
});

// 定义儿童类型
interface Child {
  id: string;
  name: string;
  className: string;
}

// 儿童列表
const children = ref<Child[]>([
  { id: '1', name: '小红', className: '小班' },
  { id: '2', name: '小明', className: '中班' },
  { id: '3', name: '小刚', className: '大班' }
]);

// 图片数据引用
const capturedImage = ref('');

// 图片变化时更新表单数据
const handleImageChange = (imageData: string) => {
  pickupForm.value.imageUrl = imageData;
};

// 重置表单
const resetForm = () => {
  pickupForm.value = {
    imageUrl: '',
    childId: '',
    pickupPerson: '',
    pickupRelationship: '',
    pickupDate: new Date().toISOString().split('T')[0] || '',
    reason: ''
  };
  capturedImage.value = '';
};

// 提交新建接送记录
const submitNewPickup = () => {
  // 表单验证
  if (!pickupForm.value.childId || 
      !pickupForm.value.pickupPerson?.trim() || 
      !pickupForm.value.pickupRelationship?.trim() || 
      !pickupForm.value.pickupDate || 
      !pickupForm.value.reason?.trim()) {
   
    return;
  }
  
  // 获取选中的儿童信息
  const selectedChild = children.value.find(child => child.id === pickupForm.value.childId);
  if (!selectedChild) return;
  
  // 这里可以添加实际的提交逻辑
  console.log('提交临时接送申请:', {
    ...pickupForm.value,
    childName: selectedChild.name || '未知',
    className: selectedChild.className || '未知班级',
    timestamp: new Date().toISOString()
  });
  
  // 显示成功消息
  showToast('临时接送申请提交成功！');

  
  // 重置表单
  resetForm();
  
  // 提交成功后返回首页
  router.push('/');
};

// 组件挂载时初始化表单
onMounted(() => {
  resetForm();
  // 设置默认日期为今天
  pickupForm.value.pickupDate = new Date().toISOString().split('T')[0] || '';
});
</script>

<template>
  <div class="temporary-pickup-page">
      <div class="modal-content">
      
        
        <div class="modal-body">
          <!-- 摄像头拍照组件 -->
          <div class="camera-capture-section">
            <NativeCameraCapture 
              v-model="capturedImage" 
              @update:modelValue="handleImageChange"
            />
          </div>
          <form @submit.prevent="submitNewPickup" class="pickup-form">
            <div class="form-group">
              <label for="childId">选择儿童：</label>
              <select 
                id="childId" 
                v-model="pickupForm.childId"
                class="form-select"
              >
                <option value="" disabled>请选择儿童</option>
                <option 
                  v-for="child in children" 
                  :key="child.id" 
                  :value="child.id"
                >
                  {{ child.name }} ({{ child.className }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="pickupPerson">接送人姓名：</label>
              <input 
                type="text" 
                id="pickupPerson" 
                v-model="pickupForm.pickupPerson"
                placeholder="请输入接送人姓名"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="pickupRelationship">与儿童关系：</label>
              <input 
                type="text" 
                id="pickupRelationship" 
                v-model="pickupForm.pickupRelationship"
                placeholder="请输入与儿童的关系"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="pickupDate">接送日期：</label>
              <input 
                type="date" 
                id="pickupDate" 
                v-model="pickupForm.pickupDate"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="reason">接送原因：</label>
              <textarea 
                id="reason" 
                v-model="pickupForm.reason"
                placeholder="请输入临时接送原因..."
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

               <button @click="resetForm" class="reset-button">重置</button>
          <button @click="submitNewPickup" class="submit-button">提交</button>
           
          </form>
           
        </div>
        
      
      </div>
    
  </div>
</template>

<style scoped>
/* 页面基础样式 */
.temporary-pickup-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

/* 页面标题 */
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

/* 模态框内容样式 */
.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

/* 模态框主体 */
.modal-body {
  width: 100%;
}

/* 摄像头拍照组件容器样式 */
.camera-capture-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding: 10px;
}

/* 表单样式 */
.pickup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3742fa;
  box-shadow: 0 0 0 2px rgba(55, 66, 250, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 表单底部按钮区域 */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.reset-button {
  background-color: #f1f2f6;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background-color: #dfe4ea;
}

.submit-button {
  background-color: #3742fa;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
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
  .temporary-pickup-page {
    padding: 20px 15px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .modal-content {
    width: 95%;
    margin: 0 auto 100px;
    padding: 20px;
    padding-bottom: 80px;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 10px;
  }
  
  .reset-button,
  .submit-button {
    width: 100%;
    padding: 12px;
  }
}
</style>