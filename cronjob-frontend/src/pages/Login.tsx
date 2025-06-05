import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LoginRequest } from '../types/auth';
import './Login.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await login(values);
      message.success('登录成功！');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error?.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Space align="center" size="middle">
              <ClockCircleOutlined className="login-logo" />
              <div>
                <Title level={2} className="login-title">CronJob</Title>
                <Text type="secondary">定时任务调度系统</Text>
              </div>
            </Space>
          </div>

          <Form
            name="login"
            size="large"
            onFinish={onFinish}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text type="secondary">
              默认管理员账号：admin / admin123
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login; 