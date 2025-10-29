<template>
  <div class="expiry-warning-page">
    <div class="page-header">
      <h1>预警信息</h1>
    </div>
    
    <div class="warning-list">
      <div v-if="weeklyExpiryItems.length > 0" class="list-container">
        <div 
          v-for="item in weeklyExpiryItems" 
          :key="item.id" 
          class="warning-item"
        >
          <div class="item-header">
            <h3 class="item-name">{{ item.name }}</h3>
            <span class="expiry-badge">{{ item.warningLevel }}</span>
          </div>
          
          <div class="item-details">
            <div class="detail-row">
              <span class="detail-label">生产日期：</span>
              <span class="detail-value">{{ formatDate(item.productionDate) }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">保质期：</span>
              <span class="detail-value">{{ item.shelfLifeDays }}天</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">到期日期：</span>
              <span class="detail-value">{{ formatDate(item.expiryDate) }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">剩余天数：</span>
              <span 
                :class="['detail-value', getRemainingDaysClass(item.remainingDays)]"
              >
                {{ item.remainingDays }}天
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">📦</div>
        <p class="empty-text">本周暂无即将到期的物品</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 定义物品接口
interface Item {
  id: string;
  name: string;
  productionDate: Date;
  shelfLifeDays: number;
  expiryDate: Date;
  remainingDays: number;
  warningLevel: string;
}

// 模拟数据
const items = ref<Item[]>([]);

// 计算本周即将到期的物品
const weeklyExpiryItems = computed(() => {
  return items.value.filter(item => {
    // 只显示本周内即将到期的物品（剩余天数≤7天）
    return item.remainingDays >= 0 && item.remainingDays <= 7;
  });
});

// 格式化日期
const formatDate = (date: Date): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 根据剩余天数获取样式类
const getRemainingDaysClass = (days: number): string => {
  if (days <= 1) return 'critical';
  if (days <= 3) return 'warning';
  return 'info';
};

// 计算到期日期和剩余天数
const calculateExpiryData = (productionDate: Date, shelfLifeDays: number) => {
  // 深拷贝日期对象
  const prodDate = new Date(productionDate.getTime());
  const expiryDate = new Date(prodDate.setDate(prodDate.getDate() + shelfLifeDays));
  
  // 计算剩余天数
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 确定警告级别
  let warningLevel = '正常';
  if (remainingDays <= 1) warningLevel = '紧急';
  else if (remainingDays <= 3) warningLevel = '高风险';
  else if (remainingDays <= 7) warningLevel = '低风险';
  
  return {
    expiryDate,
    remainingDays,
    warningLevel
  };
};

// 生成模拟数据
const generateMockData = () => {
  const mockItems = [
    { id: '1', name: '牛奶', productionDate: new Date('2024-10-15'), shelfLifeDays: 7 },
    { id: '2', name: '面包', productionDate: new Date('2024-10-18'), shelfLifeDays: 3 },
    { id: '3', name: '水果罐头', productionDate: new Date('2024-10-10'), shelfLifeDays: 10 },
    { id: '4', name: '蔬菜沙拉', productionDate: new Date('2024-10-19'), shelfLifeDays: 2 },
    { id: '5', name: '饼干', productionDate: new Date('2024-10-12'), shelfLifeDays: 15 },
    { id: '6', name: '酸奶', productionDate: new Date('2024-10-17'), shelfLifeDays: 5 },
    { id: '7', name: '果酱', productionDate: new Date('2024-10-01'), shelfLifeDays: 30 },
    { id: '8', name: '巧克力', productionDate: new Date('2024-10-05'), shelfLifeDays: 20 }
  ];

  // 计算每个物品的到期信息
  items.value = mockItems.map(item => {
    const expiryData = calculateExpiryData(item.productionDate, item.shelfLifeDays);
    return {
      ...item,
      ...expiryData
    };
  });
};

// 页面加载时生成数据
onMounted(() => {
  generateMockData();
});
</script>

<style scoped>
.expiry-warning-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.warning-list {
  max-width: 800px;
  margin: 0 auto;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.warning-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.warning-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.expiry-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.expiry-badge[data-level="紧急"] {
  background-color: #f56c6c;
}

.expiry-badge[data-level="高风险"] {
  background-color: #e6a23c;
}

.expiry-badge[data-level="低风险"] {
  background-color: #67c23a;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
}

.detail-value {
  color: #303133;
  font-size: 14px;
}

.detail-value.critical {
  color: #f56c6c;
  font-weight: 600;
}

.detail-value.warning {
  color: #e6a23c;
  font-weight: 600;
}

.detail-value.info {
  color: #67c23a;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .expiry-warning-page {
    padding: 16px;
  }
  
  .warning-item {
    padding: 16px;
  }
  
  .item-name {
    font-size: 16px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .detail-label {
    min-width: auto;
  }
}
</style>