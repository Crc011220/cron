import React, { useState, useEffect } from 'react';
import {
  Upload,
  Button,
  Card,
  Form,
  Input,
  message,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Tag,
  Tabs,
  Table,
  Modal,
  Descriptions,
  Popconfirm,
} from 'antd';
import {
  InboxOutlined,
  UploadOutlined,
  FileTextOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface ScriptFile {
  name: string;
  content: string;
  size: number;
  type: string;
}

interface SavedScript {
  id: string;
  name: string;
  fileName: string;
  type: string;
  size: number;
  description: string;
  environment: string;
  parameters?: string;
  uploadTime: string;
  lastUsed?: string;
  usageCount: number;
  content: string;
}

const ScriptUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [uploadedFiles, setUploadedFiles] = useState<ScriptFile[]>([]);
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedScript, setSelectedScript] = useState<SavedScript | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  // 模拟已保存的脚本数据
  useEffect(() => {
    const mockScripts: SavedScript[] = [
      {
        id: '1',
        name: '数据库备份脚本',
        fileName: 'backup.sh',
        type: 'Shell脚本',
        size: 2048,
        description: '用于定期备份MySQL数据库的脚本',
        environment: 'bash',
        parameters: '--host localhost\n--port 3306\n--database myapp',
        uploadTime: '2024-01-15 10:30:00',
        lastUsed: '2024-01-20 02:00:00',
        usageCount: 25,
        content: '#!/bin/bash\n\n# MySQL数据库备份脚本\nDATE=$(date +%Y%m%d_%H%M%S)\nBACKUP_DIR="/backup"\nDB_NAME="myapp"\n\nmysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql\n\nif [ $? -eq 0 ]; then\n    echo "备份成功: backup_$DATE.sql"\nelse\n    echo "备份失败!"\n    exit 1\nfi',
      },
      {
        id: '2',
        name: '日志清理脚本',
        fileName: 'cleanup.py',
        type: 'Python脚本',
        size: 1536,
        description: '清理指定目录下超过30天的日志文件',
        environment: 'python3',
        parameters: '--days 30\n--path /var/log/myapp',
        uploadTime: '2024-01-10 15:20:00',
        lastUsed: '2024-01-14 00:00:00',
        usageCount: 12,
        content: '#!/usr/bin/env python3\n\nimport os\nimport sys\nimport time\nimport argparse\nfrom datetime import datetime, timedelta\n\ndef cleanup_logs(path, days):\n    """清理指定天数前的日志文件"""\n    cutoff_time = time.time() - (days * 24 * 60 * 60)\n    deleted_count = 0\n    \n    for root, dirs, files in os.walk(path):\n        for file in files:\n            if file.endswith(\'.log\'):\n                file_path = os.path.join(root, file)\n                if os.path.getmtime(file_path) < cutoff_time:\n                    os.remove(file_path)\n                    deleted_count += 1\n                    print(f"删除文件: {file_path}")\n    \n    print(f"清理完成，共删除 {deleted_count} 个日志文件")\n\nif __name__ == "__main__":\n    parser = argparse.ArgumentParser()\n    parser.add_argument("--days", type=int, default=30)\n    parser.add_argument("--path", required=True)\n    args = parser.parse_args()\n    \n    cleanup_logs(args.path, args.days)',
      },
      {
        id: '3',
        name: '报表生成脚本',
        fileName: 'report.js',
        type: 'JavaScript脚本',
        size: 3072,
        description: '生成月度业务报表并发送邮件',
        environment: 'node',
        parameters: '--month current\n--email admin@company.com',
        uploadTime: '2024-01-01 09:15:00',
        lastUsed: '2024-01-01 08:00:00',
        usageCount: 8,
        content: 'const fs = require(\'fs\');\nconst path = require(\'path\');\nconst nodemailer = require(\'nodemailer\');\n\nclass ReportGenerator {\n  constructor() {\n    this.transporter = nodemailer.createTransporter({\n      // 邮件配置\n    });\n  }\n\n  async generateReport(month) {\n    console.log("开始生成 " + month + " 月度报表...");\n    \n    // 查询数据库获取数据\n    const data = await this.fetchData(month);\n    \n    // 生成报表\n    const report = this.createReport(data);\n    \n    // 保存文件\n    const fileName = "report_" + month + ".html";\n    fs.writeFileSync(fileName, report);\n    \n    console.log("报表生成完成: " + fileName);\n    return fileName;\n  }\n\n  async fetchData(month) {\n    // 模拟数据查询\n    return {\n      sales: 150000,\n      orders: 1250,\n      users: 890\n    };\n  }\n\n  createReport(data) {\n    return "\n    <html>\n      <head><title>月度报表</title></head>\n      <body>\n        <h1>业务报表</h1>\n        <p>销售额: " + data.sales + "</p>\n        <p>订单数: " + data.orders + "</p>\n        <p>用户数: " + data.users + "</p>\n      </body>\n    </html>\n    ";\n  }\n}\n\nmodule.exports = ReportGenerator;',
      },
      {
        id: '4',
        name: '系统监控脚本',
        fileName: 'monitor.sh',
        type: 'Shell脚本',
        size: 1024,
        description: '监控系统CPU、内存、磁盘使用率',
        environment: 'bash',
        parameters: '--threshold 80\n--alert-email ops@company.com',
        uploadTime: '2024-01-19 16:45:00',
        usageCount: 0,
        content: '#!/bin/bash\n\n# 系统监控脚本\nTHRESHOLD=80\nALERT_EMAIL="ops@company.com"\n\n# 检查CPU使用率\nCPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | awk -F\'%\' \'{print $1}\')\necho "CPU使用率: $CPU_USAGE%"\n\n# 检查内存使用率\nMEM_USAGE=$(free | grep Mem | awk \'{printf("%.1f", $3/$2 * 100.0)}\')\necho "内存使用率: $MEM_USAGE%"\n\n# 检查磁盘使用率\nDISK_USAGE=$(df -h | awk \'$NF=="/"{printf "%d", $5}\')\necho "磁盘使用率: $DISK_USAGE%"\n\n# 如果超过阈值则发送告警\nif (( $(echo "$CPU_USAGE > $THRESHOLD" | bc -l) )) || \n   (( $(echo "$MEM_USAGE > $THRESHOLD" | bc -l) )) || \n   (( $DISK_USAGE > $THRESHOLD )); then\n    echo "系统资源使用率超过阈值，发送告警邮件..."\n    # 这里可以添加邮件发送逻辑\nfi',
      },
    ];
    
    setSavedScripts(mockScripts);
  }, []);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.sh,.py,.js,.ts,.php,.sql,.bat',
    beforeUpload: (file) => {
      // 限制文件大小为10MB
      const isLtMaxSize = file.size / 1024 / 1024 < 10;
      if (!isLtMaxSize) {
        message.error('脚本文件大小不能超过10MB!');
        return false;
      }

      // 读取文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const scriptFile: ScriptFile = {
          name: file.name,
          content,
          size: file.size,
          type: file.type || getFileTypeByExtension(file.name),
        };
        setUploadedFiles(prev => [...prev, scriptFile]);
      };
      reader.readAsText(file);
      
      return false; // 阻止自动上传
    },
    onDrop(e) {
      console.log('拖拽文件', e.dataTransfer.files);
    },
  };

  const getFileTypeByExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap: { [key: string]: string } = {
      'sh': 'Shell脚本',
      'py': 'Python脚本',
      'js': 'JavaScript脚本',
      'ts': 'TypeScript脚本',
      'php': 'PHP脚本',
      'sql': 'SQL脚本',
      'bat': 'Windows批处理脚本',
    };
    return typeMap[ext || ''] || '未知类型';
  };

  const getFileTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'Shell脚本': 'green',
      'Python脚本': 'blue',
      'JavaScript脚本': 'orange',
      'TypeScript脚本': 'purple',
      'PHP脚本': 'cyan',
      'SQL脚本': 'magenta',
      'Windows批处理脚本': 'red',
    };
    return colorMap[type] || 'default';
  };

  const handleSubmit = async (values: any) => {
    if (uploadedFiles.length === 0) {
      message.error('请先上传脚本文件！');
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用后端API上传脚本
      // const response = await api.uploadScript({
      //   ...values,
      //   scripts: uploadedFiles
      // });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('脚本上传成功！');
      form.resetFields();
      setUploadedFiles([]);
    } catch (error) {
      message.error('脚本上传失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleScriptDetail = (script: SavedScript) => {
    setSelectedScript(script);
    setDetailModalVisible(true);
  };

  const handleDeleteScript = async (scriptId: string) => {
    try {
      // 这里调用API删除脚本
      setSavedScripts(prev => prev.filter(s => s.id !== scriptId));
      message.success('脚本删除成功');
    } catch (error) {
      message.error('脚本删除失败');
    }
  };

  const handleDownloadScript = (script: SavedScript) => {
    const element = document.createElement('a');
    const file = new Blob([script.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = script.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    message.success('脚本下载成功');
  };

  const handleEditScript = (script: SavedScript) => {
    setSelectedScript(script);
    editForm.setFieldsValue({
      name: script.name,
      description: script.description,
      environment: script.environment,
      parameters: script.parameters,
      content: script.content,
    });
    setEditModalVisible(true);
  };

  const handleUpdateScript = async (values: any) => {
    if (!selectedScript) return;
    
    try {
      // 这里调用API更新脚本
      const updatedScript = {
        ...selectedScript,
        name: values.name,
        description: values.description,
        environment: values.environment,
        parameters: values.parameters,
        content: values.content,
      };
      
      setSavedScripts(prev => 
        prev.map(s => s.id === selectedScript.id ? updatedScript : s)
      );
      
      message.success('脚本更新成功');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedScript(null);
    } catch (error) {
      message.error('脚本更新失败');
    }
  };

  // 脚本列表表格配置
  const scriptColumns: ColumnsType<SavedScript> = [
    {
      title: '脚本名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: SavedScript) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.fileName}
          </Text>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getFileTypeColor(type)}>{type}</Tag>
      ),
      width: 120,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024).toFixed(1)} KB`,
      width: 80,
    },
    {
      title: '运行环境',
      dataIndex: 'environment',
      key: 'environment',
      width: 100,
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count}</Tag>
      ),
      width: 90,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 150,
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (time: string) => time || '-',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: SavedScript) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleScriptDetail(record)}
          >
            详情
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditScript(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadScript(record)}
          >
            下载
          </Button>
          <Popconfirm
            title="确定要删除这个脚本吗？"
            onConfirm={() => handleDeleteScript(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 260,
    },
  ];

  return (
    <div>
      <Title level={2}>脚本管理</Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'upload',
            label: (
              <span>
                <UploadOutlined /> 脚本上传
              </span>
            ),
            children: (
              <div>
                <Alert
                  message="支持的脚本类型"
                  description="支持 .sh, .py, .js, .ts, .php, .sql, .bat 等脚本文件，单个文件大小不超过10MB"
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />

                <Row gutter={24}>
                  <Col span={14}>
                    <Card title="上传脚本文件" bordered={false}>
                      <Dragger {...props} style={{ marginBottom: 16 }}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                        <p className="ant-upload-hint">
                          支持单个或批量上传脚本文件。请确保脚本代码安全可靠。
                        </p>
                      </Dragger>

                      {uploadedFiles.length > 0 && (
                        <Card size="small" title="已上传文件" style={{ marginTop: 16 }}>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              padding: '8px 0',
                              borderBottom: index < uploadedFiles.length - 1 ? '1px solid #f0f0f0' : 'none'
                            }}>
                              <Space>
                                <FileTextOutlined />
                                <Text>{file.name}</Text>
                                <Tag color={getFileTypeColor(file.type)}>{file.type}</Tag>
                                <Text type="secondary">
                                  {(file.size / 1024).toFixed(1)} KB
                                </Text>
                              </Space>
                              <Button 
                                size="small" 
                                danger 
                                onClick={() => removeFile(index)}
                              >
                                删除
                              </Button>
                            </div>
                          ))}
                        </Card>
                      )}
                    </Card>
                  </Col>

                  <Col span={10}>
                    <Card title="脚本信息配置" bordered={false}>
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                      >
                        <Form.Item
                          name="name"
                          label="任务名称"
                          rules={[{ required: true, message: '请输入任务名称!' }]}
                        >
                          <Input placeholder="输入任务名称" />
                        </Form.Item>

                        <Form.Item
                          name="description"
                          label="任务描述"
                          rules={[{ required: true, message: '请输入任务描述!' }]}
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="描述这个脚本的功能和用途"
                          />
                        </Form.Item>

                        <Form.Item
                          name="environment"
                          label="运行环境"
                          rules={[{ required: true, message: '请输入运行环境!' }]}
                        >
                          <Input placeholder="如: python3, node, bash 等" />
                        </Form.Item>

                        <Form.Item
                          name="parameters"
                          label="运行参数"
                        >
                          <TextArea 
                            rows={2} 
                            placeholder="脚本运行时的参数，每行一个"
                          />
                        </Form.Item>

                        <Form.Item>
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            icon={<UploadOutlined />}
                            disabled={uploadedFiles.length === 0}
                            block
                          >
                            上传脚本
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'manage',
            label: (
              <span>
                <FolderOpenOutlined /> 脚本管理
              </span>
            ),
            children: (
              <div>
                <Card 
                  title={`已保存脚本 (${savedScripts.length})`}
                  extra={
                    <Text type="secondary">
                      共 {savedScripts.reduce((sum, s) => sum + s.usageCount, 0)} 次使用
                    </Text>
                  }
                >
                  <Table
                    columns={scriptColumns}
                    dataSource={savedScripts}
                    rowKey="id"
                    pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => 
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条脚本`,
                    }}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* 脚本详情弹窗 */}
      <Modal
        title="脚本详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => selectedScript && handleDownloadScript(selectedScript)}>
            下载脚本
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedScript && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="脚本名称" span={2}>
                {selectedScript.name}
              </Descriptions.Item>
              <Descriptions.Item label="文件名">
                {selectedScript.fileName}
              </Descriptions.Item>
              <Descriptions.Item label="脚本类型">
                <Tag color={getFileTypeColor(selectedScript.type)}>
                  {selectedScript.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="文件大小">
                {(selectedScript.size / 1024).toFixed(1)} KB
              </Descriptions.Item>
              <Descriptions.Item label="运行环境">
                {selectedScript.environment}
              </Descriptions.Item>
              <Descriptions.Item label="使用次数">
                <Tag color={selectedScript.usageCount > 0 ? 'blue' : 'default'}>
                  {selectedScript.usageCount} 次
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="上传时间">
                {selectedScript.uploadTime}
              </Descriptions.Item>
              <Descriptions.Item label="最后使用">
                {selectedScript.lastUsed || '未使用'}
              </Descriptions.Item>
              <Descriptions.Item label="脚本描述" span={2}>
                {selectedScript.description}
              </Descriptions.Item>
              {selectedScript.parameters && (
                <Descriptions.Item label="运行参数" span={2}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedScript.parameters}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>
            
            <Card title="脚本内容" size="small">
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                maxHeight: '400px',
                overflow: 'auto',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                {selectedScript.content}
              </pre>
            </Card>
          </div>
        )}
      </Modal>

      {/* 编辑脚本弹窗 */}
      <Modal
        title="编辑脚本"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedScript(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateScript}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="脚本名称"
                name="name"
                rules={[
                  { required: true, message: '请输入脚本名称' },
                  { max: 50, message: '脚本名称不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入脚本名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="运行环境"
                name="environment"
                rules={[{ required: true, message: '请输入运行环境' }]}
              >
                <Input placeholder="如: python3, node, bash 等" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="脚本描述"
            name="description"
            rules={[
              { required: true, message: '请输入脚本描述' },
              { max: 200, message: '脚本描述不能超过200个字符' }
            ]}
          >
            <TextArea
              rows={3}
              placeholder="请输入脚本描述，说明此脚本的用途和执行内容"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label="运行参数"
            name="parameters"
          >
            <TextArea
              rows={2}
              placeholder="脚本运行时的参数，每行一个"
            />
          </Form.Item>

          <Form.Item
            label="脚本内容"
            name="content"
            rules={[{ required: true, message: '请输入脚本内容' }]}
          >
            <TextArea
              rows={12}
              placeholder="请输入脚本内容"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedScript(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScriptUpload;