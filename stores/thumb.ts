import { defineStore } from 'pinia';
import { ref } from 'vue';
import { debounce } from 'lodash';
import { useApi } from '~/composables/useApi';
import { useBlogStore } from './blog';
import { useUserStore } from './user';

export const useThumbStore = defineStore('thumb', () => {
  // 是否正在处理点赞
  const loading = ref(false);
  
  // API
  const api = useApi();
  
  // 使用防抖函数处理点赞
  const debouncedDoThumb = debounce(async (blogId: number) => {
    const userStore = useUserStore();
    const blogStore = useBlogStore();
    
    // 如果未登录，则不能点赞
    if (!userStore.isLoggedIn) {
      const toast = useToast();
      toast.warning('请先登录');
      return false;
    }
    
    try {
      loading.value = true;
      const res = await api.doThumb(blogId);
      console.log('点赞响应:', res);
      // 直接判断是否有数据，不检查code字段
      if (res && res.data) {
        // 更新博客的点赞状态
        blogStore.updateBlogThumbState(blogId, true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('点赞失败', error);
      return false;
    } finally {
      loading.value = false;
    }
  }, 300);
  
  // 使用防抖函数处理取消点赞
  const debouncedCancelThumb = debounce(async (blogId: number) => {
    const userStore = useUserStore();
    const blogStore = useBlogStore();
    
    // 如果未登录，则不能取消点赞
    if (!userStore.isLoggedIn) {
      const toast = useToast();
      toast.warning('请先登录');
      return false;
    }
    
    try {
      loading.value = true;
      const res = await api.cancelThumb(blogId);
      console.log('取消点赞响应:', res);
      // 直接判断是否有数据，不检查code字段
      if (res && res.data) {
        // 更新博客的点赞状态
        blogStore.updateBlogThumbState(blogId, false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('取消点赞失败', error);
      return false;
    } finally {
      loading.value = false;
    }
  }, 300);

  return {
    loading,
    doThumb: debouncedDoThumb,
    cancelThumb: debouncedCancelThumb,
  };
}); 