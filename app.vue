<template>
  <div>
    <!-- 全局加载状态 -->
    <div v-if="loading" class="global-loading">
      <el-card class="loading-card">
        <div class="loading-content">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>正在验证登录状态...</p>
        </div>
      </el-card>
    </div>
    
    <!-- 应用内容 -->
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { Loading } from '@element-plus/icons-vue';

// 全局加载状态
const loading = ref(true);

// 页面加载时自动检查登录状态
onMounted(async () => {
  const userStore = useUserStore();
  await userStore.checkLoginStatus();
  loading.value = false;
});
</script>

<style>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-card {
  min-width: 300px;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.loading-icon {
  font-size: 24px;
  margin-bottom: 10px;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
