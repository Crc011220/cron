import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Modal,
  Descriptions,
  Statistic,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Popconfirm,
  message,
  Badge,
  Form,
  Divider,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  BarChartOutlined,
  PlusOutlined,
  FileTextOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { jobApi, scriptApi } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import PermissionButton from './Auth/PermissionButton';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Job {
  id: string;
  name: string;
  description?: string;
  cronExpr: string;
  scriptId?: string;
  scriptPath: string;
  status: number; 
  lastRun?: string;
  nextRun: string;
  createdAt: string;
  successCount: number;
  failureCount: number;
}

interface JobLog {
  id: string;
  jobId: string;
  execTime: string;
  status: 'success' | 'failure' | 'running';
  output: string;
  errorMsg?: string;
  duration: number;
}

interface Script {
  id: string;
  name: string;
  type: string;
  path: string;
  size: number;
  uploadTime: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // 加载任务列表
  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {
        current: pagination.current,
        size: pagination.pageSize,
        status: statusFilter === 'all' ? undefined : parseInt(statusFilter),
        keyword: searchText || undefined,
      };
      
      const response = await jobApi.getJobs(params);
      console.log('API响应:', response);
      
      if (response && response.code === 200) {
        // 处理后端返回的分页数据
        const pageData = response.data;
        setJobs(pageData.records || []);
        setPagination(prev => ({
          ...prev,
          total: pageData.total || 0,
        }));
      } else {
        message.error(response?.message || '获取任务列表失败');
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
      message.error('获取任务列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 加载脚本列表
  const loadScripts = async () => {
    try {
      const response = await scriptApi.getScripts();
      if (response && response.code === 200) {
        setScripts(response.data || []);
      }
    } catch (error) {
      console.error('获取脚本列表失败:', error);
    }
  };

  useEffect(() => {
    loadJobs();
    loadScripts();
  }, [pagination.current, pagination.pageSize, statusFilter, searchText]);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'processing'; // 启用
      case 2: return 'processing'; // 运行中
      case 3: return 'error';      // 错误
      default: return 'default';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return '已停止'; 
      case 1: return '运行中';
      case 2: return '已停止';
      case 3: return '执行中';
      case 4: return '错误';
      default: return '未知';
    }
  };

  // 暂时禁用任务状态控制功能，等后端实现相关接口
  const handleStatusChange = async (jobId: string, newStatus: string) => {
    message.warning('任务状态控制功能暂未开放，请等待后端接口实现');
    return;
  };

  const handleDelete = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await jobApi.deleteJob(jobId);
      if (response && response.code === 200) {
        message.success('任务删除成功');
        loadJobs(); // 重新加载列表
      } else {
        message.error(response?.message || '删除失败');
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (values: any) => {
    setLoading(true);
    try {
      const response = await jobApi.createJob(values);
      if (response && response.code === 200) {
        message.success('任务创建成功');
        setCreateModalVisible(false);
        form.resetFields();
        loadJobs(); // 重新加载列表
      } else {
        message.error(response?.message || '任务创建失败');
      }
    } catch (error) {
      console.error('创建任务失败:', error);
      message.error('任务创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    editForm.setFieldsValue({
      name: job.name,
      description: job.description,
      cronExpr: job.cronExpr,
      scriptPath: job.scriptPath,
    });
    setEditModalVisible(true);
  };

  const handleUpdateJob = async (values: any) => {
    if (!selectedJob) return;
    
    setLoading(true);
    try {
      const response = await jobApi.updateJob(selectedJob.id, values);
      if (response && response.code === 200) {
        message.success('任务更新成功');
        setEditModalVisible(false);
        editForm.resetFields();
        setSelectedJob(null);
        loadJobs(); // 重新加载列表
      } else {
        message.error(response?.message || '任务更新失败');
      }
    } catch (error) {
      console.error('更新任务失败:', error);
      message.error('任务更新失败');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextRun = (cronExpr: string): string => {
    // 这里应该实现真正的cron表达式解析
    // 现在只是返回一个示例时间
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toLocaleString();
  };

  const showJobDetails = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const showJobLogs = (job: Job) => {
    message.warning('日志查看功能暂未开放，请等待后端接口实现');
    return;
  };

  const getScriptTypeIcon = (type: string) => {
    return <FileTextOutlined style={{ color: '#1890ff' }} />;
  };

  const getScriptTypeColor = (type: string) => {
    switch (type) {
      case 'shell': return 'green';
      case 'python': return 'blue';
      case 'javascript': return 'yellow';
      case 'php': return 'purple';
      case 'sql': return 'cyan';
      default: return 'default';
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadJobs();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (paginationInfo: any) => {
    setPagination({
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
      total: pagination.total,
    });
  };

  const columns: ColumnsType<Job> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Job) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Cron表达式',
      dataIndex: 'cronExpr',
      key: 'cronExpr',
      render: (expr: string) => <Text code>{expr}</Text>,
    },
    {
      title: '脚本路径',
      dataIndex: 'scriptPath',
      key: 'scriptPath',
      render: (path: string) => (
        <Text ellipsis style={{ width: 200 }}>
          {path}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Badge
          status={getStatusColor(status)}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: '成功/失败次数',
      key: 'counts',
      render: (_, record: Job) => (
        <div>
          <Tag color="green">{record.successCount || 0}</Tag>
          <Tag color="red">{record.failureCount || 0}</Tag>
        </div>
      ),
    },
    {
      title: '下次执行',
      dataIndex: 'nextRun',
      key: 'nextRun',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Job) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showJobDetails(record)}
          >
            详情
          </Button>
          <PermissionButton
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditJob(record)}
            permission="BTN:JOB:EDIT"
          >
            编辑
          </PermissionButton>
          <PermissionButton
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => showJobLogs(record)}
            permission="BTN:JOB:LOG"
            disabled  // 暂时禁用
          >
            日志
          </PermissionButton>
          <PermissionButton
            size="small"
            icon={record.status === 1 ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            type={record.status === 1 ? 'default' : 'primary'}
            onClick={() => handleStatusChange(record.id, record.status === 1 ? '0' : '1')}
            loading={loading}
            permission="BTN:JOB:CONTROL"
            disabled  // 暂时禁用
          >
            {record.status === 1 ? '停止' : '启动'}
          </PermissionButton>
          <Popconfirm
            title="确定要删除这个任务吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <PermissionButton
              size="small"
              icon={<DeleteOutlined />}
              danger
              loading={loading}
              permission="BTN:JOB:DELETE"
            >
              删除
            </PermissionButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeJobs = jobs.filter(job => job.status === 1).length;
  const runningJobs = jobs.filter(job => job.status === 2).length;
  const errorJobs = jobs.filter(job => job.status === 3).length;

  return (
    <div>
      <Title level={2}>任务管理</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={pagination.total}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中"
              value={activeJobs}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="执行中"
              value={runningJobs}
              prefix={<ReloadOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="错误状态"
              value={errorJobs}
              prefix={<DeleteOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="搜索任务名称或描述"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="状态筛选"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value="all">全部状态</Option>
              <Option value="1">运行中</Option>
              <Option value="0">已停止</Option>
              <Option value="2">执行中</Option>
              <Option value="3">错误</Option>
            </Select>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                创建任务
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadJobs}
                loading={loading}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 任务列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条任务`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 任务详情弹窗 */}
      <Modal
        title="任务详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedJob && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="任务名称" span={2}>
              {selectedJob.name}
            </Descriptions.Item>
            <Descriptions.Item label="任务描述" span={2}>
              {selectedJob.description || '无'}
            </Descriptions.Item>
            <Descriptions.Item label="Cron表达式">
              <Text code>{selectedJob.cronExpr}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedJob.status)}
                text={getStatusText(selectedJob.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="脚本路径" span={2}>
              {selectedJob.scriptPath}
            </Descriptions.Item>
            <Descriptions.Item label="成功次数">
              <Tag color="green">{selectedJob.successCount || 0}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="失败次数">
              <Tag color="red">{selectedJob.failureCount || 0}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="上次执行">
              {selectedJob.lastRun || '未执行'}
            </Descriptions.Item>
            <Descriptions.Item label="下次执行">
              {selectedJob.nextRun || '未设置'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {selectedJob.createdAt}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 执行日志弹窗 */}
      <Modal
        title="执行日志"
        open={logsModalVisible}
        onCancel={() => setLogsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setLogsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div>日志功能暂未实现</div>
      </Modal>

      {/* 创建任务弹窗 */}
      <Modal
        title="创建任务"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateJob}
        >
          <Form.Item
            label="任务名称"
            name="name"
            rules={[
              { required: true, message: '请输入任务名称' },
              { max: 50, message: '任务名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>

          <Form.Item
            label="任务描述"
            name="description"
            rules={[{ max: 200, message: '任务描述不能超过200个字符' }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入任务描述"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label="Cron表达式"
            name="cronExpr"
            rules={[
              { required: true, message: '请输入Cron表达式' },
              { 
                pattern: /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
                message: '请输入有效的Cron表达式'
              }
            ]}
          >
            <Input placeholder="例如：0 2 * * * (每天凌晨2点)" />
          </Form.Item>

          <Form.Item
            label="脚本路径"
            name="scriptPath"
            rules={[{ required: true, message: '请输入脚本路径' }]}
          >
            <Select placeholder="请选择脚本">
              {scripts.map(script => (
                <Option key={script.id} value={script.path}>
                  <Space>
                    {getScriptTypeIcon(script.type)}
                    {script.name}
                    <Tag color={getScriptTypeColor(script.type)} style={{ fontSize: '12px' }}>
                      {script.type}
                    </Tag>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建任务
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑任务弹窗 */}
      <Modal
        title="编辑任务"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedJob(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateJob}
        >
          <Form.Item
            label="任务名称"
            name="name"
            rules={[
              { required: true, message: '请输入任务名称' },
              { max: 50, message: '任务名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>

          <Form.Item
            label="任务描述"
            name="description"
            rules={[{ max: 200, message: '任务描述不能超过200个字符' }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入任务描述"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label="Cron表达式"
            name="cronExpr"
            rules={[
              { required: true, message: '请输入Cron表达式' },
              { 
                pattern: /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
                message: '请输入有效的Cron表达式'
              }
            ]}
          >
            <Input placeholder="例如：0 2 * * * (每天凌晨2点)" />
          </Form.Item>

          <Form.Item
            label="脚本路径"
            name="scriptPath"
            rules={[{ required: true, message: '请输入脚本路径' }]}
          >
            <Select placeholder="请选择脚本">
              {scripts.map(script => (
                <Option key={script.id} value={script.path}>
                  <Space>
                    {getScriptTypeIcon(script.type)}
                    {script.name}
                    <Tag color={getScriptTypeColor(script.type)} style={{ fontSize: '12px' }}>
                      {script.type}
                    </Tag>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedJob(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                更新任务
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobList;