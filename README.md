# 定时任务调度系统 (CronJob System)

一个基于React + Spring Boot的企业级定时任务调度管理平台，支持脚本上传、任务调度、执行监控和完整的权限管理体系。

## 🚀 项目特性

### 前端特性
- ⚡ **现代化技术栈**: React 19.1.0 + TypeScript + Ant Design
- 🔐 **完整权限系统**: JWT认证 + RBAC权限模型
- 📱 **响应式设计**: 支持桌面端和移动端访问
- 🎨 **优雅界面**: 基于Ant Design的现代化UI设计
- 🔒 **路由守卫**: 基于权限的页面访问控制

### 后端特性（规划中）
- 🚀 **Spring Boot**: 企业级Java后端框架
- 📅 **任务调度**: 基于Quartz的强大调度引擎
- 📂 **脚本管理**: 支持多种脚本类型上传和执行
- 📊 **监控统计**: 实时任务监控和执行统计
- 🔐 **安全可靠**: 完整的认证授权和安全防护

## 📋 功能模块

### 已完成功能 ✅
- **用户认证系统**: 登录/登出、Token管理、权限验证
- **任务管理**: 任务创建、编辑、启停、删除、手动执行
- **脚本管理**: 脚本上传、在线编辑、版本管理
- **日志查看**: 任务执行日志查询和分析
- **系统监控**: 任务统计、执行趋势、系统状态
- **权限管理**: RBAC权限模型、菜单权限、按钮权限

### 开发中功能 🚧
- **后端API**: Spring Boot后端服务开发
- **任务调度引擎**: Quartz调度器集成
- **脚本执行引擎**: 安全的脚本执行环境
- **系统管理**: 用户管理、角色管理、权限配置

## 🛠 技术栈

### 前端技术栈
- **框架**: React 19.1.0
- **类型检查**: TypeScript 4.9.5
- **UI组件**: Ant Design 5.25.3
- **路由**: React Router 6.26.1
- **状态管理**: Zustand 4.4.7
- **HTTP客户端**: Axios 1.9.0
- **日期处理**: Day.js 1.11.10
- **代码检查**: ESLint + Prettier

### 后端技术栈（规划）
- **框架**: Spring Boot 3.x
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **任务调度**: Quartz
- **认证**: JWT + Spring Security
- **文档**: Swagger/OpenAPI

## 📁 项目结构

```
cronjob/
├── cronjob-frontend/          # React前端项目
│   ├── src/
│   │   ├── components/        # 通用组件
│   │   ├── pages/            # 页面组件
│   │   ├── services/         # API服务
│   │   ├── store/            # 状态管理
│   │   ├── utils/            # 工具函数
│   │   └── types/            # TypeScript类型定义
│   ├── public/               # 静态资源
│   └── package.json          # 前端依赖配置
├── cronjob-backend/          # Spring Boot后端项目（开发中）
├── API_DOCS.md              # API接口文档
├── API_SUMMARY.md           # API接口总览
├── INTEGRATION_GUIDE.md     # 前后端对接指南
├── CronJob_API_Tests.postman_collection.json  # Postman测试集合
├── arch.md                  # 项目架构文档
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 前端启动

```bash
# 进入前端目录
cd cronjob-frontend

# 安装依赖
npm install

# 启动开发服务器
npm start

# 访问应用
# 浏览器打开 http://localhost:3000
```

### 后端启动（开发中）

```bash
# 进入后端目录
cd cronjob-backend

# 使用Maven启动
mvn spring-boot:run

# 或使用Gradle启动
./gradlew bootRun

# API地址: http://localhost:8088/api
```

## 📊 支持的脚本类型

- **Shell脚本** (.sh) - Linux/Unix环境
- **Python脚本** (.py) - Python环境
- **JavaScript** (.js) - Node.js环境
- **TypeScript** (.ts) - TypeScript/Node.js环境
- **PHP脚本** (.php) - PHP环境
- **SQL脚本** (.sql) - 数据库脚本
- **批处理** (.bat) - Windows环境

## 🔐 权限系统

### 角色权限
- **系统管理员**: 拥有所有权限，可管理用户、角色、权限
- **任务管理员**: 可管理所有任务和脚本
- **普通用户**: 只能管理自己创建的任务和脚本

### 功能权限
- **菜单权限**: 控制页面访问权限
- **操作权限**: 控制按钮和功能权限
- **数据权限**: 控制数据访问范围

## 📈 系统监控

### 实时监控
- **任务状态**: 实时显示任务运行状态
- **执行统计**: 成功率、失败率、执行时长统计
- **系统资源**: CPU、内存、磁盘使用情况
- **在线用户**: 当前登录用户状态

### 历史分析
- **执行趋势**: 任务执行趋势分析
- **性能分析**: 脚本执行性能统计
- **错误分析**: 失败任务错误分析
- **用户行为**: 用户操作行为统计

## 🔒 安全特性

### 认证安全
- **JWT Token**: 基于RS256算法的Token认证
- **权限验证**: 完整的RBAC权限验证体系
- **会话管理**: 支持单设备登录控制
- **密码安全**: BCrypt加密存储

### 脚本安全
- **文件检查**: 严格的文件类型和内容验证
- **沙箱执行**: 隔离环境中执行脚本
- **权限控制**: 限制脚本执行权限
- **内容扫描**: 检测危险命令和恶意代码

## 📚 文档说明

- **[API接口文档](./API_DOCS.md)**: 详细的API接口说明
- **[接口总览](./API_SUMMARY.md)**: API接口优先级和对应关系
- **[对接指南](./INTEGRATION_GUIDE.md)**: 前后端对接实施指南
- **[架构文档](./arch.md)**: 系统架构和设计说明
- **[Postman测试](./CronJob_API_Tests.postman_collection.json)**: API接口测试集合

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **作者**: Ruochen Chen
- **邮箱**: [your-email@example.com]
- **GitHub**: [https://github.com/Crc011220/cron](https://github.com/Crc011220/cron)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

⭐ 如果这个项目对您有帮助，请给个星星支持一下！ 