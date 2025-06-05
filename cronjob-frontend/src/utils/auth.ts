import Cookies from 'js-cookie';

const TOKEN_KEY = 'cronjob_token';
const USER_KEY = 'cronjob_user';

// Token管理
export const tokenUtils = {
  // 获取token
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  // 设置token
  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7天过期
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 删除token
  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // 检查token是否存在且有效
  isTokenValid: (): boolean => {
    const token = tokenUtils.getToken();
    if (!token) return false;
    
    try {
      // 简单检查JWT格式
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }
};

// 用户信息管理
export const userUtils = {
  // 获取用户信息
  getUserInfo: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // 设置用户信息
  setUserInfo: (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // 删除用户信息
  removeUserInfo: () => {
    localStorage.removeItem(USER_KEY);
  }
};

// 权限检查工具
export const permissionUtils = {
  // 检查是否有指定权限
  hasPermission: (userPermissions: string[], permission: string): boolean => {
    return userPermissions.includes(permission);
  },

  // 检查是否有任一权限
  hasAnyPermission: (userPermissions: string[], permissions: string[]): boolean => {
    return permissions.some(p => userPermissions.includes(p));
  },

  // 检查是否有所有权限
  hasAllPermissions: (userPermissions: string[], permissions: string[]): boolean => {
    return permissions.every(p => userPermissions.includes(p));
  },

  // 检查角色
  hasRole: (userRoles: string[], role: string): boolean => {
    return userRoles.includes(role);
  },

  // 检查是否是管理员
  isAdmin: (userRoles: string[]): boolean => {
    return userRoles.includes('ADMIN');
  }
};

// 菜单权限工具
export const menuUtils = {
  // 过滤有权限的菜单
  filterMenusByPermissions: (menus: any[], permissions: string[]): any[] => {
    return menus.filter(menu => {
      // 如果菜单没有权限要求，或者用户有对应权限
      if (!menu.permission || permissions.includes(menu.permission)) {
        // 递归过滤子菜单
        if (menu.children) {
          menu.children = menuUtils.filterMenusByPermissions(menu.children, permissions);
        }
        return true;
      }
      return false;
    });
  },

  // 构建菜单树
  buildMenuTree: (menus: any[]): any[] => {
    const menuMap = new Map();
    const rootMenus: any[] = [];

    // 先创建所有菜单的映射
    menus.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 构建树形结构
    menus.forEach(menu => {
      const menuItem = menuMap.get(menu.id);
      if (menu.parentId === '0' || menu.parentId === 0) {
        rootMenus.push(menuItem);
      } else {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children.push(menuItem);
        }
      }
    });

    return rootMenus;
  }
};

// 路由守卫工具
export const routeUtils = {
  // 检查路由是否需要认证
  requiresAuth: (path: string): boolean => {
    const publicPaths = ['/login', '/register', '/forgot-password'];
    return !publicPaths.includes(path);
  },

  // 获取重定向路径
  getRedirectPath: (): string => {
    return sessionStorage.getItem('redirectPath') || '/dashboard';
  },

  // 设置重定向路径
  setRedirectPath: (path: string): void => {
    sessionStorage.setItem('redirectPath', path);
  },

  // 清除重定向路径
  clearRedirectPath: (): void => {
    sessionStorage.removeItem('redirectPath');
  }
}; 