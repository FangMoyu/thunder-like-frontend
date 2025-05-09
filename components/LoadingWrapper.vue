<template>
  <div class="loading-wrapper">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="rows" animated />
      <div class="loading-text">{{ loadingText }}</div>
    </div>
    
    <div v-else-if="error" class="error-state">
      <el-empty 
        description="加载失败" 
        :image-size="200"
      >
        <template #description>
          <p>{{ errorMessage || '数据加载失败，请重试' }}</p>
        </template>
        <el-button v-if="onRetry" type="primary" @click="onRetry">
          重新加载
        </el-button>
      </el-empty>
    </div>
    
    <div v-else-if="isEmpty" class="empty-state">
      <el-empty 
        description="暂无数据" 
        :image-size="200"
      >
        <template #description>
          <p>{{ emptyMessage || '暂无数据' }}</p>
        </template>
      </el-empty>
    </div>
    
    <div v-else class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  isEmpty: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 5
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  errorMessage: {
    type: String,
    default: ''
  },
  emptyMessage: {
    type: String,
    default: ''
  },
  onRetry: {
    type: Function,
    default: null
  }
});
</script>

<style lang="scss" scoped>
.loading-wrapper {
  width: 100%;
  min-height: 200px;
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .loading-text {
    margin-top: 16px;
    color: #909399;
    font-size: 14px;
    text-align: center;
  }
}
</style> 