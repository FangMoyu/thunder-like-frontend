<template>
  <div class="user-panel">
    <template v-if="userStore.isLoggedIn">
      <el-dropdown>
        <el-button type="primary">
          {{ userStore.userInfo?.username }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <el-button v-else type="primary" @click="dialogVisible = true">
      登录
    </el-button>

    <!-- 登录对话框 -->
    <el-dialog
      v-model="dialogVisible"
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
          <el-button @click="dialogVisible = false">取消</el-button>
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
import { ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '~/stores/user';
import { useToast } from '~/composables/useApi';

const userStore = useUserStore();
const toast = useToast();
const dialogVisible = ref(false);
const loginForm = ref({
  userId: null as number | null
});

// 组件挂载时检查登录状态
onMounted(async () => {
  await userStore.checkLoginStatus();
  console.log('UserPanel - 登录状态:', userStore.isLoggedIn, userStore.userInfo);
});

// 登录方法
const login = async () => {
  if (!loginForm.value.userId) {
    toast.warning('请输入用户ID');
    return;
  }
  
  const success = await userStore.login(loginForm.value.userId);
  if (success) {
    dialogVisible.value = false;
    toast.success('登录成功');
    loginForm.value.userId = null;
  } else {
    toast.error('登录失败，请重试');
  }
};

// 退出登录
const logout = () => {
  userStore.logout();
  toast.success('已退出登录');
};
</script>

<style lang="scss" scoped>
.user-panel {
  display: flex;
  align-items: center;
}
</style> 