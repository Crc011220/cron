# API接口总览

## 🚀 接口清单一览表

| 功能模块 | 接口路径 | 方法 | 前端使用位置 | 优先级 |
|---------|----------|------|-------------|-------|
| **任务管理** |
| 获取任务列表 | `/api/jobs` | GET | JobList.tsx - 页面初始化 | ⭐⭐⭐ |
| 创建任务 | `/api/jobs` | POST | JobList.tsx - 创建任务弹窗 | ⭐⭐⭐ |
| 更新任务 | `/api/jobs/{id}` | PUT | JobList.tsx - 编辑功能 | ⭐⭐ |
| 删除任务 | `/api/jobs/{id}` | DELETE | JobList.tsx - 删除按钮 | ⭐⭐⭐ |
| 启动任务 | `/api/jobs/{id}/start` | POST | JobList.tsx - 启动按钮 | ⭐⭐⭐ |
| 停止任务 | `/api/jobs/{id}/stop` | POST | JobList.tsx - 停止按钮 | ⭐⭐⭐ |
| 手动执行 | `/api/jobs/{id}/execute` | POST | JobList.tsx - 执行按钮 | ⭐⭐ |
| 获取任务统计 | `/api/jobs/stats` | GET | JobList.tsx - 任务统计卡片 | ⭐⭐ |
| **脚本管理** |
| 上传脚本 | `/api/scripts/upload` | POST | ScriptUpload.tsx - 上传表单 | ⭐⭐⭐ |
| 获取脚本列表 | `/api/scripts` | GET | ScriptUpload.tsx - 脚本管理标签页 | ⭐⭐⭐ |
| 获取脚本详情 | `/api/scripts/{id}` | GET | ScriptUpload.tsx - 查看详情 | ⭐⭐ |
| 创建脚本 | `/api/scripts` | POST | ScriptUpload.tsx - 在线创建 | ⭐⭐ |
| 更新脚本 | `/api/scripts/{id}` | PUT | ScriptUpload.tsx - 编辑脚本 | ⭐⭐ |
| 删除脚本 | `/api/scripts/{id}` | DELETE | ScriptUpload.tsx - 删除按钮 | ⭐⭐ |
| 下载脚本 | `/api/scripts/{id}/download` | GET | ScriptUpload.tsx - 下载按钮 | ⭐⭐ |
| **日志管理** |
| 获取执行日志 | `/api/jobs/{id}/logs` | GET | JobList.tsx - 日志弹窗 | ⭐⭐⭐ |
| 实时日志 | `/api/jobs/{id}/logs/realtime` | WebSocket | 实时日志查看 | ⭐ |
| **系统统计** |
| 系统统计 | `/api/stats` | GET | JobList.tsx - 统计卡片 | ⭐⭐ |
| 执行趋势 | `/api/stats/trends` | GET | 趋势图表 | ⭐ |
| **Cron表达式** |
| 验证Cron表达式 | `/api/cron/validate` | POST | JobList.tsx - 创建/编辑任务 | ⭐⭐ |
| 获取下次执行时间 | `/api/cron/next-runs` | POST | JobList.tsx - 显示下次执行 | ⭐⭐ |
| 解析Cron表达式 | `/api/cron/parse` | POST | JobList.tsx - 显示可读描述 | ⭐ |
| **用户认证** |
| 用户登录 | `/api/auth/login` | POST | Login.tsx - 登录页面 | ⭐⭐⭐ |
| 用户登出 | `/api/auth/logout` | POST | MainLayout.tsx - 退出登录 | ⭐⭐ |
| 获取当前用户 | `/api/auth/me` | GET | useAuthStore.ts - 用户信息 | ⭐⭐ |
| 刷新Token | `/api/auth/refresh` | POST | api.ts - Token续期 | ⭐⭐ |
| 修改密码 | `/api/auth/change-password` | POST | 个人设置页面 | ⭐ |
| **系统管理（管理员）** |
| 用户管理 | `/api/system/users/*` | * | 系统管理页面 | ⭐ |
| 角色管理 | `/api/system/roles/*` | * | 系统管理页面 | ⭐ |
| 权限管理 | `/api/system/permissions/*` | * | 系统管理页面 | ⭐ |
| **系统监控（管理员）** |
| 系统状态 | `/api/monitor/system` | GET | 系统监控页面 | ⭐ |
| 执行统计 | `/api/monitor/stats` | GET | 系统监控页面 | ⭐ |
| 资源使用 | `/api/monitor/resources` | GET | 系统监控页面 | ⭐ |
| 执行历史 | `/api/monitor/history` | GET | 系统监控页面 | ⭐ |

## 📋 前端组件接口依赖详情

### 1. JobList.tsx (任务管理主页面)
**页面初始化需要的接口：**
```javascript
// 页面加载时调用
useEffect(() => {
  jobApi.getJobs();        // 获取任务列表
  jobApi.getJobStats();    // 获取任务统计
  statsApi.getStats();     // 获取系统统计信息
  scriptApi.getScripts();  // 获取脚本列表（用于创建任务）
}, []);
```

**用户操作触发的接口：**
- 🔍 搜索/筛选 → `GET /api/jobs?keyword=xxx&status=xxx`
- ➕ 创建任务 → `POST /api/jobs`
- ✏️ 编辑任务 → `PUT /api/jobs/{id}`
- ▶️ 启动任务 → `POST /api/jobs/{id}/start`
- ⏸️ 停止任务 → `POST /api/jobs/{id}/stop`
- 🗑️ 删除任务 → `DELETE /api/jobs/{id}`
- 📊 查看日志 → `GET /api/jobs/{id}/logs`
- 🚀 手动执行 → `POST /api/jobs/{id}/execute`
- ✅ 验证Cron → `POST /api/cron/validate`
- ⏰ 下次执行时间 → `POST /api/cron/next-runs`

**创建任务表单数据结构：**
```javascript
const taskData = {
  name: "任务名称",
  description: "任务描述", 
  cronExpr: "0 2 * * *",    // Cron表达式
  scriptId: "script_123"    // 选择的脚本ID
};
```

### 2. ScriptUpload.tsx (脚本管理页面)
**脚本上传功能：**
```javascript
const handleSubmit = async (values) => {
  // 构建 FormData
  const formData = new FormData();
  
  // 添加脚本文件（支持多文件）
  uploadedFiles.forEach(file => formData.append('files', file));
  
  // 添加脚本信息
  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('environment', values.environment);
  formData.append('parameters', values.parameters);
  
  // 调用上传接口
  await scriptApi.uploadScript(formData);
};
```

**脚本管理功能：**
- 📋 脚本列表 → `GET /api/scripts`
- 👁️ 查看详情 → `GET /api/scripts/{id}`
- ➕ 在线创建 → `POST /api/scripts`
- ✏️ 编辑脚本 → `PUT /api/scripts/{id}`
- 🗑️ 删除脚本 → `DELETE /api/scripts/{id}`

**支持的脚本类型：**
- `.sh` - Shell脚本
- `.py` - Python脚本
- `.js` - JavaScript脚本
- `.ts` - TypeScript脚本
- `.php` - PHP脚本
- `.sql` - SQL脚本
- `.bat` - Windows批处理脚本

### 3. Login.tsx (登录页面)
**认证功能：**
```javascript
const handleLogin = async (values) => {
  const response = await authApi.login({
    username: values.username,
    password: values.password
  });
  
  // 保存认证信息到Store
  const { token, user, roles, permissions, menus } = response.data;
  // ...
};
```

### 4. MainLayout.tsx (主布局)
**认证和权限相关：**
- 🔐 用户信息显示 → 从认证Store获取
- 🚪 退出登录 → `POST /api/auth/logout`
- 📋 菜单权限过滤 → 基于用户权限和菜单配置

## 🔧 后端开发优先级建议

### 第一阶段（核心功能）- 优先级 ⭐⭐⭐
1. **用户认证系统** - 必须最先实现的基础功能
   - `POST /api/auth/login` - 用户登录（返回完整用户信息、角色、权限、菜单）
   - `POST /api/auth/logout` - 用户登出
   - `GET /api/auth/me` - 获取当前用户信息
   - `POST /api/auth/refresh` - Token刷新

2. **任务CRUD接口** - 任务的增删改查基础功能
   - `GET /api/jobs` - 任务列表查询（支持分页、搜索、筛选）
   - `POST /api/jobs` - 创建新任务
   - `DELETE /api/jobs/{id}` - 删除任务
   
3. **任务状态控制** - 任务启动停止核心逻辑
   - `POST /api/jobs/{id}/start` - 启动任务
   - `POST /api/jobs/{id}/stop` - 停止任务
   
4. **脚本上传管理** - 脚本文件的基础操作
   - `POST /api/scripts/upload` - 脚本上传（multipart/form-data）
   - `GET /api/scripts` - 脚本列表查询
   
5. **执行日志接口** - 任务执行历史记录
   - `GET /api/jobs/{id}/logs` - 获取任务执行日志

### 第二阶段（完善功能）- 优先级 ⭐⭐
1. **Cron表达式处理** - 任务调度核心功能
   - `POST /api/cron/validate` - 验证Cron表达式
   - `POST /api/cron/next-runs` - 获取下次执行时间
   
2. **脚本完整管理** - 脚本的完整生命周期
   - `GET /api/scripts/{id}` - 脚本详情查询
   - `POST /api/scripts` - 在线创建脚本
   - `PUT /api/scripts/{id}` - 脚本在线编辑
   - `DELETE /api/scripts/{id}` - 删除脚本
   
3. **系统统计接口** - 提升用户体验
   - `GET /api/stats` - 系统统计信息
   - `GET /api/jobs/stats` - 任务统计信息
   
4. **任务更新功能** - 任务编辑
   - `PUT /api/jobs/{id}` - 更新任务配置
   
5. **手动执行功能** - 测试和调试
   - `POST /api/jobs/{id}/execute` - 手动触发任务执行

### 第三阶段（高级功能）- 优先级 ⭐
1. **Cron表达式解析** - 用户体验增强
   - `POST /api/cron/parse` - 解析Cron表达式为可读描述
   
2. **执行趋势分析** - 数据可视化
   - `GET /api/stats/trends` - 获取执行趋势数据
   
3. **系统管理功能** - 管理员功能
   - `/api/system/users/*` - 用户管理
   - `/api/system/roles/*` - 角色管理
   - `/api/system/permissions/*` - 权限管理
   
4. **系统监控功能** - 运维支持
   - `/api/monitor/*` - 系统监控相关接口

## 🎯 关键技术要点

### 后端实现要点
1. **认证授权系统**：
   - JWT Token机制
   - 完整的RBAC权限模型（用户-角色-权限-菜单）
   - Token自动刷新机制
   - 权限拦截器

2. **文件上传处理**：
   - 支持多文件上传（multipart/form-data）
   - 文件类型严格验证：.sh, .py, .js, .ts, .php, .sql, .bat
   - 文件大小限制：单文件不超过10MB
   - 文件内容安全扫描（防止恶意代码）

3. **脚本内容存储**：
   - 数据库存储脚本内容，便于在线编辑和预览
   - 支持脚本参数配置
   - 记录脚本使用统计（usageCount, lastUsed）

4. **任务调度框架**：
   - 集成Quartz或xxl-job等调度框架
   - 支持标准Cron表达式解析和验证
   - 任务状态实时同步

5. **日志管理**：
   - 执行日志分页查询
   - 日志内容格式化存储
   - 定期清理过期日志

### 前端集成要点
1. **认证状态管理**：
   - Zustand状态管理
   - Token自动添加到请求头
   - 权限验证和路由守卫
   - 登录状态持久化

2. **表单验证**：
   - Cron表达式格式验证
   - 文件类型和大小前端预检
   - 必填字段验证

3. **文件处理**：
   - 拖拽上传支持
   - 文件预览功能
   - 脚本内容在线编辑

4. **状态管理**：
   - 任务状态实时更新
   - 脚本使用统计显示
   - 操作结果及时反馈

5. **用户体验**：
   - 加载状态显示
   - 操作确认对话框
   - 错误信息友好提示

## 📊 数据库设计参考

基于前端功能，建议的核心表结构：

```sql
-- 用户表
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(128) NOT NULL COMMENT '密码（加密后）',
    email VARCHAR(128) COMMENT '邮箱',
    avatar VARCHAR(256) COMMENT '头像URL',
    status TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_status (status)
);

-- 角色表
CREATE TABLE role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_code VARCHAR(64) UNIQUE NOT NULL COMMENT '角色编码',
    role_name VARCHAR(128) NOT NULL COMMENT '角色名称',
    description TEXT COMMENT '角色描述',
    status TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_code (role_code),
    INDEX idx_status (status)
);

-- 权限表
CREATE TABLE permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_code VARCHAR(128) UNIQUE NOT NULL COMMENT '权限编码',
    permission_name VARCHAR(128) NOT NULL COMMENT '权限名称',
    resource_type VARCHAR(64) NOT NULL COMMENT '资源类型：MENU/BTN/API',
    description TEXT COMMENT '权限描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_permission_code (permission_code),
    INDEX idx_resource_type (resource_type)
);

-- 菜单表
CREATE TABLE menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    menu_code VARCHAR(64) UNIQUE NOT NULL COMMENT '菜单编码',
    menu_name VARCHAR(128) NOT NULL COMMENT '菜单名称',
    path VARCHAR(256) COMMENT '路由路径',
    icon VARCHAR(64) COMMENT '图标',
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    sort_order INT DEFAULT 0 COMMENT '排序号',
    visible TINYINT DEFAULT 1 COMMENT '是否可见：0不可见 1可见',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_menu_code (menu_code),
    INDEX idx_parent_id (parent_id)
);

-- 用户角色关联表
CREATE TABLE user_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
);

-- 角色权限关联表
CREATE TABLE role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
);

-- 任务表
CREATE TABLE job (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL COMMENT '任务名称',
    description TEXT COMMENT '任务描述',
    cron_expr VARCHAR(64) NOT NULL COMMENT 'Cron表达式',
    script_id BIGINT NOT NULL COMMENT '关联脚本ID',
    status TINYINT DEFAULT 1 COMMENT '状态：0停用 1启用 2运行中 3错误',
    success_count INT DEFAULT 0 COMMENT '成功次数',
    failure_count INT DEFAULT 0 COMMENT '失败次数',
    last_run_time DATETIME COMMENT '上次执行时间',
    next_run_time DATETIME COMMENT '下次执行时间',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_script_id (script_id),
    INDEX idx_next_run_time (next_run_time),
    INDEX idx_created_by (created_by)
);

-- 脚本表
CREATE TABLE script (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL COMMENT '脚本名称',
    description TEXT COMMENT '脚本描述',
    file_name VARCHAR(256) NOT NULL COMMENT '文件名',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    type VARCHAR(64) NOT NULL COMMENT '脚本类型',
    environment VARCHAR(64) NOT NULL COMMENT '运行环境',
    parameters TEXT COMMENT '运行参数',
    content LONGTEXT NOT NULL COMMENT '脚本内容',
    usage_count INT DEFAULT 0 COMMENT '使用次数',
    last_used DATETIME COMMENT '最后使用时间',
    created_by BIGINT NOT NULL COMMENT '创建人ID',
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_name (name),
    INDEX idx_created_by (created_by)
);

-- 执行日志表
CREATE TABLE job_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL COMMENT '任务ID',
    execution_id VARCHAR(64) COMMENT '执行ID',
    start_time DATETIME NOT NULL COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    duration INT COMMENT '执行时长(秒)',
    status TINYINT NOT NULL COMMENT '状态：0失败 1成功 2运行中',
    output LONGTEXT COMMENT '执行输出',
    error_msg TEXT COMMENT '错误信息',
    exit_code INT COMMENT '退出码',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_start_time (start_time),
    INDEX idx_status (status)
);
```

## 🚀 接口测试建议

### 测试数据准备
1. **用户数据准备**：
   - 管理员用户：admin/admin123
   - 普通用户：user/user123
   - 角色和权限数据初始化

2. **脚本文件准备**：
   - 准备不同类型的测试脚本文件
   - 包含正常脚本和异常脚本（用于安全测试）

3. **任务测试数据**：
   - 各种Cron表达式组合
   - 不同状态的任务数据

### 接口测试流程
1. **认证测试**：
   ```
   用户登录 → 获取Token → Token验证 → 权限检查 → 退出登录
   ```

2. **脚本管理测试**：
   ```
   上传脚本 → 查看列表 → 查看详情 → 编辑脚本 → 删除脚本
   ```

3. **任务管理测试**：
   ```
   获取脚本列表 → 创建任务 → 查看任务列表 → 启动任务 → 查看日志 → 停止任务 → 删除任务
   ```

4. **集成测试**：
   ```
   登录 → 上传脚本 → 创建任务 → 启动任务 → 查看执行日志 → 检查统计数据
   ```

这份总览文档完全基于现有前端项目的实际功能设计，为后端开发提供了清晰的优先级指导和技术实现建议！🚀