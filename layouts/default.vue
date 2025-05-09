<template>
  <div class="app-layout">
    <el-container>
      <el-header height="60px">
        <div class="header-container">
          <div class="logo">
            <NuxtLink to="/">博客点赞系统</NuxtLink>
          </div>
          <div class="user-info">
            <UserPanel />
          </div>
        </div>
      </el-header>
      
      <el-main>
        <div class="page-container">
          <slot />
        </div>
      </el-main>
      
      <el-footer height="60px">
        <div class="footer-content">
          <p>© {{ new Date().getFullYear() }} 博客点赞系统 - 使用 Nuxt.js + Element Plus 构建</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 默认布局
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  
  .el-header {
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
    
    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      
      .logo {
        font-size: 20px;
        font-weight: bold;
        
        a {
          color: var(--el-color-primary);
          text-decoration: none;
        }
      }
    }
  }
  
  .el-main {
    padding: 20px;
    min-height: calc(100vh - 120px);
  }
  
  .el-footer {
    background-color: #f5f7fa;
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
      font-size: 14px;
    }
  }
}
</style> 