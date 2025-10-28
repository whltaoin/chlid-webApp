<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 定义危险行为类型接口
interface DangerBehavior {
  id: number;
  behaviorName: string;
  location: string;
  childName: string;
  className: string;
  occurrenceTime: string;
  severity: '低' | '中' | '高';
  imageUrl: string; // 危险行为图片URL
}

// 模拟危险行为数据
const dangerBehaviors = ref<DangerBehavior[]>([]);

// 生成模拟数据的函数
const generateMockData = (): DangerBehavior[] => {
  const behaviors = [
    '攀爬高处', '奔跑过快', '推搡同学', '玩尖锐物品', 
    '玩火', '玩水', '私自离开教室', '不按规定使用教具',
    '在走廊追逐', '打架斗殴', '不服从老师指令', '挑食严重'
  ];
  
  const locations = ['教室', '操场', '走廊', '卫生间', '活动室', '餐厅'];
  
  const classNames = ['小班（苹果班）', '小班（草莓班）', '中班（橙子班）', 
                    '中班（香蕉班）', '大班（星星班）', '大班（月亮班）'];
  
  const childNames = ['小明', '小红', '小华', '小丽', '小强', '小美', '小天', 
                     '小宇', '小轩', '小诺', '小雅', '小泽', '小萌', '小川', 
                     '小晴', '小阳', '小雨', '小风', '小云', '小涵'];
  
  const severities: ('低' | '中' | '高')[] = ['低', '中', '高'];
  
  const data: DangerBehavior[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const hour = Math.floor(Math.random() * 7) + 8; // 8-14点
    const minute = Math.floor(Math.random() * 60);
    
    // 随机生成一个模拟的图片URL（使用picsum.photos服务）
    const randomImageId = Math.floor(Math.random() * 1000);
    
    data.push({
      id: i,
      behaviorName: behaviors[Math.floor(Math.random() * behaviors.length)]!,
      location: locations[Math.floor(Math.random() * locations.length)]!,
      childName: childNames[Math.floor(Math.random() * childNames.length)]!,
      className: classNames[Math.floor(Math.random() * classNames.length)]!,
      occurrenceTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      severity: severities[Math.floor(Math.random() * severities.length)]!,
      imageUrl: `https://picsum.photos/id/${randomImageId}/300/200`
    });
  }
  
  // 按时间倒序排序
  return data.sort((a, b) => b.occurrenceTime.localeCompare(a.occurrenceTime));
};

// 组件挂载时加载数据
onMounted(() => {
  dangerBehaviors.value = generateMockData();
});

// 获取严重程度对应的样式类名
const getSeverityClass = (severity: string): string => {
  switch (severity) {
    case '低': return 'severity-low';
    case '中': return 'severity-medium';
    case '高': return 'severity-high';
    default: return '';
  }
};
</script>

<template>
  <div class="danger-behavior-page">
    <h1>危险行为提醒</h1>
    
    <div class="behavior-list">
      <div 
        v-for="behavior in dangerBehaviors" 
        :key="behavior.id"
        class="behavior-item"
      >
        <div class="behavior-content">
          <div class="behavior-header">
            <h3 class="behavior-name">{{ behavior.behaviorName }}</h3>
            <span :class="['severity-badge', getSeverityClass(behavior.severity)]">
              {{ behavior.severity }}风险
            </span>
          </div>
          
          <div class="behavior-details">
            <div class="detail-item">
              <span class="detail-label">地点：</span>
              <span class="detail-value">{{ behavior.location }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">儿童：</span>
              <span class="detail-value">{{ behavior.childName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">班级：</span>
              <span class="detail-value">{{ behavior.className }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">时间：</span>
              <span class="detail-value">{{ behavior.occurrenceTime }}</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧图片区域 -->
        <div class="behavior-image-container">
          <img :src="behavior.imageUrl" :alt="behavior.behaviorName" class="behavior-image">
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="dangerBehaviors.length === 0" class="empty-state">
        <p>暂无危险行为记录</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.danger-behavior-page {
  max-width: 1000px;
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

.behavior-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.behavior-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #ff4757;
  transition: all 0.3s ease;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.behavior-content {
  flex: 1;
}

.behavior-image-container {
  width: 300px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.behavior-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.behavior-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.behavior-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.behavior-name {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.severity-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.severity-low {
  background-color: #2ed573;
}

.severity-medium {
  background-color: #ffa502;
}

.severity-high {
  background-color: #ff4757;
}

.behavior-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.detail-label {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .danger-behavior-page {
    padding: 15px;
  }
  
  .behavior-item {
    flex-direction: column;
  }
  
  .behavior-image-container {
    width: 100%;
    height: 180px;
  }
  
  .behavior-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .behavior-details {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .behavior-name {
    font-size: 16px;
  }
}
</style>