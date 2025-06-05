import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobList from './components/JobList';
import ScriptUpload from './components/ScriptUpload';
import CronScheduler from './components/CronScheduler';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

// 设置dayjs为中文
dayjs.locale('zh-cn');

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 登录页面 */}
          <Route path="/login" element={<Login />} />
          
          {/* 主要应用路由 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* 工作台 */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* 脚本管理 */}
            <Route 
              path="scripts" 
              element={
                <ProtectedRoute requiredPermission="MENU:SCRIPT:VIEW">
                  <ScriptUpload />
                </ProtectedRoute>
              } 
            />
            
            {/* 任务管理 */}
            <Route 
              path="jobs" 
              element={
                <ProtectedRoute requiredPermission="MENU:JOB:VIEW">
                  <JobList />
                </ProtectedRoute>
              } 
            />
            
            {/* 调度配置 */}
            <Route 
              path="cron" 
              element={
                <ProtectedRoute requiredPermission="MENU:JOB:VIEW">
                  <CronScheduler />
                </ProtectedRoute>
              } 
            />
            
            {/* 系统管理（仅管理员） */}
            <Route 
              path="system/*" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Routes>
                    <Route path="users" element={<div>用户管理页面（待开发）</div>} />
                    <Route path="roles" element={<div>角色管理页面（待开发）</div>} />
                    <Route path="permissions" element={<div>权限管理页面（待开发）</div>} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* 系统监控（仅管理员） */}
            <Route 
              path="monitor" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <div>系统监控页面（待开发）</div>
                </ProtectedRoute>
              } 
            />
            
            {/* 个人设置 */}
            <Route path="profile" element={<div>个人资料页面（待开发）</div>} />
            <Route path="settings" element={<div>账号设置页面（待开发）</div>} />
            
            {/* 默认重定向到工作台 - 修复：使用相对路径 */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* 403 无权限页面 */}
          <Route 
            path="/403" 
            element={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column'
              }}>
                <h1>403</h1>
                <p>抱歉，您没有权限访问此页面</p>
              </div>
            } 
          />
          
          {/* 404 页面 */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column'
              }}>
                <h1>404</h1>
                <p>页面未找到</p>
              </div>
            } 
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;