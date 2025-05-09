import type { BlogDetailResponse, BlogListResponse, BooleanResponse, DoThumbRequest, UserResponse } from '~/types/api';
import { ElMessage } from 'element-plus';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
  const toast = useToast();

  // 从本地存储获取用户ID
  const getUserId = (): number | null => {
    if (process.client) {
      try {
        const userInfoStr = localStorage.getItem('user_info');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          return userInfo?.id || null;
        }
      } catch (e) {
        console.error('获取用户ID失败', e);
      }
    }
    return null;
  };

  // 通用请求方法
  const fetchApi = async <T>(endpoint: string, options: any = {}) => {
    try {
      const url = `${baseURL}${endpoint}`;
      
      // 获取用户ID
      const userId = getUserId();
      
      // 准备请求选项
      const requestOptions = {
        // 确保包含 Cookie
        credentials: 'include',
        // 添加默认和自定义请求头
        headers: {
          'Content-Type': 'application/json',
          ...(userId ? { 'X-User-ID': userId.toString() } : {}),
          ...options.headers
        },
        ...options
      };
      
      console.log('发送请求:', url, requestOptions);
      const response = await $fetch<T>(url, requestOptions);
      console.log('API响应:', response);
      return response;
    } catch (error: any) {
      console.error('API请求错误:', error);
      if (error.response?.status === 401) {
        toast.error('请先登录');
        navigateTo('/login');
      } else {
        toast.error(`请求错误: ${error.message || '未知错误'}`);
      }
      throw error;
    }
  };

  // 博客相关API
  const getBlogList = () => fetchApi<BlogListResponse>('/blog/list');
  
  const getBlogDetail = (blogId: number) => 
    fetchApi<BlogDetailResponse>(`/blog/get`, {
      query: { blogId }
    });

  // 用户相关API
  const login = (userId: number) => 
    fetchApi<UserResponse>(`/user/login`, {
      query: { userId }
    });
  
  const getLoginUser = () => 
    fetchApi<UserResponse>('/user/get/login');

  // 点赞相关API
  const doThumb = (blogId: number) => 
    fetchApi<BooleanResponse>('/thumb/do', {
      method: 'POST',
      body: { blogId } as DoThumbRequest
    });
  
  const cancelThumb = (blogId: number) => 
    fetchApi<BooleanResponse>('/thumb/undo', {
      method: 'POST',
      body: { blogId } as DoThumbRequest
    });

  return {
    getBlogList,
    getBlogDetail,
    login,
    getLoginUser,
    doThumb,
    cancelThumb
  };
};

// 简单的Toast提示
export const useToast = () => {
  return {
    success: (message: string) => ElMessage.success(message),
    error: (message: string) => ElMessage.error(message),
    warning: (message: string) => ElMessage.warning(message),
    info: (message: string) => ElMessage.info(message)
  };
}; 