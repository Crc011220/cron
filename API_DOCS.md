# 定时任务调度系统 API 接口文档

## 基本信息
- **Base URL**: `http://localhost:8088/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (Authorization: Bearer {token})

---

## 📋 1. 任务管理相关接口

### 1.1 获取任务列表
```http
GET /api/jobs
```

**请求参数** (Query String):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认10 |
| status | string | 否 | 状态筛选：active/inactive/running/error |
| keyword | string | 否 | 搜索关键字 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "1",
        "name": "数据备份任务",
        "description": "每天凌晨2点执行数据库备份",
        "cronExpr": "0 2 * * *",
        "scriptId": "script_123",
        "scriptName": "backup.sh",
        "status": "active",
        "environment": "bash",
        "parameters": "-v --compress",
        "lastRun": "2024-01-20 02:00:00",
        "nextRun": "2024-01-21 02:00:00",
        "createdAt": "2024-01-15 10:30:00",
        "updatedAt": "2024-01-20 02:00:05",
        "successCount": 25,
        "failureCount": 2
      }
    ],
    "total": 50,
    "current": 1,
    "size": 10
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - `useEffect` 钩子中获取任务列表
- 📍 `src/services/api.ts` - `jobApi.getJobs()` 方法

---

### 1.2 创建新任务
```http
POST /api/jobs
```

**请求体**:
```json
{
  "name": "新任务名称",
  "description": "任务描述",
  "cronExpr": "0 9 * * 1-5",
  "scriptId": "script_123",
  "status": "active"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "任务创建成功",
  "data": {
    "jobId": "job_456",
    "nextRun": "2024-01-22 09:00:00"
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 创建任务弹窗表单提交
- 📍 `src/services/api.ts` - `jobApi.createJob()` 方法

---

### 1.3 更新任务
```http
PUT /api/jobs/{jobId}
```

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| jobId | string | 任务ID |

**请求体**: 同创建任务接口

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 编辑任务功能
- 📍 `src/services/api.ts` - `jobApi.updateJob()` 方法

---

### 1.4 删除任务
```http
DELETE /api/jobs/{jobId}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - `handleDelete` 函数中删除任务
- 📍 `src/services/api.ts` - `jobApi.deleteJob()` 方法

---

### 1.5 启动任务
```http
POST /api/jobs/{jobId}/start
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - `handleStatusChange` 函数中启动任务
- 📍 `src/services/api.ts` - `jobApi.startJob()` 方法

---

### 1.6 停止任务
```http
POST /api/jobs/{jobId}/stop
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - `handleStatusChange` 函数中停止任务
- 📍 `src/services/api.ts` - `jobApi.stopJob()` 方法

---

### 1.7 手动执行任务
```http
POST /api/jobs/{jobId}/execute
```

**响应示例**:
```json
{
  "code": 200,
  "message": "任务执行已开始",
  "data": {
    "executionId": "exec_789",
    "startTime": "2024-01-20 15:30:00"
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 任务操作按钮区域
- 📍 `src/services/api.ts` - `jobApi.executeJob()` 方法

---

### 1.8 获取任务统计
```http
GET /api/jobs/stats
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalJobs": 50,
    "activeJobs": 35,
    "runningJobs": 3,
    "errorJobs": 2,
    "todayExecutions": 68,
    "successRate": 95.2
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 页面统计信息
- 📍 `src/services/api.ts` - `jobApi.getJobStats()` 方法

---

## 📂 2. 脚本管理相关接口

### 2.1 上传脚本
```http
POST /api/scripts/upload
```

**请求类型**: `multipart/form-data`

**表单字段**:
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| files | File[] | 是 | 脚本文件（支持多文件） |
| name | string | 是 | 脚本名称 |
| description | string | 是 | 脚本描述 |
| environment | string | 是 | 运行环境 |
| parameters | string | 否 | 运行参数 |

**响应示例**:
```json
{
  "code": 200,
  "message": "脚本上传成功",
  "data": {
    "scriptId": "script_123",
    "files": [
      {
        "originalName": "backup.sh",
        "fileName": "script_123_backup.sh",
        "size": 2048,
        "path": "/uploads/scripts/script_123_backup.sh"
      }
    ]
  }
}
```

**前端使用位置**:
- 📍 `src/components/ScriptUpload.tsx` - `handleSubmit` 函数中上传脚本
- 📍 `src/services/api.ts` - `scriptApi.uploadScript()` 方法

---

### 2.2 获取脚本列表
```http
GET /api/scripts
```

**请求参数** (Query String):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认10 |
| type | string | 否 | 脚本类型筛选 |
| keyword | string | 否 | 搜索关键字 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "script_123",
        "name": "数据库备份脚本",
        "description": "MySQL数据库备份脚本",
        "fileName": "backup.sh",
        "fileSize": 2048,
        "type": "Shell脚本",
        "environment": "bash",
        "parameters": "--host localhost\n--port 3306\n--database myapp",
        "uploadTime": "2024-01-15 10:30:00",
        "lastUsed": "2024-01-20 02:00:00",
        "usageCount": 25,
        "content": "#!/bin/bash\n\n# MySQL数据库备份脚本\n..."
      }
    ],
    "total": 20,
    "current": 1,
    "size": 10
  }
}
```

**前端使用位置**:
- 📍 `src/components/ScriptUpload.tsx` - 脚本管理标签页显示脚本列表
- 📍 `src/components/JobList.tsx` - 创建任务时的脚本选择下拉框
- 📍 `src/services/api.ts` - `scriptApi.getScripts()` 方法

---

### 2.3 获取脚本详情
```http
GET /api/scripts/{scriptId}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "script_123",
    "name": "数据库备份脚本",
    "description": "MySQL数据库备份脚本",
    "fileName": "backup.sh",
    "fileSize": 2048,
    "type": "Shell脚本",
    "environment": "bash",
    "parameters": "--host localhost\n--port 3306\n--database myapp",
    "uploadTime": "2024-01-15 10:30:00",
    "lastUsed": "2024-01-20 02:00:00",
    "usageCount": 25,
    "content": "#!/bin/bash\n\n# MySQL数据库备份脚本\nDATE=$(date +%Y%m%d_%H%M%S)\n..."
  }
}
```

**前端使用位置**:
- 📍 `src/components/ScriptUpload.tsx` - `handleScriptDetail` 函数中查看脚本详情
- 📍 `src/services/api.ts` - `scriptApi.getScriptDetail()` 方法

---

### 2.4 创建脚本
```http
POST /api/scripts
```

**请求体**:
```json
{
  "name": "新脚本名称",
  "description": "脚本描述",
  "fileName": "script.sh",
  "type": "Shell脚本",
  "environment": "bash",
  "parameters": "--verbose",
  "content": "#!/bin/bash\necho 'Hello World'"
}
```

**前端使用位置**:
- 📍 `src/components/ScriptUpload.tsx` - 在线创建脚本功能
- 📍 `src/services/api.ts` - `scriptApi.createScript()` 方法

---

### 2.5 更新脚本
```http
PUT /api/scripts/{scriptId}
```

**请求体**:
```json
{
  "name": "更新后的脚本名称",
  "description": "更新后的脚本描述",
  "environment": "python3",
  "parameters": "--verbose\n--output=/tmp/result.log",
  "content": "#!/usr/bin/env python3\n\n# 更新后的脚本内容\n..."
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "脚本更新成功",
  "data": {
    "scriptId": "script_123"
  }
}
```

**前端使用位置**:
- 📍 `src/components/ScriptUpload.tsx` - `handleUpdateScript` 函数中更新脚本
- 📍 `src/services/api.ts` - `scriptApi.updateScript()` 方法

---

### 2.6 删除脚本
```http
DELETE /api/scripts/{scriptId}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "脚本删除成功",
  "data": null
}
```

**前端使用位置**:
- 📍 `src/components/ScriptUpload.tsx` - `handleDeleteScript` 函数
- 📍 `src/services/api.ts` - `scriptApi.deleteScript()` 方法

---

## 📊 3. 任务执行日志相关接口

### 3.1 获取任务执行日志
```http
GET /api/jobs/{jobId}/logs
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码 |
| size | int | 否 | 每页数量 |
| status | string | 否 | 执行状态筛选 |
| startTime | string | 否 | 开始时间 |
| endTime | string | 否 | 结束时间 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "log_001",
        "jobId": "job_456",
        "executionId": "exec_789",
        "startTime": "2024-01-20 02:00:00",
        "endTime": "2024-01-20 02:30:00",
        "duration": 1800,
        "status": "success",
        "output": "Database backup completed successfully.\\nBackup file: backup_20240120.sql\\nSize: 2.3GB",
        "errorMsg": null,
        "exitCode": 0
      }
    ],
    "total": 100,
    "current": 1,
    "size": 10
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - `showJobLogs` 函数中获取任务日志
- 📍 `src/services/api.ts` - `jobApi.getJobLogs()` 方法

---

## 📈 4. 系统统计相关接口

### 4.1 获取系统统计信息
```http
GET /api/stats
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalJobs": 50,
    "activeJobs": 35,
    "runningJobs": 3,
    "errorJobs": 2,
    "totalExecutions": 1520,
    "successRate": 95.2,
    "todayExecutions": 68,
    "systemStatus": "healthy",
    "totalScripts": 20,
    "scriptUsageCount": 156
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 统计卡片数据获取
- 📍 `src/services/api.ts` - `statsApi.getStats()` 方法

---

### 4.2 获取任务执行趋势
```http
GET /api/stats/trends
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| period | string | 否 | 统计周期：day/week/month |
| days | int | 否 | 最近天数，默认7 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "period": "day",
    "trends": [
      {
        "date": "2024-01-20",
        "totalExecutions": 68,
        "successExecutions": 65,
        "failureExecutions": 3,
        "successRate": 95.6
      }
    ]
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 可添加趋势图表展示
- 📍 `src/services/api.ts` - `statsApi.getExecutionTrends()` 方法

---

## 🔧 5. Cron表达式相关接口

### 5.1 验证Cron表达式
```http
POST /api/cron/validate
```

**请求体**:
```json
{
  "expression": "0 2 * * *"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Cron表达式有效",
  "data": {
    "valid": true,
    "description": "每天凌晨2点执行"
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 创建/编辑任务时验证Cron表达式
- 📍 `src/services/api.ts` - `cronApi.validateCron()` 方法

---

### 5.2 获取Cron下次执行时间
```http
POST /api/cron/next-runs
```

**请求体**:
```json
{
  "expression": "0 2 * * *",
  "count": 5
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "nextRuns": [
      "2024-01-21 02:00:00",
      "2024-01-22 02:00:00",
      "2024-01-23 02:00:00",
      "2024-01-24 02:00:00",
      "2024-01-25 02:00:00"
    ]
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 显示任务下次执行时间
- 📍 `src/services/api.ts` - `cronApi.getNextRuns()` 方法

---

### 5.3 解析Cron表达式
```http
POST /api/cron/parse
```

**请求体**:
```json
{
  "expression": "0 2 * * *"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "description": "每天凌晨2点执行",
    "parts": {
      "second": "0",
      "minute": "0", 
      "hour": "2",
      "dayOfMonth": "*",
      "month": "*",
      "dayOfWeek": "*"
    }
  }
}
```

**前端使用位置**:
- 📍 `src/components/JobList.tsx` - 显示Cron表达式的可读描述
- 📍 `src/services/api.ts` - `cronApi.parseCron()` 方法

---

## 🔐 6. 用户认证相关接口

### 6.1 用户登录
```http
POST /api/auth/login
```

**请求体**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_001",
      "username": "admin",
      "email": "admin@example.com",
      "roles": [
        {
          "id": "role_001",
          "roleCode": "ADMIN",
          "roleName": "系统管理员"
        }
      ]
    },
    "permissions": [
      {
        "id": "perm_001",
        "permissionCode": "MENU:JOB:VIEW",
        "permissionName": "任务查看"
      }
    ],
    "menus": [
      {
        "id": "menu_001",
        "menuCode": "DASHBOARD",
        "menuName": "工作台",
        "path": "/dashboard",
        "visible": 1,
        "children": []
      }
    ]
  }
}
```

**前端使用位置**:
- 📍 `src/pages/Login.tsx` - 登录页面
- 📍 `src/services/auth.ts` - `authApi.login()` 方法
- 📍 `src/store/useAuthStore.ts` - 登录状态管理

---

### 6.2 用户登出
```http
POST /api/auth/logout
```

**前端使用位置**:
- 📍 `src/components/Layout/MainLayout.tsx` - 退出登录功能
- 📍 `src/services/auth.ts` - `authApi.logout()` 方法

---

### 6.3 获取当前用户信息
```http
GET /api/auth/me
```

**前端使用位置**:
- 📍 `src/store/useAuthStore.ts` - 页面刷新时获取用户信息
- 📍 `src/services/auth.ts` - `authApi.getCurrentUser()` 方法

---

### 6.4 刷新Token
```http
POST /api/auth/refresh
```

**前端使用位置**:
- 📍 `src/services/api.ts` - Token过期时自动刷新
- 📍 `src/services/auth.ts` - `authApi.refreshToken()` 方法

---

### 6.5 修改密码
```http
POST /api/auth/change-password
```

**请求体**:
```json
{
  "oldPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**前端使用位置**:
- 📍 个人设置页面（待开发）
- 📍 `src/services/auth.ts` - `authApi.changePassword()` 方法

---

## 🔧 7. 系统管理相关接口（仅管理员）

### 7.1 用户管理

#### 获取用户列表
```http
GET /api/system/users
```

#### 创建用户
```http
POST /api/system/users
```

#### 更新用户
```http
PUT /api/system/users/{id}
```

#### 删除用户
```http
DELETE /api/system/users/{id}
```

#### 重置密码
```http
POST /api/system/users/{id}/reset-password
```

### 7.2 角色管理

#### 获取角色列表
```http
GET /api/system/roles
```

#### 创建角色
```http
POST /api/system/roles
```

#### 更新角色
```http
PUT /api/system/roles/{id}
```

#### 删除角色
```http
DELETE /api/system/roles/{id}
```

#### 分配权限
```http
POST /api/system/roles/{roleId}/permissions
```

### 7.3 权限管理

#### 获取权限列表
```http
GET /api/system/permissions
```

#### 创建权限
```http
POST /api/system/permissions
```

#### 更新权限
```http
PUT /api/system/permissions/{id}
```

#### 删除权限
```http
DELETE /api/system/permissions/{id}
```

**前端使用位置**:
- 📍 系统管理页面（待开发）
- 📍 `src/services/api.ts` - `systemApi.*` 方法

---

## 📊 8. 系统监控相关接口（仅管理员）

### 8.1 获取系统状态
```http
GET /api/monitor/system
```

### 8.2 获取执行统计
```http
GET /api/monitor/stats
```

### 8.3 获取资源使用情况
```http
GET /api/monitor/resources
```

### 8.4 获取任务执行历史
```http
GET /api/monitor/history
```

**前端使用位置**:
- 📍 系统监控页面（待开发）
- 📍 `src/services/api.ts` - `monitorApi.*` 方法

---

## 🚨 9. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/token无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如任务名重复） |
| 422 | 参数验证失败 |
| 500 | 服务器内部错误 |

---

## 📝 10. 前端组件与接口对应关系

### JobList.tsx (任务管理页面)
```typescript
// 页面初始化
useEffect(() => {
  jobApi.getJobs();        // 获取任务列表
  jobApi.getJobStats();    // 获取任务统计
  statsApi.getStats();     // 获取系统统计信息
  scriptApi.getScripts();  // 获取脚本列表（用于创建任务时选择）
}, []);

// 创建任务
const handleCreateTask = async (values) => {
  await jobApi.createJob({
    name: values.name,
    description: values.description,
    cronExpr: values.cronExpr,
    scriptId: values.scriptId
  });
};

// 任务状态控制
const handleStatusChange = (jobId, newStatus) => {
  if (newStatus === 'active') {
    jobApi.startJob(jobId);
  } else {
    jobApi.stopJob(jobId);
  }
};

// 删除任务
const handleDelete = (jobId) => {
  jobApi.deleteJob(jobId);
};

// 查看日志
const showJobLogs = (job) => {
  jobApi.getJobLogs(job.id);
};

// 手动执行
const handleExecute = (jobId) => {
  jobApi.executeJob(jobId);
};
```

### ScriptUpload.tsx (脚本管理页面)
```typescript
// 上传脚本
const handleSubmit = async (values) => {
  const formData = new FormData();
  uploadedFiles.forEach(file => {
    formData.append('files', file);
  });
  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('environment', values.environment);
  formData.append('parameters', values.parameters);
  
  await scriptApi.uploadScript(formData);
};

// 获取脚本列表
useEffect(() => {
  scriptApi.getScripts();
}, []);

// 查看脚本详情
const handleScriptDetail = (script) => {
  scriptApi.getScriptDetail(script.id);
};

// 编辑脚本
const handleUpdateScript = async (values) => {
  await scriptApi.updateScript(selectedScript.id, {
    name: values.name,
    description: values.description,
    environment: values.environment,
    parameters: values.parameters,
    content: values.content
  });
};

// 删除脚本
const handleDeleteScript = (scriptId) => {
  scriptApi.deleteScript(scriptId);
};

// 创建脚本（在线编辑）
const handleCreateScript = async (values) => {
  await scriptApi.createScript({
    name: values.name,
    description: values.description,
    fileName: values.fileName,
    type: values.type,
    environment: values.environment,
    parameters: values.parameters,
    content: values.content
  });
};
```

---

## 🔧 11. 开发建议

### 后端实现要点
1. **文件上传安全**: 严格验证文件类型和内容，支持的类型：.sh, .py, .js, .ts, .php, .sql, .bat
2. **脚本内容存储**: 数据库存储脚本内容，便于在线编辑和预览
3. **任务调度**: 集成Quartz等调度框架，支持Cron表达式解析
4. **日志管理**: 实现分页查询和日志清理策略
5. **状态同步**: 任务状态变更需要实时更新
6. **权限控制**: 实现完整的RBAC权限体系

### 前端对接要点
1. **表单验证**: Cron表达式、文件类型、文件大小等前端验证
2. **文件预览**: 脚本内容在线查看和编辑
3. **状态管理**: 任务和脚本的状态实时更新
4. **错误处理**: 统一的错误提示和处理机制
5. **用户体验**: 加载状态、操作反馈、确认对话框等

这份API文档完全基于现有前端功能设计，确保了前后端的完美对接！🚀