<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 定义儿童类型接口
interface Child {
  id: number;
  name: string;
  parentContact: string;
  checkedIn: boolean;
  checkInTime: string | null;
  imageUrl: string;
}

// 定义班级数据类型接口
interface ClassData {
  total: number;
  checkedIn: number;
  notCheckedIn: number;
}

const route = useRoute();
const router = useRouter();
const classId = computed(() => route.params.id as string);
const className = ref('');

// 返回上一页
const goBack = () => {
  router.back();
};

// 根据班级ID获取对应班级的儿童数据
const getChildrenDataByClassId = (classId: string): Child[] => {
  // 班级数据映射，与CheckInPage.vue保持一致，添加索引签名
  const classData: Record<string, ClassData> = {
    '1': { total: 25, checkedIn: 20, notCheckedIn: 5 },
    '2': { total: 22, checkedIn: 18, notCheckedIn: 4 },
    '3': { total: 28, checkedIn: 25, notCheckedIn: 3 },
    '4': { total: 30, checkedIn: 26, notCheckedIn: 4 },
    '5': { total: 32, checkedIn: 29, notCheckedIn: 3 },
    '6': { total: 30, checkedIn: 27, notCheckedIn: 3 }
  };
  
  const data = classData[classId] || { total: 5, checkedIn: 2, notCheckedIn: 3 };
  const childrenData: Child[] = [];
  const names = ['小明', '小红', '小华', '小丽', '小强', '小美', '小天', '小宇', '小轩', '小诺',
                 '小雅', '小宇', '小泽', '小萌', '小川', '小晴', '小阳', '小雨', '小风', '小云',
                 '小涵', '小宇', '小琳', '小然', '小宸', '小汐', '小航', '小安', '小茉', '小远',
                 '小诺', '小宝'];
  
  // 生成已入园的儿童
  for (let i = 1; i <= data.checkedIn; i++) {
    childrenData.push({
      id: i,
      name: names[i - 1] || `儿童${i}`,
      parentContact: `138001380${i.toString().padStart(3, '0')}`,
      checkedIn: true,
      checkInTime: `08:${(30 + Math.floor(Math.random() * 30)).toString().padStart(2, '0')}`,
      imageUrl: '/default-avatar.png'
    });
  }
  
  // 生成未入园的儿童
  for (let i = data.checkedIn + 1; i <= data.total; i++) {
    childrenData.push({
      id: i,
      name: names[i - 1] || `儿童${i}`,
      parentContact: `138001380${i.toString().padStart(3, '0')}`,
      checkedIn: false,
      checkInTime: null,
      imageUrl: '/default-avatar.png'
    });
  }
  
  return childrenData;
};

// 模拟儿童数据，根据班级ID动态生成，指定Child类型
const children = ref<Child[]>([]);

// 班级数据映射表，添加索引签名
const classDataMap: Record<string, { name: string }> = {
  '1': { name: '小班（苹果班）' },
  '2': { name: '小班（草莓班）' },
  '3': { name: '中班（橙子班）' },
  '4': { name: '中班（香蕉班）' },
  '5': { name: '大班（星星班）' },
  '6': { name: '大班（月亮班）' }
};

onMounted(() => {
  // 根据班级ID获取班级名称
  className.value = classDataMap[classId.value]?.name || '班级详情';
  
  // 根据班级ID加载对应儿童数据
  children.value = getChildrenDataByClassId(classId.value);
  
  // 排序：未入园的儿童排在前面
  sortChildren();
});

// 排序函数：未入园的排在前面
const sortChildren = () => {
  children.value.sort((a, b) => {
    // 未入园的排在前面
    if (!a.checkedIn && b.checkedIn) return -1;
    if (a.checkedIn && !b.checkedIn) return 1;
    return 0;
  });
};

// 计算未入园和已入园的数量
const getStats = () => {
  const checkedIn = children.value.filter(c => c.checkedIn).length;
  const notCheckedIn = children.value.filter(c => !c.checkedIn).length;
  return { checkedIn, notCheckedIn, total: children.value.length };
};
</script>

<template>
  <div class="class-detail-page">
    <div class="page-header">
      <button class="back-button" @click="goBack">
        ←
      </button>
      <h1>{{ className }}</h1>
    </div>
    
    <div class="stats-card">
      <div class="stat-item">
        <span class="stat-value">{{ getStats().total }}</span>
        <span class="stat-label">儿童总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ getStats().notCheckedIn }}</span>
        <span class="stat-label">未入园</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ getStats().checkedIn }}</span>
        <span class="stat-label">已入园</span>
      </div>
    </div>
    
    <div class="children-list">
      <h3>儿童列表</h3>
      <div class="children-card-container">
        <div 
          v-for="child in children" 
          :key="child.id"
          :class="['child-card', { 'not-checked': !child.checkedIn }]"
        >
          <div class="child-avatar-container">
            <div class="child-avatar"></div>
          </div>
          <div class="child-info">
            <h4 class="child-name">{{ child.name }}</h4>
            <p class="child-contact">家长电话: {{ child.parentContact }}</p>
            <div class="child-status">
              <span :class="child.checkedIn ? 'status-checked' : 'status-pending'">
                {{ child.checkedIn ? '已入园' : '未入园' }}
              </span>
              <span v-if="child.checkInTime" class="check-in-time">({{ child.checkInTime }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.class-detail-page {
  max-width: 1000px;
  margin: 0 auto 120px;
  padding: 80px 20px 20px; /* 添加顶部内边距，避免内容被固定头部遮挡 */
}

/* 页面头部样式 - 覆盖在顶部 */
.page-header {
  display: flex;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 1000;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 15px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #f5f5f5;
}

h1 {
  flex: 1;
  color: #333;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.stats-card {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: 0 10px;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #07c160;
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.children-list h3 {
  margin-bottom: 25px;
  color: #333;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.children-list h3::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 20px;
  background-color: #07c160;
  margin-right: 10px;
  border-radius: 4px;
}

/* 卡片式布局容器 */
.children-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 儿童信息卡片 */
.child-card {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #e0e0e0;
}

.child-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.child-card.not-checked {
  border-left-color: #ff9800;
  background-color: #fff8e1;
}

.child-card:not(.not-checked) {
  border-left-color: #07c160;
}

/* 头像容器 */
.child-avatar-container {
  margin-right: 15px;
}

/* 头像样式 */
.child-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 儿童信息部分 */
.child-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 姓名字体 */
.child-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 联系方式 */
.child-contact {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
}

/* 状态区域 */
.child-status {
  display: flex;
  align-items: center;
}

/* 状态文字 */
.status-checked {
  color: #07c160;
  font-weight: 600;
  font-size: 15px;
}

.status-pending {
  color: #ff9800;
  font-weight: 600;
  font-size: 15px;
}

/* 签到时间 */
.check-in-time {
  margin-left: 8px;
  color: #888;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-card {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-item {
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
  }
  
  .children-card-container {
    grid-template-columns: 1fr;
  }
  
  .child-card {
    padding: 15px;
  }
  
  .child-avatar {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .class-detail-page {
    padding: 15px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .child-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .child-avatar-container {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>