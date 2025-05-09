<template>
  <div class="card blog-card">
    <NuxtLink :to="`/blog/${blog.id}`">
      <div class="blog-cover">
        <el-image 
          :src="blog.coverImg || defaultCoverImg" 
          :alt="blog.title"
          fit="cover"
          loading="lazy"
        />
      </div>
      <div class="blog-content">
        <h3 class="blog-title">{{ blog.title }}</h3>
        <p class="blog-date">{{ formatDate(blog.createTime) }}</p>
        <p class="blog-excerpt">{{ excerpt }}</p>
      </div>
    </NuxtLink>
    <div class="blog-actions">
      <ThumbButton 
        :blog-id="blog.id" 
        :has-thumb="blog.hasThumb"
        :count="blog.thumbCount" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogVO } from '~/types/api';

// 接收博客数据作为Props
const props = defineProps<{
  blog: BlogVO;
}>();

// 默认封面图
const defaultCoverImg = 'https://via.placeholder.com/600x400?text=Blog';

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 博客摘要
const excerpt = computed(() => {
  if (!props.blog.content) return '';
  return props.blog.content.length > 100
    ? props.blog.content.substring(0, 100) + '...'
    : props.blog.content;
});
</script>

<style lang="scss" scoped>
.blog-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .blog-cover {
    height: 200px;
    overflow: hidden;
    
    .el-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .blog-content {
    padding: 16px;
    flex: 1;
    
    .blog-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .blog-date {
      font-size: 14px;
      color: #999;
      margin-bottom: 8px;
    }
    
    .blog-excerpt {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  
  .blog-actions {
    padding: 12px 16px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 