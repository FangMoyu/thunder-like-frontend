import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { BlogVO } from '~/types/api';
import { useApi } from '~/composables/useApi';

export const useBlogStore = defineStore('blog', () => {
  // 博客列表
  const blogList = ref<BlogVO[]>([]);
  // 是否正在加载
  const loading = ref(false);
  // 当前查看的博客详情
  const currentBlog = ref<BlogVO | null>(null);
  // 是否加载过博客列表
  const hasLoadedList = ref(false);
  
  // API
  const api = useApi();

  // 获取博客列表
  const fetchBlogList = async () => {
    try {
      loading.value = true;
      // 如果已经加载过并且有数据，则不重复加载
      if (hasLoadedList.value && blogList.value.length > 0) {
        return blogList.value;
      }
      
      const res = await api.getBlogList();
      console.log('获取博客列表响应:', res);
      // 直接判断是否有数据，不检查code字段
      if (res && res.data) {
        blogList.value = res.data;
        hasLoadedList.value = true;
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('获取博客列表失败', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // 获取博客详情
  const fetchBlogDetail = async (blogId: number) => {
    try {
      loading.value = true;
      const res = await api.getBlogDetail(blogId);
      console.log('获取博客详情响应:', res);
      // 直接判断是否有数据，不检查code字段
      if (res && res.data) {
        currentBlog.value = res.data;
        
        // 将访问记录保存到本地存储
        saveViewHistory(res.data);
        
        return res.data;
      }
      return null;
    } catch (error) {
      console.error('获取博客详情失败', error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 清除博客缓存
  const clearBlogCache = () => {
    blogList.value = [];
    hasLoadedList.value = false;
    currentBlog.value = null;
  };

  // 在列表中更新博客的点赞状态
  const updateBlogThumbState = (blogId: number, hasThumb: boolean) => {
    const blog = blogList.value.find(item => item.id === blogId);
    if (blog) {
      blog.hasThumb = hasThumb;
      // 更新点赞数
      if (blog.thumbCount !== undefined) {
        blog.thumbCount = hasThumb ? (blog.thumbCount + 1) : Math.max(0, blog.thumbCount - 1);
      }
    }
    
    // 同时更新当前查看的博客详情
    if (currentBlog.value && currentBlog.value.id === blogId) {
      currentBlog.value.hasThumb = hasThumb;
      // 更新点赞数
      if (currentBlog.value.thumbCount !== undefined) {
        currentBlog.value.thumbCount = hasThumb ? 
          (currentBlog.value.thumbCount + 1) : 
          Math.max(0, currentBlog.value.thumbCount - 1);
      }
    }
  };
  
  // 保存浏览历史到本地存储
  const saveViewHistory = (blog: BlogVO) => {
    try {
      const historyKey = 'blog_view_history';
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // 检查是否已经存在
      const index = history.findIndex((item: any) => item.id === blog.id);
      if (index !== -1) {
        // 更新访问时间
        history[index].viewTime = new Date().toISOString();
      } else {
        // 添加新记录
        history.push({
          id: blog.id,
          title: blog.title,
          viewTime: new Date().toISOString()
        });
      }
      
      // 只保留最近10条记录
      if (history.length > 10) {
        history.sort((a: any, b: any) => 
          new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime()
        );
        history.length = 10;
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('保存浏览历史失败', error);
    }
  };

  return {
    blogList,
    loading,
    currentBlog,
    hasLoadedList,
    fetchBlogList,
    fetchBlogDetail,
    clearBlogCache,
    updateBlogThumbState,
  };
}); 