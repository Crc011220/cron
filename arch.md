# 定时任务调度系统

## 项目概述
企业级定时任务调度平台，支持用户上传脚本、配置定时执行计划，具备完整的用户管理、权限控制、任务监控等功能。

## 核心功能
- **脚本管理**：支持多种脚本上传(.sh, .py, .js, .php, .sql等)
- **任务调度**：基于Cron表达式的灵活调度配置
- **用户认证**：JWT Token登录认证系统
- **权限控制**：基于RBAC的细粒度权限管理
- **执行监控**：实时任务状态监控和日志记录
- **系统管理**：管理员可管理全局资源和用户

## 技术栈
- **前端**：React 18 + TypeScript + Ant Design
- **后端**：Spring Boot 3.x + MyBatis Plus + Redis
- **数据库**：MySQL 8.0
- **缓存**：Redis 7.x
- **调度器**：Quartz Scheduler
- **认证**：JWT Token + Spring Security

## 系统架构

### 总体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React前端     │───▶│  Spring Boot    │───▶│    MySQL       │
│   (Nginx部署)   │    │    后端服务     │    │    数据库      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   缓存/会话     │
                       └─────────────────┘
```

### 部署架构选择

#### 方案一：单机部署（推荐用于中小型团队）
- **前端**：Nginx静态资源服务
- **后端**：单个Spring Boot应用
- **数据库**：MySQL单实例
- **缓存**：Redis单实例
- **优势**：部署简单，成本低，维护容易
- **适用**：≤100用户，≤1000任务

#### 方案二：分布式部署（推荐用于大型团队）
- **前端**：CDN + Nginx集群
- **后端**：Spring Boot多实例 + 负载均衡
- **数据库**：MySQL主从/集群
- **缓存**：Redis集群
- **优势**：高可用，高性能，可扩展
- **适用**：>100用户，>1000任务

## 权限系统设计 (RBAC)

### 角色定义
| 角色编码 | 角色名称 | 权限范围 | 功能权限 |
|----------|----------|----------|----------|
| **ADMIN** | 系统管理员 | 全局 | 用户管理、全局脚本管理、系统配置、监控管理 |
| **USER** | 普通员工 | 个人 | 个人脚本管理、个人任务管理、执行日志查看 |

### 权限矩阵
| 功能模块 | 管理员 | 普通员工 |
|----------|--------|----------|
| 用户管理 | ✅ 增删改查 | ❌ |
| 脚本管理 | ✅ 全局增删改查 | ✅ 个人增删改查 |
| 任务管理 | ✅ 全局增删改查 | ✅ 个人增删改查 |
| 执行日志 | ✅ 全局查看 | ✅ 个人查看 |
| 系统监控 | ✅ | ❌ |
| 系统配置 | ✅ | ❌ |

### 资源类型说明
| 类型值 | 类型名称 | 说明 | 示例 |
|--------|----------|------|------|
| 1 | 菜单 | 前端页面菜单 | 任务管理、脚本管理 |
| 2 | 按钮 | 页面操作按钮 | 创建任务、删除脚本 |
| 3 | API | 后端接口资源 | /api/jobs, /api/scripts |

### 权限编码规范
```
格式：{模块}:{操作}:{资源}
示例：
- SCRIPT:CREATE:ALL (脚本创建-全局)
- SCRIPT:VIEW:OWN (脚本查看-个人)
- JOB:DELETE:ALL (任务删除-全局)
- USER:MANAGE:ALL (用户管理-全局)
```

### 预置权限数据示例
```sql
-- 菜单权限
INSERT INTO permission (permission_name, permission_code, resource_type) VALUES
('脚本管理菜单', 'MENU:SCRIPT:VIEW', 1),
('任务管理菜单', 'MENU:JOB:VIEW', 1),
('用户管理菜单', 'MENU:USER:VIEW', 1);

-- 按钮权限  
INSERT INTO permission (permission_name, permission_code, resource_type) VALUES
('创建脚本按钮', 'BUTTON:SCRIPT:CREATE', 2),
('删除任务按钮', 'BUTTON:JOB:DELETE', 2);

-- API权限
INSERT INTO permission (permission_name, permission_code, resource_type, resource_path, method) VALUES
('脚本列表接口', 'API:SCRIPT:LIST', 3, '/api/scripts', 'GET'),
('创建任务接口', 'API:JOB:CREATE', 3, '/api/jobs', 'POST');
```

### 权限实现机制
- **接口级权限**：@PreAuthorize注解控制
- **数据级权限**：SQL查询添加用户ID过滤
- **前端权限**：基于角色的菜单和按钮显示控制
- **动态权限**：支持运行时权限分配和回收

## 数据库设计

### 用户表 (user)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| username | VARCHAR(64) | | NOT NULL | | 用户名 |
| password | VARCHAR(128) | | NOT NULL | | 密码 |
| email | VARCHAR(128) | | NOT NULL | | 邮箱地址 |
| nickname | VARCHAR(64) | | | | 昵称 |
| status | TINYINT | | | 1 | 状态：0禁用 1启用 |
| last_login_time | DATETIME | | | | 最后登录时间 |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | | | CURRENT_TIMESTAMP | 更新时间 |

### 角色表 (role)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| role_name | VARCHAR(64) | | NOT NULL | | 角色名称 |
| role_code | VARCHAR(64) | | NOT NULL | | 角色编码 |
| description | TEXT | | | | 角色描述 |
| status | TINYINT | | | 1 | 状态：0禁用 1启用 |
| sort_order | INT | | | 0 | 排序 |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | | | CURRENT_TIMESTAMP | 更新时间 |

### 权限表 (permission)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| permission_name | VARCHAR(128) | | NOT NULL | | 权限名称 |
| permission_code | VARCHAR(128) | | NOT NULL | | 权限编码 |
| resource_type | TINYINT | | NOT NULL | | 资源类型：1菜单 2按钮 3API |
| resource_path | VARCHAR(256) | | | | 资源路径/API地址 |
| method | VARCHAR(16) | | | | HTTP方法 |
| description | TEXT | | | | 权限描述 |
| parent_id | BIGINT | | | 0 | 父权限ID |
| status | TINYINT | | | 1 | 状态：0禁用 1启用 |
| sort_order | INT | | | 0 | 排序 |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | | | CURRENT_TIMESTAMP | 更新时间 |

### 菜单表 (menu)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| menu_name | VARCHAR(64) | | NOT NULL | | 菜单名称 |
| menu_code | VARCHAR(64) | | NOT NULL | | 菜单编码 |
| path | VARCHAR(256) | | | | 路由路径 |
| component | VARCHAR(256) | | | | 组件路径 |
| icon | VARCHAR(64) | | | | 菜单图标 |
| parent_id | BIGINT | | | 0 | 父菜单ID |
| menu_type | TINYINT | | | 1 | 菜单类型：1目录 2菜单 3按钮 |
| visible | TINYINT | | | 1 | 是否显示：0隐藏 1显示 |
| status | TINYINT | | | 1 | 状态：0禁用 1启用 |
| sort_order | INT | | | 0 | 排序 |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | | | CURRENT_TIMESTAMP | 更新时间 |

### 用户角色关联表 (user_role)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| user_id | BIGINT | | NOT NULL | | 用户ID |
| role_id | BIGINT | | NOT NULL | | 角色ID |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |

### 角色权限关联表 (role_permission)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| role_id | BIGINT | | NOT NULL | | 角色ID |
| permission_id | BIGINT | | NOT NULL | | 权限ID |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |

### 任务表 (job)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| name | VARCHAR(128) | | NOT NULL | | 任务名称 |
| description | TEXT | | | | 任务描述 |
| cron_expr | VARCHAR(64) | | NOT NULL | | Cron表达式 |
| script_id | BIGINT | | NOT NULL | | 关联脚本ID |
| user_id | BIGINT | | NOT NULL | | 创建用户ID |
| status | TINYINT | | | 1 | 状态：0停用 1启用 2运行中 3错误 |
| success_count | INT | | | 0 | 成功次数 |
| failure_count | INT | | | 0 | 失败次数 |
| last_run_time | DATETIME | | | | 上次执行时间 |
| next_run_time | DATETIME | | | | 下次执行时间 |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | | | CURRENT_TIMESTAMP | 更新时间 |

### 脚本表 (script)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| name | VARCHAR(128) | | NOT NULL | | 脚本名称 |
| description | TEXT | | | | 脚本描述 |
| file_name | VARCHAR(256) | | NOT NULL | | 文件名 |
| file_size | BIGINT | | NOT NULL | | 文件大小(字节) |
| type | VARCHAR(64) | | NOT NULL | | 脚本类型 |
| environment | VARCHAR(64) | | NOT NULL | | 运行环境 |
| parameters | TEXT | | | | 运行参数 |
| content | LONGTEXT | | NOT NULL | | 脚本内容 |
| user_id | BIGINT | | NOT NULL | | 上传用户ID |
| usage_count | INT | | | 0 | 使用次数 |
| last_used | DATETIME | | | | 最后使用时间 |
| upload_time | DATETIME | | | CURRENT_TIMESTAMP | 上传时间 |

### 执行日志表 (job_log)

| 字段名 | 数据类型 | 主键 | 是否为空 | 默认值 | 注释 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | Yes | NOT NULL | AUTO_INCREMENT | 主键ID |
| job_id | BIGINT | | NOT NULL | | 任务ID |
| start_time | DATETIME | | NOT NULL | | 开始时间 |
| end_time | DATETIME | | | | 结束时间 |
| duration | INT | | | | 执行时长(秒) |
| status | TINYINT | | NOT NULL | | 状态：0失败 1成功 2运行中 |
| output | LONGTEXT | | | | 执行输出 |
| error_msg | TEXT | | | | 错误信息 |
| exit_code | INT | | | | 退出码 |
| created_at | DATETIME | | | CURRENT_TIMESTAMP | 创建时间 |

## 认证授权流程

### 登录流程
```
用户登录 → 验证用户名密码 → 生成JWT Token → 返回Token和用户信息
     ↓
前端存储Token → 请求时携带Token → 后端验证Token → 获取用户信息
```

### JWT Token设计
```json
{
  "sub": "用户ID",
  "username": "用户名",
  "role": "角色",
  "iat": "签发时间",
  "exp": "过期时间"
}
```

## 开发与质量保证

### 开发流程
1. **功能开发** → **单元测试** → **代码审查** → **集成测试** → **部署上线**

### 测试策略
| 测试类型 | 触发时机 | 覆盖率要求 | 工具 |
|----------|----------|------------|------|
| **单元测试** | 代码提交时 | >80% | JUnit 5 + Mockito |
| **接口测试** | 合并代码时 | 100%核心接口 | Spring Boot Test |
| **集成测试** | 发布前 | 关键流程 | TestContainers |

### CI/CD流程
```
代码提交 → 单元测试 → 代码扫描 → 构建镜像 → 自动部署测试环境 → 集成测试 → 手动部署生产
```

### 代码质量要求
- **代码规范**：使用SonarQube进行静态代码分析
- **安全扫描**：集成安全漏洞扫描
- **性能测试**：JMeter压力测试
- **文档要求**：API文档、部署文档、用户手册

## 监控与运维

### 应用监控
- **性能监控**：Spring Boot Actuator + Micrometer
- **日志管理**：ELK Stack (Elasticsearch + Logstash + Kibana)
- **错误追踪**：异常日志收集和告警
- **业务监控**：任务执行成功率、响应时间等

### 运维指标
| 指标类型 | 监控项 | 告警阈值 |
|----------|--------|----------|
| **系统资源** | CPU、内存、磁盘 | >80% |
| **应用性能** | 响应时间、QPS | >2s, <100QPS |
| **业务指标** | 任务成功率 | <95% |
| **错误率** | 5xx错误 | >1% |

## 安全设计

### 安全措施
- **密码安全**：BCrypt加密存储
- **接口安全**：JWT Token + HTTPS
- **SQL注入防护**：MyBatis参数化查询
- **XSS防护**：前端输入过滤和转义
- **CSRF防护**：Token验证
- **权限控制**：接口级和数据级双重权限验证

### 数据备份
- **数据库备份**：每日自动备份
- **脚本文件备份**：定期备份脚本内容
- **配置备份**：系统配置版本化管理

## 表关系说明

### 业务表关系
- user表与job表：一对多关系（一个用户可以创建多个任务）
- user表与script表：一对多关系（一个用户可以上传多个脚本）
- script表与job表：一对多关系（一个脚本可以被多个任务使用）
- job表与job_log表：一对多关系（一个任务可以有多个执行日志）

### RBAC权限系统表关系
- user表与role表：多对多关系（通过user_role表关联，一个用户可以有多个角色）
- role表与permission表：多对多关系（通过role_permission表关联，一个角色可以有多个权限）
- permission表与menu表：一对一或一对多关系（权限对应菜单或API资源）
- menu表：树形结构（通过parent_id实现菜单层级）
- permission表：树形结构（通过parent_id实现权限层级）

## SQL建表语句

### 1. 用户表
```sql
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username` VARCHAR(64) NOT NULL COMMENT '用户名',
    `password` VARCHAR(128) NOT NULL COMMENT '密码',
    `email` VARCHAR(128) NOT NULL COMMENT '邮箱地址',
    `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_user_username` (`username`),
    UNIQUE KEY `idx_user_email` (`email`),
    KEY `idx_user_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

### 2. 角色表
```sql
CREATE TABLE `role` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_name` VARCHAR(64) NOT NULL COMMENT '角色名称',
    `role_code` VARCHAR(64) NOT NULL COMMENT '角色编码',
    `description` TEXT DEFAULT NULL COMMENT '角色描述',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_role_code` (`role_code`),
    KEY `idx_role_status` (`status`),
    KEY `idx_role_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
```

### 3. 权限表
```sql
CREATE TABLE `permission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `permission_name` VARCHAR(128) NOT NULL COMMENT '权限名称',
    `permission_code` VARCHAR(128) NOT NULL COMMENT '权限编码',
    `resource_type` TINYINT NOT NULL COMMENT '资源类型：1菜单 2按钮 3API',
    `resource_path` VARCHAR(256) DEFAULT NULL COMMENT '资源路径/API地址',
    `method` VARCHAR(16) DEFAULT NULL COMMENT 'HTTP方法',
    `description` TEXT DEFAULT NULL COMMENT '权限描述',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父权限ID',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_permission_code` (`permission_code`),
    KEY `idx_permission_resource_type` (`resource_type`),
    KEY `idx_permission_parent_id` (`parent_id`),
    KEY `idx_permission_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';
```

### 4. 菜单表
```sql
CREATE TABLE `menu` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `menu_name` VARCHAR(64) NOT NULL COMMENT '菜单名称',
    `menu_code` VARCHAR(64) NOT NULL COMMENT '菜单编码',
    `path` VARCHAR(256) DEFAULT NULL COMMENT '路由路径',
    `component` VARCHAR(256) DEFAULT NULL COMMENT '组件路径',
    `icon` VARCHAR(64) DEFAULT NULL COMMENT '菜单图标',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父菜单ID',
    `menu_type` TINYINT DEFAULT 1 COMMENT '菜单类型：1目录 2菜单 3按钮',
    `visible` TINYINT DEFAULT 1 COMMENT '是否显示：0隐藏 1显示',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_menu_code` (`menu_code`),
    KEY `idx_menu_parent_id` (`parent_id`),
    KEY `idx_menu_type` (`menu_type`),
    KEY `idx_menu_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';
```

### 5. 用户角色关联表
```sql
CREATE TABLE `user_role` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_user_role_unique` (`user_id`, `role_id`),
    KEY `idx_user_role_user_id` (`user_id`),
    KEY `idx_user_role_role_id` (`role_id`),
    CONSTRAINT `fk_user_role_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';
```

### 6. 角色权限关联表
```sql
CREATE TABLE `role_permission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `permission_id` BIGINT NOT NULL COMMENT '权限ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_role_permission_unique` (`role_id`, `permission_id`),
    KEY `idx_role_permission_role_id` (`role_id`),
    KEY `idx_role_permission_permission_id` (`permission_id`),
    CONSTRAINT `fk_role_permission_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_role_permission_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';
```

### 7. 脚本表
```sql
CREATE TABLE `script` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(128) NOT NULL COMMENT '脚本名称',
    `description` TEXT DEFAULT NULL COMMENT '脚本描述',
    `file_name` VARCHAR(256) NOT NULL COMMENT '文件名',
    `file_size` BIGINT NOT NULL COMMENT '文件大小(字节)',
    `type` VARCHAR(64) NOT NULL COMMENT '脚本类型',
    `environment` VARCHAR(64) NOT NULL COMMENT '运行环境',
    `parameters` TEXT DEFAULT NULL COMMENT '运行参数',
    `content` LONGTEXT NOT NULL COMMENT '脚本内容',
    `user_id` BIGINT NOT NULL COMMENT '上传用户ID',
    `usage_count` INT DEFAULT 0 COMMENT '使用次数',
    `last_used` DATETIME DEFAULT NULL COMMENT '最后使用时间',
    `upload_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    PRIMARY KEY (`id`),
    KEY `idx_script_type` (`type`),
    KEY `idx_script_upload_time` (`upload_time`),
    KEY `idx_script_user_id` (`user_id`),
    CONSTRAINT `fk_script_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='脚本表';
```

### 8. 任务表
```sql
CREATE TABLE `job` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(128) NOT NULL COMMENT '任务名称',
    `description` TEXT DEFAULT NULL COMMENT '任务描述',
    `cron_expr` VARCHAR(64) NOT NULL COMMENT 'Cron表达式',
    `script_id` BIGINT NOT NULL COMMENT '关联脚本ID',
    `user_id` BIGINT NOT NULL COMMENT '创建用户ID',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0停用 1启用 2运行中 3错误',
    `success_count` INT DEFAULT 0 COMMENT '成功次数',
    `failure_count` INT DEFAULT 0 COMMENT '失败次数',
    `last_run_time` DATETIME DEFAULT NULL COMMENT '上次执行时间',
    `next_run_time` DATETIME DEFAULT NULL COMMENT '下次执行时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_job_status` (`status`),
    KEY `idx_job_next_run_time` (`next_run_time`),
    KEY `idx_job_script_id` (`script_id`),
    KEY `idx_job_user_id` (`user_id`),
    CONSTRAINT `fk_job_script_id` FOREIGN KEY (`script_id`) REFERENCES `script` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_job_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';
```

### 9. 执行日志表
```sql
CREATE TABLE `job_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `job_id` BIGINT NOT NULL COMMENT '任务ID',
    `start_time` DATETIME NOT NULL COMMENT '开始时间',
    `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
    `duration` INT DEFAULT NULL COMMENT '执行时长(秒)',
    `status` TINYINT NOT NULL COMMENT '状态：0失败 1成功 2运行中',
    `output` LONGTEXT DEFAULT NULL COMMENT '执行输出',
    `error_msg` TEXT DEFAULT NULL COMMENT '错误信息',
    `exit_code` INT DEFAULT NULL COMMENT '退出码',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_job_log_job_id` (`job_id`),
    KEY `idx_job_log_start_time` (`start_time`),
    KEY `idx_job_log_status` (`status`),
    CONSTRAINT `fk_job_log_job_id` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='执行日志表';
```

## 初始化数据

### 1. 初始化角色数据
```sql
INSERT INTO `role` (`role_name`, `role_code`, `description`) VALUES
('系统管理员', 'ADMIN', '拥有系统所有权限的管理员角色'),
('普通员工', 'USER', '只能管理个人脚本和任务的普通用户角色');
```

### 2. 初始化权限数据
```sql
-- 菜单权限
INSERT INTO `permission` (`permission_name`, `permission_code`, `resource_type`, `description`) VALUES
('脚本管理菜单', 'MENU:SCRIPT:VIEW', 1, '脚本管理页面访问权限'),
('任务管理菜单', 'MENU:JOB:VIEW', 1, '任务管理页面访问权限'),
('用户管理菜单', 'MENU:USER:VIEW', 1, '用户管理页面访问权限'),
('系统监控菜单', 'MENU:MONITOR:VIEW', 1, '系统监控页面访问权限');

-- 按钮权限
INSERT INTO `permission` (`permission_name`, `permission_code`, `resource_type`, `description`) VALUES
('创建脚本', 'BUTTON:SCRIPT:CREATE', 2, '创建脚本按钮权限'),
('编辑脚本', 'BUTTON:SCRIPT:EDIT', 2, '编辑脚本按钮权限'),
('删除脚本', 'BUTTON:SCRIPT:DELETE', 2, '删除脚本按钮权限'),
('创建任务', 'BUTTON:JOB:CREATE', 2, '创建任务按钮权限'),
('编辑任务', 'BUTTON:JOB:EDIT', 2, '编辑任务按钮权限'),
('删除任务', 'BUTTON:JOB:DELETE', 2, '删除任务按钮权限'),
('启动任务', 'BUTTON:JOB:START', 2, '启动任务按钮权限'),
('停止任务', 'BUTTON:JOB:STOP', 2, '停止任务按钮权限');

-- API权限
INSERT INTO `permission` (`permission_name`, `permission_code`, `resource_type`, `resource_path`, `method`, `description`) VALUES
('脚本列表接口', 'API:SCRIPT:LIST', 3, '/api/scripts', 'GET', '获取脚本列表'),
('创建脚本接口', 'API:SCRIPT:CREATE', 3, '/api/scripts', 'POST', '创建脚本'),
('更新脚本接口', 'API:SCRIPT:UPDATE', 3, '/api/scripts/*', 'PUT', '更新脚本'),
('删除脚本接口', 'API:SCRIPT:DELETE', 3, '/api/scripts/*', 'DELETE', '删除脚本'),
('任务列表接口', 'API:JOB:LIST', 3, '/api/jobs', 'GET', '获取任务列表'),
('创建任务接口', 'API:JOB:CREATE', 3, '/api/jobs', 'POST', '创建任务'),
('更新任务接口', 'API:JOB:UPDATE', 3, '/api/jobs/*', 'PUT', '更新任务'),
('删除任务接口', 'API:JOB:DELETE', 3, '/api/jobs/*', 'DELETE', '删除任务'),
('启动任务接口', 'API:JOB:START', 3, '/api/jobs/*/start', 'POST', '启动任务'),
('停止任务接口', 'API:JOB:STOP', 3, '/api/jobs/*/stop', 'POST', '停止任务'),
('用户管理接口', 'API:USER:MANAGE', 3, '/api/users/*', '*', '用户管理相关接口');
```

### 3. 初始化菜单数据
```sql
INSERT INTO `menu` (`menu_name`, `menu_code`, `path`, `component`, `icon`, `parent_id`, `menu_type`, `sort_order`) VALUES
('工作台', 'DASHBOARD', '/dashboard', 'Dashboard', 'DashboardOutlined', 0, 2, 1),
('脚本管理', 'SCRIPT_MANAGE', '/scripts', 'ScriptUpload', 'FileTextOutlined', 0, 2, 2),
('任务管理', 'JOB_MANAGE', '/jobs', 'JobList', 'ScheduleOutlined', 0, 2, 3),
('调度配置', 'CRON_CONFIG', '/cron', 'CronScheduler', 'ClockCircleOutlined', 0, 2, 4),
('系统管理', 'SYSTEM', '/system', null, 'SettingOutlined', 0, 1, 5),
('用户管理', 'USER_MANAGE', '/system/users', 'UserManage', 'UserOutlined', 5, 2, 1),
('角色管理', 'ROLE_MANAGE', '/system/roles', 'RoleManage', 'TeamOutlined', 5, 2, 2),
('权限管理', 'PERMISSION_MANAGE', '/system/permissions', 'PermissionManage', 'SafetyOutlined', 5, 2, 3),
('系统监控', 'MONITOR', '/monitor', 'SystemMonitor', 'MonitorOutlined', 0, 2, 6);
```

### 4. 初始化管理员账户和权限
```sql
-- 创建管理员用户 (密码: admin123，需要使用BCrypt加密)
INSERT INTO `user` (`username`, `password`, `email`, `nickname`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKTnHT0rP7MHqQ8Lj8qfQZYuZZVq', 'admin@example.com', '系统管理员');

-- 分配管理员角色
INSERT INTO `user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 给管理员角色分配所有权限
INSERT INTO `role_permission` (`role_id`, `permission_id`)
SELECT 1, id FROM `permission`;

-- 给普通用户角色分配基础权限
INSERT INTO `role_permission` (`role_id`, `permission_id`)
SELECT 2, id FROM `permission` WHERE `permission_code` IN (
    'MENU:SCRIPT:VIEW', 'MENU:JOB:VIEW',
    'BUTTON:SCRIPT:CREATE', 'BUTTON:SCRIPT:EDIT', 'BUTTON:SCRIPT:DELETE',
    'BUTTON:JOB:CREATE', 'BUTTON:JOB:EDIT', 'BUTTON:JOB:DELETE', 'BUTTON:JOB:START', 'BUTTON:JOB:STOP',
    'API:SCRIPT:LIST', 'API:SCRIPT:CREATE', 'API:SCRIPT:UPDATE', 'API:SCRIPT:DELETE',
    'API:JOB:LIST', 'API:JOB:CREATE', 'API:JOB:UPDATE', 'API:JOB:DELETE', 'API:JOB:START', 'API:JOB:STOP'
);
```


