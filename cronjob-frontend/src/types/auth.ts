// 用户信息类型
export interface User {
  id: string;
  username: string;
  email: string;
  nickname?: string;
  status: number;
  lastLoginTime?: string;
  createdAt: string;
}

// 角色类型
export interface Role {
  id: string;
  roleName: string;
  roleCode: string;
  description?: string;
  status: number;
}

// 权限类型
export interface Permission {
  id: string;
  permissionName: string;
  permissionCode: string;
  resourceType: number; // 1菜单 2按钮 3API
  resourcePath?: string;
  method?: string;
  description?: string;
}

// 菜单类型
export interface Menu {
  id: string;
  menuName: string;
  menuCode: string;
  path?: string;
  component?: string;
  icon?: string;
  parentId: string;
  menuType: number; // 1目录 2菜单 3按钮
  visible: number;
  status: number;
  sortOrder: number;
  children?: Menu[];
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: User;
  roles: Role[];
  permissions: string[];
  menus: Menu[];
}

// 认证状态
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  roles: Role[];
  permissions: string[];
  menus: Menu[];
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  checkMenuAccess: (menuCode: string) => boolean;
} 