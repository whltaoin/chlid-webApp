<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

// 定义属性和事件
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// 响应式数据
const isModalVisible = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const hasCameraError = ref(false);

// 打开相机模态框
const openCameraModal = () => {
  isModalVisible.value = true;
  startCamera();
};

// 关闭相机模态框
const closeCameraModal = () => {
  isModalVisible.value = false;
  stopCamera();
};

// 开始摄像头
const startCamera = async () => {
  try {
    // 停止之前可能存在的流
    stopCamera();
    
    hasCameraError.value = false;
    
    // 请求摄像头权限，指定使用前置摄像头（如果可用）
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 720 },
        height: { ideal: 1280 }
      }
    });
    
    // 设置视频源
    if (videoElement.value && stream.value) {
      videoElement.value.srcObject = stream.value;
    }
  } catch (error) {
    console.error('摄像头启动失败:', error);
    hasCameraError.value = true;
  }
};

// 停止摄像头
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null;
  }
};

// 拍照
const capturePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return;
  
  // 设置canvas尺寸与视频一致（竖屏模式）
  canvasElement.value.width = 300;
  canvasElement.value.height = 400;
  
  const ctx = canvasElement.value.getContext('2d');
  if (!ctx) return;
  
  // 绘制视频帧到canvas
  ctx.drawImage(videoElement.value, 0, 0, 300, 400);
  
  // 转换为base64字符串
  const imageData = canvasElement.value.toDataURL('image/jpeg');
  
  // 更新绑定的值
  emit('update:modelValue', imageData);
  
  // 关闭模态框
  closeCameraModal();
};

// 重新拍摄
const retakePhoto = () => {
  emit('update:modelValue', '');
};

// 监听模态框关闭事件，确保停止摄像头
watch(() => isModalVisible.value, (newValue) => {
  if (!newValue) {
    stopCamera();
  }
});

// 组件卸载时停止摄像头
onUnmounted(() => {
  stopCamera();
});
</script>

<template>
  <div class="camera-capture">
    <!-- 图片显示区域 -->
    <div class="image-preview-container">
      <div 
        v-if="!modelValue" 
        class="camera-placeholder"
        @click="openCameraModal"
      >
        <div class="plus-icon">+</div>
        <p class="placeholder-text">点击拍照</p>
      </div>
      
      <div v-else class="image-preview-wrapper">
        <img 
          :src="modelValue" 
          alt="已拍摄照片" 
          class="captured-image"
        />
        <div class="image-actions">
          <button 
            @click="retakePhoto" 
            class="retake-button"
          >
            重新拍摄
          </button>
          <button 
            @click="openCameraModal" 
            class="reopen-button"
          >
            再次拍照
          </button>
        </div>
      </div>
    </div>
    
    <!-- 相机模态框 -->
    <div 
      v-if="isModalVisible" 
      class="camera-modal"
      @click.self="closeCameraModal"
    >
      <div class="camera-modal-content">
        <div class="camera-header">
          <h3>拍摄照片</h3>
          <button 
            @click="closeCameraModal" 
            class="close-button"
          >
            ×
          </button>
        </div>
        
        <div class="camera-body">
          <div class="camera-frame">
            <video 
              ref="videoElement" 
              autoplay 
              playsinline 
              class="camera-video"
            ></video>
            <canvas 
              ref="canvasElement" 
              class="hidden-canvas"
            ></canvas>
            
            <!-- 相机错误提示 -->
            <div v-if="hasCameraError" class="camera-error">
              <p>无法访问摄像头，请确保已授予权限</p>
              <button @click="startCamera" class="retry-button">重试</button>
            </div>
            
            <!-- 相机提示文字 -->
            <div v-if="!hasCameraError" class="camera-instructions">
              <p>请将被接送人置于框内</p>
            </div>
          </div>
        </div>
        
        <div class="camera-footer">
          <button 
            @click="closeCameraModal" 
            class="cancel-button"
          >
            取消
          </button>
          <button 
            @click="capturePhoto" 
            class="capture-button"
            :disabled="hasCameraError"
          >
            拍照
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础容器样式 */
.camera-capture {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 图片预览区域样式 */
.image-preview-container {
  width: 100%;
  max-width: 300px;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  border: 2px dashed #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-preview-container:hover {
  border-color: #3742fa;
  background-color: #f0f0ff;
}

/* 相机占位符样式 */
.camera-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.plus-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3742fa;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.camera-placeholder:hover .plus-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(55, 66, 250, 0.4);
}

.placeholder-text {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 已拍摄图片预览样式 */
.image-preview-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.captured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 图片操作按钮 */
.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.retake-button, .reopen-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retake-button {
  background-color: #ff4757;
  color: white;
}

.retake-button:hover {
  background-color: #ff3838;
}

.reopen-button {
  background-color: #3742fa;
  color: white;
}

.reopen-button:hover {
  background-color: #2f3542;
}

/* 相机模态框样式 */
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.camera-modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 相机模态框头部 */
.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.camera-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* 相机模态框主体 */
.camera-body {
  flex: 1;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera-frame {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #000;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* 镜像显示，更符合自拍体验 */
}

.hidden-canvas {
  display: none;
}

/* 相机错误提示 */
.camera-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;
}

.camera-error p {
  margin-bottom: 16px;
  font-size: 14px;
}

.retry-button {
  padding: 8px 16px;
  background-color: #3742fa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #2f3542;
}

/* 相机使用提示 */
.camera-instructions {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 16px;
  text-align: center;
}

.camera-instructions p {
  margin: 0;
  font-size: 14px;
}

/* 相机模态框底部 */
.camera-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.cancel-button, .capture-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background-color: #f1f2f6;
  color: #666;
  margin-right: 8px;
}

.cancel-button:hover {
  background-color: #dfe4ea;
}

.capture-button {
  background-color: #3742fa;
  color: white;
  margin-left: 8px;
}

.capture-button:hover:not(:disabled) {
  background-color: #2f3542;
}

.capture-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .image-preview-container {
    width: 350px;
    height: 350px;
  }
  
  .camera-modal-content {
    width: 95%;
    max-width: none;
  }
  
  .camera-frame {
    width: 100%;
    height: 350px;
  }
  
  .camera-footer {
    padding: 12px;
  }
  
  .cancel-button, .capture-button {
    font-size: 14px;
    padding: 10px;
  }
}
</style>