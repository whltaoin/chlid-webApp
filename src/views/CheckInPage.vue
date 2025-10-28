<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定义当前日期
const checkInDate = ref('');

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
  router.push(`/class/${classId}`);
};

// 计算全园的签到统计
const getOverallStats = () => {
  const total = classes.value.reduce((sum, cls) => sum + cls.total, 0);
  const checkedIn = classes.value.reduce((sum, cls) => sum + cls.checkedIn, 0);
  const notCheckedIn = classes.value.reduce((sum, cls) => sum + cls.notCheckedIn, 0);
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  return { total, checkedIn, notCheckedIn, rate };
};
</script>

<template>
  <div class="check-in-page">
    <h1>入离园管理</h1>
    
    <div class="check-in-header">
      <div class="date-info">
        <h2>{{ checkInDate }}</h2>
        <p class="subtitle">幼儿园班级签到总览</p>
      </div>
      
      <div class="overall-stats">
        <div class="stat-item">
          <span class="stat-value">{{ getOverallStats().total }}</span>
          <span class="stat-label">全园总数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ getOverallStats().notCheckedIn }}</span>
          <span class="stat-label">未入园</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ getOverallStats().rate }}%</span>
          <span class="stat-label">入园率</span>
        </div>
      </div>
    </div>
    
    <div class="classes-section">
      <h3>班级列表</h3>
      <div class="classes-grid">
        <div 
          v-for="cls in classes" 
          :key="cls.id"
          class="class-card"
          @click="navigateToClassDetail(cls.id)"
          :style="{ borderTop: `4px solid ${cls.color}` }"
        >
          <div class="class-header">
            <h4 class="class-name">{{ cls.name }}</h4>
            <span class="arrow-icon">›</span>
          </div>
          
          <div class="class-stats">
            <div class="stat-row">
              <span class="stat-label">儿童总数：</span>
              <span class="stat-value">{{ cls.total }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">已入园：</span>
              <span class="stat-value checked">{{ cls.checkedIn }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">未入园：</span>
              <span class="stat-value pending">{{ cls.notCheckedIn }}</span>
            </div>
          </div>
          
          <div class="check-in-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ 
                  width: `${(cls.checkedIn / cls.total) * 100}%`,
                  backgroundColor: cls.color 
                }"
              ></div>
            </div>
            <div class="progress-text">{{ Math.round((cls.checkedIn / cls.total) * 100) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.check-in-page {
  max-width: 1000px;
  margin: 0 auto 120px;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
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

.date-info h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.date-info .subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.overall-stats {
  display: flex;
  gap: 30px;
  background-color: #f7f7f7;
  padding: 20px;
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

.classes-section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
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
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.class-card:hover {
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
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.arrow-icon {
  font-size: 24px;
  color: #999;
  transition: color 0.3s;
}

.class-card:hover .arrow-icon {
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