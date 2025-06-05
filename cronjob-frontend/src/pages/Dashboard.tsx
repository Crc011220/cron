import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Table, 
  Tag, 
  Space,
  Button,
  List,
  Avatar,
  Progress,
  Alert
} from 'antd';
import {
  ScheduleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface DashboardData {
  stats: {
    totalJobs: number;
    runningJobs: number;
    totalScripts: number;
    successRate: number;
  };
  recentJobs: any[];
  recentLogs: any[];
  systemStatus: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalJobs: 0,
      runningJobs: 0,
      totalScripts: 0,
      successRate: 0,
    },
    recentJobs: [],
    recentLogs: [],
    systemStatus: {
      cpu: 0,
      memory: 0,
      disk: 0,
    },
  });

  // 模拟数据加载
  useEffect(() => {
    const loadDashboardData = () => {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        setData({
          stats: {
            totalJobs: 24,
            runningJobs: 8,
            totalScripts: 36,
            successRate: 95.6,
          },
          recentJobs: [
            {
              id: '1',
              name: '数据备份任务',
              status: 1,
              nextRun: dayjs().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
              script: 'backup.sh',
            },
            {
              id: '2',
              name: '日志清理任务',
              status: 2,
              nextRun: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
              script: 'cleanup.py',
            },
            {
              id: '3',
              name: '数据同步任务',
              status: 3,
              nextRun: dayjs().add(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
              script: 'sync.js',
            },
          ],
          recentLogs: [
            {
              id: '1',
              jobName: '数据备份任务',
              status: 1,
              time: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
              duration: 120,
            },
            {
              id: '2',
              jobName: '报表生成任务',
              status: 1,
              time: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
              duration: 45,
            },
            {
              id: '3',
              jobName: '邮件发送任务',
              status: 0,
              time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
              duration: 0,
            },
          ],
          systemStatus: {
            cpu: 45,
            memory: 62,
            disk: 78,
          },
        });
        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  const getJobStatusTag = (status: number) => {
    const statusMap = {
      0: { color: 'default', text: '已停止' },
      1: { color: 'processing', text: '运行中' },
      2: { color: 'warning', text: '执行中' },
      3: { color: 'error', text: '错误' },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap[0];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getLogStatusTag = (status: number) => {
    return status === 1 ? 
      <Tag color="success" icon={<CheckCircleOutlined />}>成功</Tag> : 
      <Tag color="error" icon={<ExclamationCircleOutlined />}>失败</Tag>;
  };

  const jobColumns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getJobStatusTag(status),
    },
    {
      title: '下次执行',
      dataIndex: 'nextRun',
      key: 'nextRun',
    },
    {
      title: '脚本',
      dataIndex: 'script',
      key: 'script',
      render: (script: string) => <Text code>{script}</Text>,
    },
  ];

  return (
    <div>
      <Title level={2}>工作台</Title>
      <Text type="secondary">
        欢迎回来，{user?.nickname || user?.username}！当前时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}
      </Text>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={data.stats.totalJobs}
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中任务"
              value={data.stats.runningJobs}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="脚本总数"
              value={data.stats.totalScripts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功率"
              value={data.stats.successRate}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* 最近任务 */}
        <Col span={12}>
          <Card 
            title="最近任务" 
            extra={<Button type="link">查看更多</Button>}
            loading={loading}
          >
            <Table
              dataSource={data.recentJobs}
              columns={jobColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>

        {/* 执行日志 */}
        <Col span={12}>
          <Card 
            title="执行日志" 
            extra={<Button type="link">查看更多</Button>}
            loading={loading}
          >
            <List
              itemLayout="horizontal"
              dataSource={data.recentLogs}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={item.status === 1 ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                        style={{ 
                          backgroundColor: item.status === 1 ? '#52c41a' : '#ff4d4f' 
                        }}
                      />
                    }
                    title={
                      <Space>
                        <span>{item.jobName}</span>
                        {getLogStatusTag(item.status)}
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">{item.time}</Text>
                        {item.duration > 0 && (
                          <Text type="secondary">耗时: {item.duration}秒</Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态（仅管理员可见） */}
      {hasRole('ADMIN') && (
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="系统状态" loading={loading}>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Text>CPU使用率</Text>
                    <Progress
                      type="circle"
                      percent={data.systemStatus.cpu}
                      status={data.systemStatus.cpu > 80 ? 'exception' : 'normal'}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Text>内存使用率</Text>
                    <Progress
                      type="circle"
                      percent={data.systemStatus.memory}
                      status={data.systemStatus.memory > 80 ? 'exception' : 'normal'}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Text>磁盘使用率</Text>
                    <Progress
                      type="circle"
                      percent={data.systemStatus.disk}
                      status={data.systemStatus.disk > 80 ? 'exception' : 'normal'}
                    />
                  </div>
                </Col>
              </Row>
              
              {(data.systemStatus.cpu > 80 || data.systemStatus.memory > 80 || data.systemStatus.disk > 80) && (
                <Alert
                  message="系统资源告警"
                  description="系统资源使用率过高，请及时处理"
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard; 