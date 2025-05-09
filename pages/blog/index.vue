<template>
  <div>
    <!-- 未登录提示 -->
    <el-card v-if="!userStore.isLoggedIn && !loading" class="login-required-card">
      <div class="login-required-content">
        <el-icon class="login-icon"><UserFilled /></el-icon>
        <h2>请先登录</h2>
        <p>您需要登录后才能查看博客内容</p>
        <el-button type="primary" @click="showLoginDialog">
          立即登录
        </el-button>
      </div>
    </el-card>

    <!-- 已登录内容 -->
    <div v-else-if="userStore.isLoggedIn && !loading">
      <h1 class="page-title">博客列表</h1>
      
      <LoadingWrapper
        :loading="blogStore.loading"
        :is-empty="!blogStore.loading && blogStore.blogList.length === 0"
        empty-message="暂无博客数据"
        :on-retry="fetchBlogs"
      >
        <div class="blog-grid">
          <BlogCard 
            v-for="blog in blogStore.blogList" 
            :key="blog.id" 
            :blog="blog" 
          />
        </div>
      </LoadingWrapper>
    </div>

    <!-- 加载中 -->
    <div v-else class="loading-state">
      <el-skeleton :rows="5" animated />
      <div class="loading-text">加载中...</div>
    </div>

    <!-- 登录对话框 -->
    <el-dialog
      v-model="loginDialogVisible"
      title="用户登录"
      width="400px"
      center
      destroy-on-close
    >
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户ID">
          <el-input v-model.number="loginForm.userId" type="number" placeholder="请输入用户ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="login" :loading="userStore.loading">
            登录
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import { useBlogStore } from '~/stores/blog';
import { useUserStore } from '~/stores/user';
import { useToast } from '~/composables/useApi';

definePageMeta({
  layout: 'default'
});

const blogStore = useBlogStore();
const userStore = useUserStore();
const toast = useToast();

// 页面状态
const loading = ref(true);
const loginDialogVisible = ref(false);
const loginForm = ref({
  userId: null as number | null
});

// 显示登录对话框
const showLoginDialog = () => {
  loginDialogVisible.value = true;
};

// 登录方法
const login = async () => {
  if (!loginForm.value.userId) {
    toast.warning('请输入用户ID');
    return;
  }
  
  const success = await userStore.login(loginForm.value.userId);
  if (success) {
    loginDialogVisible.value = false;
    toast.success('登录成功');
    loginForm.value.userId = null;
    // 登录成功后加载博客列表
    await fetchBlogs();
  } else {
    toast.error('登录失败，请重试');
  }
};

// 获取博客列表
const fetchBlogs = async () => {
  await blogStore.fetchBlogList();
};

// 组件挂载时，获取用户登录状态和博客列表
onMounted(async () => {
  loading.value = true;
  
  // 检查用户登录状态
  await userStore.checkLoginStatus();
  
  // 如果已登录，加载博客列表
  if (userStore.isLoggedIn) {
    await fetchBlogs();
  }
  
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

.login-required-card {
  max-width: 500px;
  margin: 50px auto;
}

.login-required-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
  
  .login-icon {
    font-size: 40px;
    color: var(--el-color-primary);
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
}

.loading-state {
  padding: 20px;
  
  .loading-text {
    margin-top: 16px;
    text-align: center;
    color: #909399;
  }
}
</style> 