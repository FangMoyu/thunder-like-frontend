import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '~/types/api';

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<User | null>(null);
  // 是否已登录
  const isLoggedIn = ref(false);
  // 登录加载状态
  const loading = ref(false);
  // 是否已初始化
  const initialized = ref(false);
  
  // 本地存储键名
  const USER_INFO_KEY = 'user_info';
  const LOGIN_STATUS_KEY = 'login_status';
  
  // API
  const api = useApi();

  // 从本地存储加载用户信息
  const loadUserFromStorage = () => {
    try {
      if (process.client) { // 确保只在客户端执行
        const storedUserInfo = localStorage.getItem(USER_INFO_KEY);
        const storedLoginStatus = localStorage.getItem(LOGIN_STATUS_KEY);
        
        if (storedUserInfo) {
          userInfo.value = JSON.parse(storedUserInfo);
          console.log('从本地存储加载用户信息:', userInfo.value);
        }
        
        if (storedLoginStatus === 'true') {
          isLoggedIn.value = true;
          console.log('从本地存储加载登录状态:', isLoggedIn.value);
        }
      }
    } catch (error) {
      console.error('从本地存储加载用户信息失败', error);
    }
  };

  // 保存用户信息到本地存储
  const saveUserToStorage = () => {
    try {
      if (process.client) { // 确保只在客户端执行
        if (userInfo.value) {
          localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo.value));
          localStorage.setItem(LOGIN_STATUS_KEY, String(isLoggedIn.value));
          console.log('用户信息已保存到本地存储');
        } else {
          // 如果用户已退出，清除本地存储
          localStorage.removeItem(USER_INFO_KEY);
          localStorage.removeItem(LOGIN_STATUS_KEY);
          console.log('本地存储的用户信息已清除');
        }
      }
    } catch (error) {
      console.error('保存用户信息到本地存储失败', error);
    }
  };

  // 登录方法
  const login = async (userId: number) => {
    try {
      loading.value = true;
      const res = await api.login(userId);
      console.log('登录响应数据:', res);
      // 直接判断是否有数据，不检查code字段
      if (res && res.data) {
        userInfo.value = res.data;
        isLoggedIn.value = true;
        // 保存到本地存储
        saveUserToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 退出登录
  const logout = () => {
    userInfo.value = null;
    isLoggedIn.value = false;
    // 清除本地存储
    saveUserToStorage();
  };

  // 检查登录状态
  const checkLoginStatus = async () => {
    // 如果已初始化并且已登录，则不再检查
    if (initialized.value && isLoggedIn.value) {
      return true;
    }

    try {
      // 先尝试从本地存储加载
      loadUserFromStorage();
      
      // 如果本地存储中没有登录信息，则尝试从服务器获取
      if (!isLoggedIn.value) {
        try {
          const res = await api.getLoginUser();
          console.log('获取登录状态响应:', res);
          // 直接判断是否有数据，不检查code字段
          if (res && res.data) {
            userInfo.value = res.data;
            isLoggedIn.value = true;
            // 保存到本地存储
            saveUserToStorage();
          }
        } catch (error) {
          console.log('获取登录状态失败，可能未登录', error);
          // 错误处理已在 fetchApi 中完成，这里不再额外处理
        }
      }

      initialized.value = true;
      return isLoggedIn.value;
    } catch (error) {
      console.error('检查登录状态失败', error);
      initialized.value = true;
      return false;
    }
  };

  // 尝试立即从本地存储加载用户信息
  if (process.client) {
    loadUserFromStorage();
  }

  return {
    userInfo,
    isLoggedIn,
    loading,
    initialized,
    login,
    logout,
    checkLoginStatus,
  };
}); 