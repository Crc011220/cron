import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Button, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MonitorOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { menuUtils } from '../../utils/auth';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// 菜单项类型
type MenuItem = Required<MenuProps>['items'][number];

// 静态菜单配置（会根据权限动态过滤）
const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '工作台',
  },
  {
    key: '/scripts',
    icon: <FileTextOutlined />,
    label: '脚本管理',
  },
  {
    key: '/jobs',
    icon: <ScheduleOutlined />,
    label: '任务管理',
  },
  {
    key: '/cron',
    icon: <ClockCircleOutlined />,
    label: '调度配置',
  },
  {
    key: '/system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      {
        key: '/system/users',
        icon: <UserOutlined />,
        label: '用户管理',
      },
      {
        key: '/system/roles',
        icon: <TeamOutlined />,
        label: '角色管理',
      },
      {
        key: '/system/permissions',
        icon: <SafetyOutlined />,
        label: '权限管理',
      },
    ],
  },
  {
    key: '/monitor',
    icon: <MonitorOutlined />,
    label: '系统监控',
  },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole, hasPermission } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据权限过滤菜单
  const getFilteredMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item: any) => {
      // 检查菜单权限
      if (item.key === '/system' && !hasRole('ADMIN')) {
        return false;
      }
      if (item.key === '/monitor' && !hasRole('ADMIN')) {
        return false;
      }
      
      // 递归处理子菜单
      if (item.children) {
        item.children = getFilteredMenuItems(item.children);
        return item.children.length > 0;
      }
      
      return true;
    });
  };

  const filteredMenuItems = getFilteredMenuItems([...menuItems]);

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo区域 */}
        <div className="logo-container" style={{ 
          height: 64, 
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #303030'
        }}>
          <ClockCircleOutlined 
            style={{ 
              fontSize: 28, 
              color: '#1890ff',
              marginRight: collapsed ? 0 : 12
            }} 
          />
          {!collapsed && (
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              CronJob
            </Title>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/system']}
          items={filteredMenuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      {/* 主要内容区域 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        {/* 顶部导航 */}
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 40, height: 40 }}
            />
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              定时任务调度系统
            </Title>
          </Space>

          <Space>
            <span style={{ color: '#666' }}>
              欢迎回来，{user?.nickname || user?.username}
            </span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 112px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 