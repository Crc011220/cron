import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types/auth';

// 定义响应数据类型
interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}

// 创建认证专用的axios实例
const authApiInstance = axios.create({
  baseURL: 'http://localhost:8088/api/auth',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
authApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('认证API请求失败:', error);
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return authApiInstance.post('/login', data);
  },

  // 用户登出
  logout: (): Promise<ApiResponse<string>> => {
    return authApiInstance.post('/logout');
  },

  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<any>> => {
    return authApiInstance.get('/me');
  },

  // 刷新token
  refreshToken: (): Promise<ApiResponse<{ token: string }>> => {
    return authApiInstance.post('/refresh');
  },

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<string>> => {
    return authApiInstance.post('/change-password', data);
  },
}; 