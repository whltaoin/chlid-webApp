<script setup lang="ts">
// 声明uni全局对象
declare const uni: any;

import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const cameraContext = ref<any>(null)
const isPreviewing = ref(false)
const hasPermission = ref(false)
const errorMessage = ref('')

// 检查相机权限
async function checkCameraPermission() {
  try {
    const { authSetting } = await uni.getSetting()
    if (authSetting['scope.camera']) {
      hasPermission.value = true
      return true
    } else {
      const { authSetting: newAuthSetting } = await uni.authorize({
        scope: 'scope.camera'
      })
      hasPermission.value = newAuthSetting['scope.camera']
      return newAuthSetting['scope.camera']
    }
  } catch (err) {
    errorMessage.value = '相机权限被拒绝，请在设置中允许访问'
    return false
  }
}

// 开始相机预览
async function startCameraPreview() {
  const hasPerm = await checkCameraPermission()
  if (!hasPerm) return
  
  try {
    // 在不同平台获取相机上下文
    if (typeof window !== 'undefined' && (window as any).plus) {
      // APP-PLUS平台
      const camera = document.getElementById('camera')
      if (camera) {
        cameraContext.value = (camera as HTMLCanvasElement).getContext('2d')
      }
    }
    
    isPreviewing.value = true
  } catch (err) {
    errorMessage.value = '相机启动失败'
    console.error('相机启动错误:', err)
  }
}

// 停止相机预览
function stopCameraPreview() {
  if (isPreviewing.value) {
    isPreviewing.value = false
  }
}

// 拍照功能
async function takePhoto() {
  try {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // H5环境下的拍照实现
      const canvas = document.createElement('canvas')
      const video = document.getElementById('camera') as HTMLVideoElement
      if (video) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = canvas.toDataURL('image/jpeg')
          // 保存照片或进行其他操作
          if (uni) {
            uni.showToast({
              title: '拍照成功',
              icon: 'success'
            })
          }
          // 可以将图片数据传递给父组件
          return imageData
        }
      }
    } else {
      // 非H5环境下的拍照实现
      const res = await uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera']
      })
      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        uni.showToast({
          title: '拍照成功',
          icon: 'success'
        })
        // 可以将图片路径传递给父组件
        return res.tempFilePaths[0]
      }
    }
  } catch (err) {
    errorMessage.value = '拍照失败'
    console.error('拍照错误:', err)
  }
}

// 生命周期钩子
onMounted(() => {
  if (userStore.isLoggedIn) {
    startCameraPreview()
  }
})

onUnmounted(() => {
  stopCameraPreview()
})

// 暴露方法给父组件
defineExpose({
  startCameraPreview,
  stopCameraPreview,
  takePhoto,
  hasPermission
})
</script>

<template>
  <view class="camera-preview-container">
    <!-- 错误提示 -->
    <view v-if="errorMessage" class="error-message">
      <text>{{ errorMessage }}</text>
    </view>
    
    <!-- 权限提示 -->
    <view v-else-if="!hasPermission" class="permission-tip">
      <text>需要相机权限才能使用此功能</text>
      <button class="primary-button" @click="checkCameraPermission">
        授权相机
      </button>
    </view>
    
    <!-- 相机预览区域 -->
    <view v-else class="camera-container">
      <!-- H5平台使用video标签 -->
      <video 
        v-if="isPreviewing" 
        id="camera"
        class="camera-video"
        autoplay 
        playsinline 
        muted 
        :width="320" 
        :height="240"
      ></video>
      
      <!-- 非H5平台使用camera组件 -->
      <camera 
        v-if="isPreviewing && typeof uni !== 'undefined' && uni.getSystemInfoSync && uni.getSystemInfoSync().platform !== 'h5'"
        id="camera"
        class="camera-video"
        device-position="back"
      ></camera>
      
      <!-- 控制按钮 -->
      <view class="camera-controls">
        <button 
          class="control-button"
          :class="{ active: isPreviewing }"
          @click="isPreviewing ? stopCameraPreview() : startCameraPreview()"
        >
          {{ isPreviewing ? '停止预览' : '开始预览' }}
        </button>
        <button 
          class="control-button primary-button"
          @click="takePhoto"
          :disabled="!isPreviewing"
        >
          拍照
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.camera-preview-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.error-message {
  padding: 15px;
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #f5222d;
  margin-bottom: 20px;
  text-align: center;
}

.permission-tip {
  padding: 40px 20px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.permission-tip text {
  display: block;
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
}

.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.camera-video {
  width: 100%;
  max-width: 320px;
  height: 240px;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.camera-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  width: 100%;
}

.control-button {
  flex: 1;
  padding: 12px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
}

.control-button.active {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.primary-button {
  background-color: #07C160;
  border-color: #07C160;
  color: #fff;
}

.primary-button:active {
  opacity: 0.8;
}

.control-button:disabled {
  background-color: #f5f5f5;
  color: #bfbfbf;
  border-color: #d9d9d9;
}
</style>