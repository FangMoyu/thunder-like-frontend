# 博客点赞系统

一个使用 Nuxt.js 3 + Vue 3 + Element Plus + TypeScript 构建的现代化博客点赞系统前端项目。

![博客点赞系统](https://via.placeholder.com/800x400?text=Blog+Like+System)

## 项目介绍

本项目是一个博客点赞系统的前端实现，提供博客浏览、用户登录和点赞功能。系统采用响应式设计，可在不同设备上呈现良好的用户体验。

### 核心功能

- 博客列表与详情展示
- 用户登录与状态管理
- 博客点赞/取消点赞功能
- 浏览历史记录

## 技术栈

- **框架**: [Nuxt.js 3](https://nuxt.com/)
- **前端库**: [Vue 3](https://vuejs.org/)
- **UI组件库**: [Element Plus](https://element-plus.org/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **类型检查**: [TypeScript](https://www.typescriptlang.org/)
- **样式处理**: [SCSS](https://sass-lang.com/)
- **工具库**: [Lodash](https://lodash.com/)

## 项目特点

- **组件化设计**: 遵循Vue组件化最佳实践
- **类型安全**: 使用TypeScript确保代码类型安全
- **状态管理**: 使用Pinia进行高效状态管理
- **响应式布局**: 适配不同屏幕尺寸
- **API封装**: 统一封装API请求，易于维护
- **用户体验**: 加载状态、错误处理、动画效果等增强用户体验

## 项目结构

```
blog-system-nuxt/
├── assets/                     # 静态资源
│   └── scss/                   # SCSS样式文件
│       └── main.scss           # 主样式文件
├── components/                 # 可复用组件
│   ├── BlogCard.vue            # 博客卡片组件
│   ├── LoadingWrapper.vue      # 加载状态包装组件
│   ├── ThumbButton.vue         # 点赞按钮组件
│   └── UserPanel.vue           # 用户面板组件
├── composables/                # 组合式API
│   └── useApi.ts               # API请求封装
├── layouts/                    # 布局组件
│   └── default.vue             # 默认布局
├── pages/                      # 路由页面
│   ├── blog/                   # 博客相关页面
│   │   ├── [id].vue            # 博客详情页
│   │   └── index.vue           # 博客列表页
│   └── index.vue               # 主页
├── plugins/                    # 插件
│   └── element-plus.ts         # Element Plus配置
├── stores/                     # 状态管理
│   ├── blog.ts                 # 博客状态
│   ├── thumb.ts                # 点赞状态
│   └── user.ts                 # 用户状态
├── types/                      # 类型定义
│   └── api.ts                  # API类型
├── app.vue                     # 应用入口
└── nuxt.config.ts              # Nuxt配置
```

## 安装与运行

### 环境要求

- Node.js 16.x 或更高版本
- npm 7.x 或更高版本

### 安装步骤

1. 克隆项目仓库

```bash
git clone https://github.com/YourUsername/blog-system-nuxt.git
cd blog-system-nuxt
```

2. 安装依赖

```bash
npm install
```

3. 开发模式运行

```bash
npm run dev
```

4. 生产构建

```bash
npm run build
```

5. 预览生产构建

```bash
npm run preview
```

## 核心组件说明

### BlogCard

博客卡片组件，用于在列表页展示博客预览信息，包含标题、摘要、封面图片及点赞按钮。

### ThumbButton

点赞按钮组件，处理点赞交互和状态显示，带有点赞动画效果。

### UserPanel

用户信息面板，显示用户登录状态，提供登录和退出功能。

### LoadingWrapper

通用加载状态组件，统一处理加载中、错误状态、空数据状态等。

## API 文档

系统通过 `useApi` 组合式函数封装了与后端的交互：

- `/blog/list` - 获取博客列表
- `/blog/get` - 获取博客详情
- `/user/login` - 用户登录
- `/user/get/login` - 获取当前登录用户
- `/thumb/do` - 点赞博客
- `/thumb/undo` - 取消点赞

## 状态管理

使用 Pinia 进行状态管理：

- `blog.ts` - 管理博客列表和详情数据
- `user.ts` - 管理用户登录状态和信息
- `thumb.ts` - 管理点赞相关状态和操作

## 功能展示

### 博客列表

![博客列表](https://via.placeholder.com/600x400?text=Blog+List)

### 博客详情

![博客详情](https://via.placeholder.com/600x400?text=Blog+Detail)

### 用户登录

![用户登录](https://via.placeholder.com/400x300?text=User+Login)

## 浏览器兼容性

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题或建议，请提交 issue 或发送邮件至 your.email@example.com
