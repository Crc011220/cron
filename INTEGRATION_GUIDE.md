# 前后端对接实施指南

## 🚀 快速开始

### 1. 环境配置
```bash
# 设置后端API地址（修正端口）
export REACT_APP_API_URL=http://localhost:8088/api

# 或者创建 .env 文件
echo "REACT_APP_API_URL=http://localhost:8088/api" > .env
```

### 2. 前端启动
```bash
cd cronjob-frontend
npm install
npm start
```

### 3. 支持的脚本类型
前端已配置支持以下脚本类型：
- `.sh` - Shell脚本
- `.py` - Python脚本  
- `.js` - JavaScript脚本
- `.ts` - TypeScript脚本
- `.php` - PHP脚本
- `.sql` - SQL脚本
- `.bat` - Windows批处理脚本

## 📋 对接检查清单

### ✅ 第一阶段：认证系统对接（最高优先级）

#### 1. 用户认证模块
- [ ] `POST /api/auth/login` - 用户登录接口
  - **测试方法**: 访问系统会自动跳转到登录页面，输入用户名密码登录
  - **前端位置**: `src/pages/Login.tsx` 和 `src/store/useAuthStore.ts`
  - **关键响应**: 必须返回token、user、roles、permissions、menus完整信息
  
- [ ] `POST /api/auth/logout` - 用户登出
  - **测试方法**: 点击右上角用户头像的"退出登录"
  - **前端位置**: `src/components/Layout/MainLayout.tsx`

- [ ] `GET /api/auth/me` - 获取当前用户信息
  - **测试方法**: 页面刷新时验证Token有效性
  - **前端位置**: `src/store/useAuthStore.ts` 初始化时调用

- [ ] `POST /api/auth/refresh` - Token刷新
  - **测试方法**: Token过期时自动触发
  - **前端位置**: `src/services/api.ts` 响应拦截器

**认证系统必需的响应格式**:
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

### ✅ 第二阶段：核心功能对接

#### 2. 脚本管理模块（优先级最高）
- [ ] `POST /api/scripts/upload` - 脚本上传接口
  - **测试方法**: 进入"脚本管理"页面的"脚本上传"标签，拖拽文件上传
  - **前端位置**: `ScriptUpload.tsx` 第257行 `handleSubmit`
  - **注意事项**: 支持多文件上传，FormData格式，包含脚本信息

- [ ] `GET /api/scripts` - 获取脚本列表
  - **测试方法**: 切换到"脚本管理"标签页，查看脚本列表
  - **前端位置**: `ScriptUpload.tsx` 第154行 `useEffect`
  - **预期响应**: 分页的脚本数组，包含完整脚本信息

- [ ] `GET /api/scripts/{id}` - 获取脚本详情
  - **测试方法**: 在脚本列表点击"详情"按钮
  - **前端位置**: `ScriptUpload.tsx` 第273行 `handleScriptDetail`

- [ ] `POST /api/scripts` - 在线创建脚本
  - **测试方法**: 在脚本管理页面选择"在线创建脚本"功能
  - **前端位置**: `ScriptUpload.tsx` - 在线编辑器创建
  - **注意事项**: 纯JSON格式，包含脚本内容

- [ ] `PUT /api/scripts/{id}` - 更新脚本
  - **测试方法**: 在脚本列表点击"编辑"按钮，修改并保存
  - **前端位置**: `ScriptUpload.tsx` 第294行 `handleUpdateScript`

- [ ] `DELETE /api/scripts/{id}` - 删除脚本
  - **测试方法**: 在脚本列表点击"删除"按钮
  - **前端位置**: `ScriptUpload.tsx` 第277行 `handleDeleteScript`

#### 3. 任务管理模块
- [ ] `GET /api/jobs` - 任务列表接口
  - **测试方法**: 打开首页，检查任务列表是否正常加载
  - **前端位置**: `JobList.tsx` - 页面初始化时调用
  - **预期响应**: 包含任务数组的JSON对象，使用records字段

- [ ] `POST /api/jobs` - 创建任务接口
  - **测试方法**: 在任务列表点击"创建任务"按钮，填写表单提交
  - **前端位置**: `JobList.tsx` - 创建任务弹窗表单
  - **依赖**: 需要先有脚本数据用于选择

- [ ] `POST /api/jobs/{id}/start` - 启动任务
  - **测试方法**: 在任务列表点击"启动"按钮
  - **前端位置**: `JobList.tsx` - 状态切换操作

- [ ] `POST /api/jobs/{id}/stop` - 停止任务
  - **测试方法**: 在任务列表点击"停止"按钮
  - **前端位置**: `JobList.tsx` - 状态切换操作

- [ ] `DELETE /api/jobs/{id}` - 删除任务
  - **测试方法**: 在任务列表点击"删除"按钮
  - **前端位置**: `JobList.tsx` - 删除操作

- [ ] `POST /api/jobs/{id}/execute` - 手动执行任务
  - **测试方法**: 在任务列表点击"执行"按钮
  - **前端位置**: `JobList.tsx` - 手动执行功能

#### 4. 日志查看模块
- [ ] `GET /api/jobs/{id}/logs` - 获取执行日志
  - **测试方法**: 在任务列表点击"日志"按钮
  - **前端位置**: `JobList.tsx` - 日志查看功能

#### 5. 系统统计模块
- [ ] `GET /api/stats` - 系统统计信息
  - **测试方法**: 首页顶部统计卡片是否正常显示
  - **前端位置**: `JobList.tsx` - 页面初始化时调用

- [ ] `GET /api/jobs/stats` - 任务统计信息
  - **测试方法**: 任务管理页面的统计卡片
  - **前端位置**: `JobList.tsx` - 页面初始化时调用

### ✅ 第三阶段：增强功能对接

#### 6. Cron表达式处理
- [ ] `POST /api/cron/validate` - 验证Cron表达式
  - **测试方法**: 创建/编辑任务时输入Cron表达式
  - **前端位置**: `JobList.tsx` - 表单验证

- [ ] `POST /api/cron/next-runs` - 获取下次执行时间
  - **测试方法**: 任务列表显示下次执行时间
  - **前端位置**: `JobList.tsx` - 任务信息展示

- [ ] `POST /api/cron/parse` - 解析Cron表达式
  - **测试方法**: 显示Cron表达式的可读描述
  - **前端位置**: `JobList.tsx` - 可读性展示

#### 7. 任务编辑功能
- [ ] `PUT /api/jobs/{id}` - 更新任务
- [ ] `GET /api/stats/trends` - 执行趋势数据

#### 8. 系统管理功能（管理员）
- [ ] `/api/system/users/*` - 用户管理
- [ ] `/api/system/roles/*` - 角色管理  
- [ ] `/api/system/permissions/*` - 权限管理

#### 9. 系统监控功能（管理员）
- [ ] `/api/monitor/system` - 系统状态
- [ ] `/api/monitor/stats` - 执行统计
- [ ] `/api/monitor/resources` - 资源使用
- [ ] `/api/monitor/history` - 执行历史

## 🔧 前端配置修改指南

### 1. API地址配置
修改 `src/services/api.ts` 中的 baseURL：
```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8088/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. 认证拦截器配置
前端已配置完整的认证拦截器：
```typescript
// 请求拦截器 - 自动添加Token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      tokenUtils.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. 权限验证配置
前端已实现完整的权限验证系统：
```typescript
// 路由守卫
<ProtectedRoute requiredPermission="MENU:JOB:VIEW">
  <JobList />
</ProtectedRoute>

// 权限按钮
<PermissionButton permission="BTN:JOB:CREATE">
  <Button>创建任务</Button>
</PermissionButton>
```

## 🧪 测试指南

### 1. 认证流程测试
```bash
# 测试登录流程
1. 访问系统 → 自动跳转登录页
2. 输入错误密码 → 显示错误提示
3. 输入正确密码 → 登录成功，跳转工作台
4. 刷新页面 → 保持登录状态
5. 点击退出 → 退出登录，跳转登录页
```

### 2. 权限验证测试
```bash
# 使用不同角色用户测试
1. 管理员用户 → 可以看到所有菜单和功能
2. 普通用户 → 只能看到有权限的菜单和功能
3. 访问无权限页面 → 跳转403页面
```

### 3. 前端功能测试

#### 脚本管理测试流程
1. **文件上传测试**
   ```
   进入脚本管理 → 脚本上传标签 → 拖拽文件 → 填写信息 → 提交
   ```
   - 测试多种文件类型：.sh, .py, .js, .ts, .php, .sql, .bat
   - 测试文件大小限制（10MB）
   - 测试表单验证

2. **脚本管理测试**
   ```
   脚本管理标签 → 查看列表 → 详情 → 在线创建 → 编辑 → 删除
   ```
   - 测试分页功能
   - 测试搜索筛选
   - 测试在线编辑器
   - 测试权限控制

#### 任务管理测试流程
1. **任务创建测试**
   ```
   任务列表 → 创建任务 → 填写信息 → 选择脚本 → 配置Cron → 提交
   ```
   - 测试Cron表达式验证
   - 测试脚本选择下拉框
   - 测试表单验证

2. **任务操作测试**
   ```
   任务列表 → 启动/停止 → 手动执行 → 查看日志 → 编辑 → 删除任务
   ```
   - 测试状态切换
   - 测试日志展示
   - 测试权限控制

#### 集成测试流程
```
登录 → 上传脚本 → 创建任务 → 启动任务 → 手动执行 → 查看日志 → 检查统计 → 停止任务
```

## 🐛 常见问题解决

### 1. CORS跨域问题
后端需要配置CORS允许前端域名：
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class JobController {
    // ...
}

// 或全局配置
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### 2. 文件上传问题
确保后端配置文件上传大小限制：
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
```

### 3. 认证Token问题
前端Token管理：
```typescript
// Token过期自动刷新
if (error.response?.status === 401) {
  // 尝试刷新Token
  const refreshResponse = await authApi.refreshToken();
  if (refreshResponse.code === 200) {
    // 重新发起原请求
    return api.request(originalRequest);
  } else {
    // 跳转登录页
    window.location.href = '/login';
  }
}
```

### 4. 权限验证问题
后端权限拦截器：
```java
@Component
public class PermissionInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) {
        // 获取用户权限
        // 检查接口权限
        // 返回验证结果
    }
}
```

### 5. 分页数据格式
前端期望的分页格式：
```json
{
  "code": 200,
  "data": {
    "records": [...],  // 数据数组
    "total": 100,      // 总数量
    "current": 1,      // 当前页
    "size": 10         // 每页大小
  }
}
```

### 6. Cron表达式验证
前端已集成Cron表达式验证：
```typescript
// 标准5位或6位Cron表达式
const cronPattern = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
```

## 📊 性能优化建议

### 1. 前端优化
- **文件上传**: 大文件使用分片上传（可考虑后续优化）
- **列表加载**: 脚本和任务列表都支持分页
- **搜索防抖**: 搜索输入已添加防抖处理
- **状态缓存**: 适当缓存脚本列表和任务状态
- **权限缓存**: 用户权限信息缓存到本地

### 2. 后端优化
- **分页查询**: 所有列表接口必须支持分页
- **索引优化**: 为常用查询字段添加数据库索引
- **权限缓存**: 用户权限信息Redis缓存
- **异步处理**: 脚本执行使用异步队列
- **Token优化**: JWT Token合理设置过期时间

## 🔒 安全注意事项

### 1. 认证安全（重要）
- **JWT Token**: 使用RS256算法签名，设置合理过期时间
- **密码加密**: 使用BCrypt等强加密算法
- **权限验证**: 每个接口都必须验证用户权限
- **Session管理**: 支持单设备登录或多设备管理

### 2. 脚本安全（重要）
- **文件类型检查**: 严格验证上传文件扩展名
- **内容扫描**: 扫描脚本中的危险命令（rm -rf, format, etc.）
- **沙箱执行**: 在隔离环境中执行脚本
- **权限控制**: 限制脚本执行权限
- **用户隔离**: 不同用户的脚本和任务隔离

### 3. 接口安全
- **参数验证**: 所有输入参数严格验证
- **SQL注入防护**: 使用参数化查询
- **XSS防护**: 脚本内容输出时进行转义
- **CSRF防护**: 使用CSRF Token
- **文件上传安全**: 
  - 限制文件大小
  - 检查文件头信息
  - 病毒扫描
  - 存储路径随机化

### 4. 权限安全
- **最小权限原则**: 用户只能访问必要的资源
- **权限继承**: 角色权限继承设计
- **操作审计**: 记录关键操作日志
- **敏感操作**: 删除等敏感操作需要二次确认

## 📈 监控和日志

### 1. 前端监控
- **错误监控**: 集成Sentry等错误监控服务
- **性能监控**: 监控页面加载时间和API响应时间
- **用户行为**: 记录关键操作行为
- **权限监控**: 监控权限验证失败

### 2. 后端监控
- **接口监控**: 监控接口响应时间和成功率
- **认证监控**: 监控登录失败、Token过期等
- **文件上传监控**: 监控上传成功率和耗时
- **脚本执行监控**: 监控脚本执行状态和资源占用

### 3. 业务监控
- **任务执行情况**: 监控任务成功率和执行时长
- **脚本使用统计**: 统计脚本使用频次
- **用户操作统计**: 统计各功能使用情况
- **系统性能**: CPU、内存、磁盘使用情况

## 🚀 部署建议

### 1. 前端部署
```bash
# 构建生产版本
npm run build

# 使用nginx部署，配置API代理
location /api {
    proxy_pass http://backend:8088/api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Authorization $http_authorization;
}
```

### 2. 后端部署
```bash
# 配置应用参数
server.port=8088
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# 配置JWT
jwt.secret=your-secret-key
jwt.expiration=3600

# 配置脚本存储路径
script.upload.path=/data/scripts
script.execution.timeout=300
```

### 3. 数据库配置
```sql
-- 建议的数据库连接池配置
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000

-- Redis配置（用于权限缓存）
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.timeout=2000
```

### 4. 安全配置
```properties
# HTTPS配置
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=password

# 安全头配置
security.headers.frame=DENY
security.headers.content-type=nosniff
security.headers.xss=1; mode=block
```

这份指南基于现有前端项目的实际功能设计，为后端开发提供了详细的对接指导和最佳实践建议！🚀