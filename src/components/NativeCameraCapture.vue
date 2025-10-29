<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

// 定义属性和事件
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'camera-permission-requested': [];
  'camera-permission-granted': [];
  'camera-permission-denied': [error: Error];
  'permission-request-end': [];
}>();

// 响应式数据
const isModalVisible = ref(false);
const hasCameraError = ref(false);
const errorMessage = ref('');
const isMobile = ref(false);
const permissionDeniedBefore = ref(false);
const permissionRequestInProgress = ref(false);
const hasUserInteraction = ref(false);
const stream = ref<MediaStream | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const isSwitchingCamera = ref(false);
let currentCamera: 'user' | 'environment' = 'user';

// 设备检测 - 更精确的设备识别
let isChromeIOS = false;

const checkIfMobile = () => {
  const hasTouchScreen = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) ||
                        ((navigator as any).msMaxTouchPoints > 0);
  const isSmallScreen = window.innerWidth <= 768;
  const agentMatch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  isChromeIOS = isIOS && /CriOS/i.test(navigator.userAgent);
  isMobile.value = (hasTouchScreen && isSmallScreen) || agentMatch;
  
  // 移动设备默认使用后置摄像头
  if (isMobile.value) {
    currentCamera = 'environment';
  }
};

// 处理用户交互事件
const handleUserInteraction = () => {
  hasUserInteraction.value = true;
  // 移除事件监听器，避免重复触发
  document.removeEventListener('click', handleUserInteraction);
  document.removeEventListener('touchstart', handleUserInteraction);
};

// 初始化
onMounted(() => {
  checkIfMobile();
  // 监听用户交互，确保在用户交互后再请求摄像头权限
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('touchstart', handleUserInteraction);
  
  // 窗口大小改变时重新检测设备类型
  window.addEventListener('resize', checkIfMobile);
});

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('click', handleUserInteraction);
  document.removeEventListener('touchstart', handleUserInteraction);
  window.removeEventListener('resize', checkIfMobile);
  stopStream();
});

// 停止视频流
const stopStream = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
};

// 打开相机模态框
const openCameraModal = async () => {
  isModalVisible.value = true;
  
  // 等待模态框完全显示后再初始化摄像头
  await nextTick();
  
  // 如果是移动设备且尚未有用户交互，提示用户点击以授权
  if (isMobile.value && !hasUserInteraction.value) {
    hasCameraError.value = true;
    errorMessage.value = '需要用户交互才能访问摄像头，请点击下方重试按钮';
    return;
  }
  
  // 尝试初始化摄像头
  initCamera();
};

// 关闭相机模态框
const closeCameraModal = () => {
  isModalVisible.value = false;
  stopStream();
};

// 初始化摄像头
const initCamera = async () => {
  if (!hasUserInteraction.value || permissionRequestInProgress.value) {
    return;
  }
  
  hasCameraError.value = false;
  errorMessage.value = '';
  permissionRequestInProgress.value = true;
  emit('camera-permission-requested');
  
  try {
    // 首先停止现有流
    stopStream();
    
    // 获取媒体设备配置 - 针对不同设备的优化配置
    let constraints: MediaStreamConstraints;
    
    // iOS Chrome的特殊处理
    if (isChromeIOS) {
      // iOS Chrome需要最简配置，使用固定参数而非facingMode
      constraints = {
        video: true,
        audio: false
      };
    } else {
      // 其他设备使用标准配置
      constraints = {
        video: {
          facingMode: currentCamera
        },
        audio: false
      };
    }
    
    // 对于普通移动设备的基础配置
    if (isMobile.value && !isChromeIOS) {
      constraints.video = { facingMode: currentCamera };
    }
    
    // 尝试获取媒体流 - 处理iOS Chrome特殊情况
    if (isChromeIOS) {
      // iOS Chrome可能需要更直接的方式
      try {
        stream.value = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (firstError) {
        // 如果失败，尝试切换摄像头方向
        console.warn('第一次尝试失败，尝试切换摄像头方向:', firstError);
        // 在iOS Chrome中，我们无法直接控制facingMode，让系统自动选择
        stream.value = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
      }
    } else {
      stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    }
    
    // 设置视频源
    if (videoElement.value && stream.value) {
      try {
        // 先移除现有的源，避免资源泄漏
        if (videoElement.value.srcObject) {
          videoElement.value.srcObject = null;
        }
        
        // 设置新的流
        videoElement.value.srcObject = stream.value;
        
        // 移动设备上显式播放
        if (isMobile.value) {
          await videoElement.value.play();
        } else {
          videoElement.value.play().catch(e => {
            console.warn('视频自动播放失败，这可能是因为浏览器策略限制:', e);
          });
        }
      } catch (playError) {
        console.error('视频播放错误:', playError);
      }
    }
    
    emit('camera-permission-granted');
    permissionDeniedBefore.value = false;
    
  } catch (error: any) {
    handleCameraError(error);
  } finally {
    permissionRequestInProgress.value = false;
    emit('permission-request-end');
  }
};

// 处理摄像头错误
const handleCameraError = (error: Error) => {
  console.error('摄像头错误:', error);
  hasCameraError.value = true;
  emit('camera-permission-denied', error);
  
  // 检查浏览器是否支持媒体设备API
  if (!checkMediaSupport()) {
    errorMessage.value = '您的浏览器不支持摄像头访问功能。\n\n请使用以下现代浏览器的最新版本:\n• Google Chrome\n• Mozilla Firefox\n• Apple Safari\n• Microsoft Edge';
    return;
  }
  
  const errorName = (error as any).name || '';
  const errorMessageText = error.message || JSON.stringify(error);
  
  // 处理各种错误类型
  if (errorName === 'NotAllowedError' || errorMessageText.includes('权限') || errorMessageText.includes('permission')) {
    permissionDeniedBefore.value = true;
    
    // 根据设备类型提供不同的错误信息
    if (isMobile.value) {
      if (/Android/i.test(navigator.userAgent)) {
        errorMessage.value = '需要摄像头权限才能使用此功能。\n\n请按以下步骤操作:\n1. 打开设备设置\n2. 找到应用权限或隐私设置\n3. 选择相机权限\n4. 允许此网站访问相机';
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        errorMessage.value = '需要摄像头权限才能使用此功能。\n\n请按以下步骤操作:\n1. 打开设备设置\n2. 找到并点击Safari或您使用的浏览器\n3. 确保相机权限已开启\n4. 返回此页面并刷新';
      } else {
        errorMessage.value = '需要摄像头权限才能使用此功能。\n请前往设备设置中允许此网站访问摄像头。';
      }
    } else {
      errorMessage.value = '需要摄像头权限才能使用此功能。\n\n请点击地址栏旁边的锁图标，\n在权限设置中允许使用摄像头。';
    }
  } else if (errorName === 'NotFoundError' || errorMessageText.includes('未找到')) {
    errorMessage.value = '未找到可用的摄像头设备。\n请确保您的设备有摄像头并正常工作。';
  } else if (errorName === 'NotReadableError' || errorMessageText.includes('占用')) {
    errorMessage.value = '摄像头被其他应用占用，请关闭可能正在使用摄像头的应用后重试。';
  } else if (errorName === 'OverconstrainedError' || errorMessageText.includes('参数')) {
    // 尝试使用更简单的配置
    errorMessage.value = '摄像头配置参数不兼容，请尝试重试按钮获取基础功能。';
  } else if (errorMessageText.includes('不支持') || errorMessageText.includes('not supported') || errorMessageText.includes('not implemented')) {
    // 更详细的浏览器兼容性提示
    if (isMobile.value) {
      errorMessage.value = '您的浏览器可能不完全支持摄像头访问。\n\n推荐使用:\n• iOS: Safari最新版本\n• Android: Chrome最新版本';
    } else {
      errorMessage.value = '您的浏览器不支持摄像头访问，请使用以下浏览器的最新版本:\n• Google Chrome\n• Mozilla Firefox\n• Apple Safari\n• Microsoft Edge';
    }
  } else {
    // 通用错误处理
    errorMessage.value = '无法访问摄像头，请检查以下事项:\n\n1. 您的设备有可用摄像头\n2. 浏览器允许此网站访问摄像头\n3. 没有其他应用正在使用摄像头\n\n如果问题仍然存在，请尝试刷新页面或使用其他浏览器。';
  }
};

// 切换摄像头
const toggleCamera = async () => {
  if (isSwitchingCamera.value || permissionRequestInProgress.value) return;
  
  isSwitchingCamera.value = true;
  
  try {
      // 切换摄像头类型
      currentCamera = currentCamera === 'user' ? 'environment' : 'user';
      
      // 重新初始化摄像头
      await initCamera();
    } catch (error) {
      console.error('切换摄像头失败:', error);
      // 如果切换失败，恢复原来的摄像头类型
      currentCamera = currentCamera === 'user' ? 'environment' : 'user';
    } finally {
    isSwitchingCamera.value = false;
  }
};

// 拍照功能
const capturePhoto = async () => {
  if (!videoElement.value || hasCameraError.value || permissionRequestInProgress.value) {
    return;
  }
  
  try {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    const video = videoElement.value;
    
    // 设置canvas尺寸与视频一致
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    if (videoWidth && videoHeight) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    } else {
      // 回退到默认尺寸
      canvas.width = 1280;
      canvas.height = 720;
    }
    
    // 获取canvas上下文
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('无法获取canvas上下文');
    }
    
    // 考虑镜像效果和设备差异
    if (currentCamera === 'user' && !isMobile.value) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    // 转换为base64格式
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // 更新绑定的值
    emit('update:modelValue', imageData);
    
    // 关闭模态框
    closeCameraModal();
  } catch (error) {
    console.error('拍照失败:', error);
    if (isChromeIOS) {
      errorMessage.value = 'iOS Chrome拍照功能受限，请尝试使用Safari浏览器。';
    } else {
      errorMessage.value = '拍照失败，请重试';
    }
    hasCameraError.value = true;
  }
};

// 重新拍摄
const retakePhoto = () => {
  emit('update:modelValue', '');
  // 重新打开摄像头
  setTimeout(() => {
    openCameraModal();
  }, 100);
};

// 处理视频元素错误
const handleVideoError = (event: Event) => {
  console.error('视频元素错误:', event);
  hasCameraError.value = true;
  
  // 根据设备显示不同的错误信息
  if (isChromeIOS) {
    errorMessage.value = 'iOS Chrome浏览器摄像头访问受限，请尝试使用Safari浏览器或检查隐私设置。';
  } else {
    errorMessage.value = '视频加载失败，请检查摄像头是否正常工作。';
  }
};

// 处理视频可以播放事件 - 特别是对iOS设备很重要
const handleVideoCanPlay = () => {
  console.log('视频可以播放');
  hasCameraError.value = false;
};

// 处理视频数据加载事件
const handleVideoLoadedData = () => {
  console.log('视频数据已加载');
};

// 检查浏览器是否支持媒体设备API
const checkMediaSupport = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// 重试初始化摄像头
const retryCamera = () => {
  if (hasUserInteraction.value && isModalVisible.value) {
    initCamera();
  }
};

// 检查是否有多个摄像头可用
const checkMultipleCameras = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    return videoDevices.length >= 2;
  } catch (error) {
    console.warn('无法枚举设备:', error);
    return false;
  }
};
</script>

<template>
  <div class="native-camera-capture">
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
            <!-- 视频元素 -->
            <video
              v-if="!hasCameraError && checkMediaSupport()"
              ref="videoElement"
              autoplay
              playsinline
              muted
              class="camera-video"
              :style="{ 
                transform: currentCamera === 'user' && !isMobile ? 'scaleX(-1)' : 'scaleX(1)',
                objectFit: 'cover'
              }"
              width="100%"
              height="100%"
              :capture="isMobile ? 'environment' : undefined"
              @error="handleVideoError"
              @canplay="handleVideoCanPlay"
              @loadeddata="handleVideoLoadedData"
            ></video>
            
            <!-- 相机错误提示或浏览器不支持 -->
            <div v-if="hasCameraError || !checkMediaSupport()" class="camera-error">
              <p class="error-text">{{ errorMessage || '无法访问摄像头，请确保已授予权限' }}</p>
              <div v-if="isChromeIOS" class="ios-tip">
                <p class="tip-text">提示：iOS Chrome浏览器可能限制摄像头访问</p>
                <p class="tip-text">建议：请尝试使用Safari浏览器或检查Chrome的相机访问权限</p>
              </div>
              
              <!-- 针对移动设备的详细权限引导 -->
              <div v-if="permissionDeniedBefore && isMobile" class="permission-guide">
                <div class="permission-steps">
                  <div class="step-item">
                    <span class="step-number">1</span>
                    <span class="step-text">打开设备设置</span>
                  </div>
                  <div class="step-item">
                    <span class="step-number">2</span>
                    <span class="step-text">找到隐私/权限设置</span>
                  </div>
                  <div class="step-item">
                    <span class="step-number">3</span>
                    <span class="step-text">允许此网站访问摄像头</span>
                  </div>
                  <div class="step-item">
                    <span class="step-number">4</span>
                    <span class="step-text">重新打开页面或点击重试</span>
                  </div>
                </div>
              </div>
              
              <!-- 针对不支持错误的提示 -->
              <div v-if="errorMessage.includes('不支持') || errorMessage.includes('not supported')" class="browser-guide">
                <p style="font-size: 12px; margin-top: 8px;">
                  请尝试使用其他浏览器访问此页面
                </p>
              </div>
              
              <button 
                @click="retryCamera" 
                class="retry-button"
                :disabled="permissionRequestInProgress"
              >
                {{ permissionRequestInProgress ? '请求中...' : '重试' }}
              </button>
            </div>
            
            <!-- 相机提示文字 -->
            <div v-if="!hasCameraError" class="camera-instructions">
              <p>{{ isMobile ? '请将接送人置于框内拍摄' : '请将被接送人置于框内' }}</p>
            </div>
            
            <!-- 摄像头切换按钮 -->
            <button 
              v-if="!hasCameraError && isMobile" 
              @click="toggleCamera" 
              class="camera-toggle-button"
              :disabled="isSwitchingCamera"
            >
              切换摄像头
            </button>
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
            :disabled="hasCameraError || permissionRequestInProgress"
          >
            {{ permissionRequestInProgress ? '请求中...' : '拍照' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础容器样式 */
.native-camera-capture {
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
}

/* 相机错误提示 */
.camera-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;
  overflow-y: auto;
}

.camera-error .error-text {
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
  font-weight: 500;
}

.ios-tip {
  background-color: #fff9c4;
  border: 1px solid #ffeb3b;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
}

.tip-text {
  color: #f57c00;
  margin: 4px 0;
  font-size: 14px;
  text-align: left;
}

.permission-guide {
  margin-bottom: 20px;
  width: 100%;
}

/* 权限引导步骤样式 */
.permission-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 15px 0;
}

.step-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
}

.step-number {
  background-color: #3742fa;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}

.step-text {
  font-size: 13px;
  text-align: left;
  flex: 1;
}

.browser-guide {
  margin-bottom: 16px;
}

/* 摄像头切换按钮 */
.camera-toggle-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.camera-toggle-button:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.8);
}

.camera-toggle-button:disabled {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

/* 优化按钮样式 */
.capture-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
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

.retry-button:hover:not(:disabled) {
  background-color: #2f3542;
}

.retry-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
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