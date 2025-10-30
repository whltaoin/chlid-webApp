<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CameraPreview from '../components/CameraPreview.vue';

// 声明uni全局对象
declare const uni: any;


// 定义当前日期
const checkInDate = ref('');
const showCameraModal = ref(false);
const selectedChild = ref<any>(null);
const selectedClassId = ref('');

// 模拟6个班级数据
const classes = ref([
  {
    id: '1',
    name: '小班（苹果班）',
    total: 25,
    checkedIn: 20,
    notCheckedIn: 5,
    color: '#FF9999'
  },
  {
    id: '2',
    name: '小班（草莓班）',
    total: 22,
    checkedIn: 18,
    notCheckedIn: 4,
    color: '#FFB7DD'
  },
  {
    id: '3',
    name: '中班（橙子班）',
    total: 28,
    checkedIn: 25,
    notCheckedIn: 3,
    color: '#FFD700'
  },
  {
    id: '4',
    name: '中班（香蕉班）',
    total: 30,
    checkedIn: 26,
    notCheckedIn: 4,
    color: '#FFFF99'
  },
  {
    id: '5',
    name: '大班（星星班）',
    total: 32,
    checkedIn: 29,
    notCheckedIn: 3,
    color: '#99CCFF'
  },
  {
    id: '6',
    name: '大班（月亮班）',
    total: 30,
    checkedIn: 27,
    notCheckedIn: 3,
    color: '#CC99FF'
  }
]);

// 模拟学生数据
interface Child {
  id: string;
  name: string;
  status: 'checkedIn' | 'notCheckedIn';
  avatar: string;
}

// 模拟学生数据
const childrenByClass = ref<Record<string, Child[]>>({
  '1': [
    { id: '101', name: '小明', status: 'checkedIn', avatar: '👶' },
    { id: '102', name: '小红', status: 'checkedIn', avatar: '👧' },
    { id: '103', name: '小刚', status: 'notCheckedIn', avatar: '🧒' },
    // 更多学生...
  ],
  // 其他班级学生...
});

// 初始化页面
onMounted(() => {
  // 设置当前日期
  const today = new Date();
  checkInDate.value = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// 点击班级卡片跳转到班级详情页
const navigateToClassDetail = (classId: string) => {
  // 使用uni-app的导航API
  if (typeof uni !== 'undefined' && uni.navigateTo) {
    uni.navigateTo({
      url: `/views/ClassDetailPage?id=${classId}`
    });
  }
};

// 打开相机进行签到
const openCameraForCheckIn = (classId: string, child?: any) => {
  selectedClassId.value = classId;
  selectedChild.value = child;
  showCameraModal.value = true;
};

// 处理签到成功
const handleCheckInSuccess = async () => {
  // 这里可以调用API上传照片并完成签到
  try {
    // 模拟签到过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新班级和学生状态
    if (selectedClassId.value && classes.value.length > 0) {
      const targetClass = classes.value.find(cls => cls.id === selectedClassId.value);
      if (targetClass) {
        targetClass.checkedIn += 1;
        targetClass.notCheckedIn -= 1;
      }
    }
    
    if (selectedChild.value && childrenByClass.value[selectedClassId.value]) {
      // 安全地访问数组并查找子项
      const childrenArray = childrenByClass.value[selectedClassId.value] || [];
      const child = childrenArray.find((c: any) => c.id === selectedChild.value.id);
      if (child) {
        child.status = 'checkedIn';
      }
    }
    
    if (typeof uni !== 'undefined' && uni.showToast) {
      uni.showToast({
        title: '签到成功',
        icon: 'success',
        duration: 2000
      });
    }
    
    showCameraModal.value = false;
  } catch (error) {
    if (typeof uni !== 'undefined' && uni.showToast) {
      uni.showToast({
        title: '签到失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  }
};

// 计算全园的签到统计
const getOverallStats = () => {
  const total = classes.value.reduce((sum, cls) => sum + cls.total, 0);
  const checkedIn = classes.value.reduce((sum, cls) => sum + cls.checkedIn, 0);
  const notCheckedIn = classes.value.reduce((sum, cls) => sum + cls.notCheckedIn, 0);
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  return { total, checkedIn, notCheckedIn, rate };
};

// 相机组件引用
const cameraRef = ref<any>(null);

// 处理签到
async function handleCheckIn() {
  if (cameraRef.value) {
    try {
      // 调用相机组件的拍照方法
      const imageData = await cameraRef.value.takePhoto();
      if (imageData) {
        // 处理签到成功
        await handleCheckInSuccess();
      }
    } catch (error) {
      if (typeof uni !== 'undefined' && uni.showToast) {
        uni.showToast({
          title: '签到失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    }
  }
}
</script>

<template>
  <view class="check-in-page">
    <view class="page-header">
      <text class="page-title">入离园管理</text>
      <button class="quick-checkin-btn" @click="openCameraForCheckIn('')">
        快速签到
      </button>
    </view>
    
    <view class="check-in-header">
      <view class="date-info">
        <text class="date-text">{{ checkInDate }}</text>
        <text class="subtitle">幼儿园班级签到总览</text>
      </view>
      
      <view class="overall-stats">
        <view class="stat-item">
          <text class="stat-value">{{ getOverallStats().total }}</text>
          <text class="stat-label">全园总数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ getOverallStats().notCheckedIn }}</text>
          <text class="stat-label">未入园</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ getOverallStats().rate }}%</text>
          <text class="stat-label">入园率</text>
        </view>
      </view>
    </view>
    
    <view class="classes-section">
      <text class="section-title">班级列表</text>
      <view class="classes-grid">
        <view 
          v-for="cls in classes" 
          :key="cls.id"
          class="class-card"
          @click="navigateToClassDetail(cls.id)"
          :style="{ borderTop: `4px solid ${cls.color}` }"
        >
          <view class="class-header">
            <text class="class-name">{{ cls.name }}</text>
            <text class="arrow-icon">›</text>
          </view>
          
          <view class="class-stats">
            <view class="stat-row">
              <text class="stat-label">儿童总数：</text>
              <text class="stat-value">{{ cls.total }}</text>
            </view>
            <view class="stat-row">
              <text class="stat-label">已入园：</text>
              <text class="stat-value checked">{{ cls.checkedIn }}</text>
            </view>
            <view class="stat-row">
              <text class="stat-label">未入园：</text>
              <text class="stat-value pending">{{ cls.notCheckedIn }}</text>
            </view>
          </view>
          
          <view class="check-in-progress">
            <view class="progress-bar">
              <view 
                class="progress-fill" 
                :style="{ 
                  width: `${(cls.checkedIn / cls.total) * 100}%`,
                  backgroundColor: cls.color 
                }"
              ></view>
            </view>
            <text class="progress-text">{{ Math.round((cls.checkedIn / cls.total) * 100) }}%</text>
          </view>
          
          <!-- 一键签到按钮 -->
          <button 
            class="class-checkin-btn"
            :style="{ backgroundColor: cls.color }"
            @click.stop="openCameraForCheckIn(cls.id)"
          >
            班级签到
          </button>
        </view>
      </view>
    </view>
    
    <!-- 相机签到模态框 -->
    <uni-popup 
      v-model="showCameraModal" 
      type="bottom" 
      background-color="#fff"
      :animation="true"
    >
      <view class="camera-modal">
        <view class="modal-header">
          <text class="modal-title">
            {{ selectedChild ? `${selectedChild.name} 签到` : '班级签到' }}
          </text>
          <button class="close-btn" @click="showCameraModal = false">×</button>
        </view>
        
        <view class="camera-content">
          <CameraPreview ref="cameraRef" />
        </view>
        
        <view class="modal-actions">
          <button class="primary-button" @click="handleCheckIn">
            确认签到
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped>
.check-in-page {
  padding: 20px;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.quick-checkin-btn {
  background-color: #07C160;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
}

.check-in-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.date-info {
  flex: 1;
  min-width: 200px;
}

.date-text {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.overall-stats {
  display: flex;
  gap: 20px;
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-item .stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #07c160;
}

.stat-item .stat-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: block;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.class-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.class-card:active {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.class-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.arrow-icon {
  font-size: 24px;
  color: #999;
}

.class-card:active .arrow-icon {
  color: #07c160;
}

.class-stats {
  margin-bottom: 15px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-row .stat-label {
  color: #666;
  font-size: 14px;
}

.stat-row .stat-value {
  font-weight: 500;
  font-size: 14px;
}

.stat-row .stat-value.checked {
  color: #07c160;
}

.stat-row .stat-value.pending {
  color: #ff9800;
}

.check-in-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 40px;
  text-align: right;
}

.class-checkin-btn {
  width: 100%;
  padding: 12px;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

/* 相机模态框样式 */
.camera-modal {
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 30px;
  color: #999;
}

.camera-content {
  margin-bottom: 20px;
}

.modal-actions {
  margin-top: 20px;
}

.primary-button {
  width: 100%;
  padding: 15px;
  background-color: #07C160;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .check-in-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .overall-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .classes-grid {
    grid-template-columns: 1fr;
  }
}
</style>