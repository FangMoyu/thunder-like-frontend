<template>
  <div>
    <div class="blog-nav">
      <NuxtLink to="/blog" class="back-link">
        <el-icon><arrow-left /></el-icon> 返回列表
      </NuxtLink>
    </div>
    
    <!-- 未登录提示 -->
    <el-card v-if="!userStore.isLoggedIn && !loading" class="login-required-card">
      <div class="login-required-content">
        <el-icon class="login-icon"><UserFilled /></el-icon>
        <h2>请先登录</h2>
        <p>您需要登录后才能查看博客详情</p>
        <el-button type="primary" @click="showLoginDialog">
          立即登录
        </el-button>
      </div>
    </el-card>
    
    <!-- 已登录内容 -->
    <LoadingWrapper
      v-else-if="userStore.isLoggedIn && !loading"
      :loading="blogStore.loading"
      :error="!!error"
      :error-message="error"
      :on-retry="fetchBlogDetail"
    >
      <template v-if="blogStore.currentBlog">
        <div class="blog-detail">
          <div class="blog-header">
            <h1 class="blog-title">{{ blogStore.currentBlog.title }}</h1>
            <div class="blog-meta">
              <span class="blog-date">{{ formatDate(blogStore.currentBlog.createTime) }}</span>
              <div class="blog-actions">
                <ThumbButton 
                  :blog-id="blogStore.currentBlog.id" 
                  :has-thumb="blogStore.currentBlog.hasThumb" 
                  :count="blogStore.currentBlog.thumbCount"
                />
              </div>
            </div>
          </div>
          
          <div class="blog-cover">
            <el-image 
              :src="blogStore.currentBlog.coverImg || defaultCoverImg" 
              :alt="blogStore.currentBlog.title"
              fit="cover"
            />
          </div>
          
          <div class="blog-content">
            <p>{{ blogStore.currentBlog.content }}</p>
          </div>
        </div>
      </template>
    </LoadingWrapper>
    
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
import { useRoute } from 'vue-router';
import { ArrowLeft, UserFilled } from '@element-plus/icons-vue';
import { useBlogStore } from '~/stores/blog';
import { useUserStore } from '~/stores/user';
import { useToast } from '~/composables/useApi';

definePageMeta({
  layout: 'default'
});

const route = useRoute();
const blogStore = useBlogStore();
const userStore = useUserStore();
const toast = useToast();
const error = ref('');
const loading = ref(true);
const loginDialogVisible = ref(false);
const loginForm = ref({
  userId: null as number | null
});

// 默认封面图
const defaultCoverImg = 'https://via.placeholder.com/1200x600?text=Blog';

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
    // 登录成功后加载博客详情
    await fetchBlogDetail();
  } else {
    toast.error('登录失败，请重试');
  }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 获取博客详情
const fetchBlogDetail = async () => {
  try {
    error.value = '';
    const blogId = Number(route.params.id);
    if (isNaN(blogId)) {
      error.value = '无效的博客ID';
      return;
    }
    await blogStore.fetchBlogDetail(blogId);
  } catch (err) {
    error.value = '获取博客详情失败';
    console.error(err);
  }
};

// 组件挂载时，获取用户登录状态和博客详情
onMounted(async () => {
  loading.value = true;
  
  // 检查用户登录状态
  await userStore.checkLoginStatus();
  
  // 如果已登录，加载博客详情
  if (userStore.isLoggedIn) {
    await fetchBlogDetail();
  }
  
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.blog-nav {
  margin-bottom: 20px;
  
  .back-link {
    display: inline-flex;
    align-items: center;
    color: var(--el-color-primary);
    text-decoration: none;
    font-size: 16px;
    
    .el-icon {
      margin-right: 4px;
    }
    
    &:hover {
      text-decoration: underline;
    }
  }
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

.blog-detail {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  .blog-header {
    padding: 24px;
    
    .blog-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 16px;
      color: #333;
    }
    
    .blog-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .blog-date {
        color: #909399;
        font-size: 14px;
      }
    }
  }
  
  .blog-cover {
    width: 100%;
    height: 400px;
    overflow: hidden;
    
    .el-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .blog-content {
    padding: 24px;
    line-height: 1.8;
    font-size: 16px;
    color: #333;
  }
}
</style> 