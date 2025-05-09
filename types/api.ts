// 基础响应类型
export interface BaseResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
}

export type UserResponse = BaseResponse<User>;

// 博客相关类型
export interface Blog {
  id: number;
  userId: number;
  title: string;
  coverImg: string;
  content: string;
  thumbCount: number;
  createTime: string;
  updateTime: string;
}

export interface BlogVO {
  id: number;
  title: string;
  coverImg: string;
  content: string;
  createTime: string;
  hasThumb: boolean;
  thumbCount?: number; // 添加点赞数字段，后端可能没有直接返回
}

export type BlogListResponse = BaseResponse<BlogVO[]>;
export type BlogDetailResponse = BaseResponse<BlogVO>;
export type LongResponse = BaseResponse<number>;

// 点赞相关类型
export interface DoThumbRequest {
  blogId: number;
}

export type BooleanResponse = BaseResponse<boolean>; 