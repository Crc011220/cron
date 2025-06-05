import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { tokenUtils } from '../utils/auth';

// 定义响应数据类型
interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
  success?: boolean;
}

// 分页数据类型
interface PageData<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8088/api', // 后端服务地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    console.error('API请求失败:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          tokenUtils.removeToken();
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问此资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 任务相关API
export const jobApi = {
  // 获取任务列表
  getJobs: (params?: any): Promise<ApiResponse<any>> => {
    return api.get('/jobs', { params });
  },

  // 创建任务
  createJob: (data: any): Promise<ApiResponse<any>> => {
    return api.post('/jobs', data);
  },

  // 更新任务
  updateJob: (id: string, data: any): Promise<ApiResponse<any>> => {
    return api.put(`/jobs/${id}`, data);
  },

  // 删除任务
  deleteJob: (id: string): Promise<ApiResponse<any>> => {
    return api.delete(`/jobs/${id}`);
  },

  // 启动任务
  startJob: (id: string): Promise<ApiResponse<any>> => {
    return api.post(`/jobs/${id}/start`);
  },
  
  // 停止任务
  stopJob: (id: string): Promise<ApiResponse<any>> => {
    return api.post(`/jobs/${id}/stop`);
  },
  
  // 手动执行任务
  executeJob: (id: string): Promise<ApiResponse<any>> => {
    return api.post(`/jobs/${id}/execute`);
  },
  
  // 获取任务执行日志
  getJobLogs: (id: string, params?: any): Promise<ApiResponse<any>> => {
    return api.get(`/jobs/${id}/logs`, { params });
  },

  // 获取任务统计
  getJobStats: (): Promise<ApiResponse<any>> => {
    return api.get('/jobs/stats');
  },
};

// 脚本相关API
export const scriptApi = {
  // 获取脚本列表
  getScripts: (params?: any): Promise<ApiResponse<any>> => {
    return api.get('/scripts', { params });
  },

  // 上传脚本
  uploadScript: (data: any): Promise<ApiResponse<any>> => {
    return api.post('/scripts/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 创建脚本
  createScript: (data: any): Promise<ApiResponse<any>> => {
    return api.post('/scripts', data);
  },

  // 更新脚本
  updateScript: (id: string, data: any): Promise<ApiResponse<any>> => {
    return api.put(`/scripts/${id}`, data);
  },

  // 删除脚本
  deleteScript: (id: string): Promise<ApiResponse<any>> => {
    return api.delete(`/scripts/${id}`);
  },

  // 获取脚本详情
  getScriptDetail: (id: string): Promise<ApiResponse<any>> => {
    return api.get(`/scripts/${id}`);
  },
};

// 系统统计API
export const statsApi = {
  // 获取系统统计信息
  getStats: () => api.get('/stats'),
  
  // 获取任务执行趋势
  getExecutionTrends: (params?: any) => api.get('/stats/trends', { params }),
};

// Cron表达式相关API
export const cronApi = {
  // 验证Cron表达式
  validateCron: (expression: string): Promise<ApiResponse<any>> => {
    return api.post('/cron/validate', { expression });
  },

  // 获取Cron下次执行时间
  getNextRuns: (expression: string, count?: number): Promise<ApiResponse<any>> => {
    return api.post('/cron/next-runs', { expression, count: count || 5 });
  },

  // 解析Cron表达式
  parseCron: (expression: string): Promise<ApiResponse<any>> => {
    return api.post('/cron/parse', { expression });
  },
};

// 系统管理API（仅管理员）
export const systemApi = {
  // 用户管理
  users: {
    getUsers: (params?: any): Promise<ApiResponse<any>> => {
      return api.get('/system/users', { params });
    },
    createUser: (data: any): Promise<ApiResponse<any>> => {
      return api.post('/system/users', data);
    },
    updateUser: (id: string, data: any): Promise<ApiResponse<any>> => {
      return api.put(`/system/users/${id}`, data);
    },
    deleteUser: (id: string): Promise<ApiResponse<any>> => {
      return api.delete(`/system/users/${id}`);
    },
    resetPassword: (id: string, password: string): Promise<ApiResponse<any>> => {
      return api.post(`/system/users/${id}/reset-password`, { password });
    },
  },

  // 角色管理
  roles: {
    getRoles: (params?: any): Promise<ApiResponse<any>> => {
      return api.get('/system/roles', { params });
    },
    createRole: (data: any): Promise<ApiResponse<any>> => {
      return api.post('/system/roles', data);
    },
    updateRole: (id: string, data: any): Promise<ApiResponse<any>> => {
      return api.put(`/system/roles/${id}`, data);
    },
    deleteRole: (id: string): Promise<ApiResponse<any>> => {
      return api.delete(`/system/roles/${id}`);
    },
    assignPermissions: (roleId: string, permissionIds: string[]): Promise<ApiResponse<any>> => {
      return api.post(`/system/roles/${roleId}/permissions`, { permissionIds });
    },
  },

  // 权限管理
  permissions: {
    getPermissions: (params?: any): Promise<ApiResponse<any>> => {
      return api.get('/system/permissions', { params });
    },
    createPermission: (data: any): Promise<ApiResponse<any>> => {
      return api.post('/system/permissions', data);
    },
    updatePermission: (id: string, data: any): Promise<ApiResponse<any>> => {
      return api.put(`/system/permissions/${id}`, data);
    },
    deletePermission: (id: string): Promise<ApiResponse<any>> => {
      return api.delete(`/system/permissions/${id}`);
    },
  },
};

// 监控相关API
export const monitorApi = {
  // 获取系统状态
  getSystemStatus: (): Promise<ApiResponse<any>> => {
    return api.get('/monitor/system');
  },

  // 获取执行统计
  getExecutionStats: (params?: any): Promise<ApiResponse<any>> => {
    return api.get('/monitor/stats', { params });
  },

  // 获取资源使用情况
  getResourceUsage: (): Promise<ApiResponse<any>> => {
    return api.get('/monitor/resources');
  },

  // 获取任务执行历史
  getExecutionHistory: (params?: any): Promise<ApiResponse<any>> => {
    return api.get('/monitor/history', { params });
  },
};

export default api;