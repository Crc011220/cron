import { create } from 'zustand';
import { AuthState, LoginRequest } from '../types/auth';
import { tokenUtils, userUtils, permissionUtils } from '../utils/auth';
import { authApi } from '../services/auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: tokenUtils.isTokenValid(),
  user: userUtils.getUserInfo(),
  token: tokenUtils.getToken(),
  roles: [],
  permissions: [],
  menus: [],

  // 登录
  login: async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      const { token, user, roles, permissions, menus } = response.data;
      
      // 保存认证信息
      tokenUtils.setToken(token);
      userUtils.setUserInfo(user);
      
      set({
        isAuthenticated: true,
        user,
        token,
        roles,
        permissions,
        menus,
      });
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 登出
  logout: () => {
    tokenUtils.removeToken();
    userUtils.removeUserInfo();
    
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      roles: [],
      permissions: [],
      menus: [],
    });
  },

  // 检查权限
  hasPermission: (permission: string): boolean => {
    const { permissions } = get();
    return permissionUtils.hasPermission(permissions, permission);
  },

  // 检查角色
  hasRole: (role: string): boolean => {
    const { roles } = get();
    const roleCodes = roles.map(r => r.roleCode);
    return permissionUtils.hasRole(roleCodes, role);
  },

  // 检查菜单访问权限
  checkMenuAccess: (menuCode: string): boolean => {
    const { menus } = get();
    const findMenu = (items: any[], code: string): boolean => {
      return items.some(item => {
        if (item.menuCode === code && item.visible === 1) {
          return true;
        }
        if (item.children) {
          return findMenu(item.children, code);
        }
        return false;
      });
    };
    return findMenu(menus, menuCode);
  },
})); 