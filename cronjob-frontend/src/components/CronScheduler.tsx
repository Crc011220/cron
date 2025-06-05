import React, { useState } from 'react';
import {
  Card,
  Select,
  Input,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Table,
  Divider,
} from 'antd';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface CronEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: 'small' | 'middle' | 'large';
  showHelp?: boolean;
}

const CronEditor: React.FC<CronEditorProps> = ({
  value = '0 0 * * *',
  onChange,
  size = 'middle',
  showHelp = true
}) => {
  const [cronExpr, setCronExpr] = useState(value);

  // 当外部value变化时，更新内部状态
  React.useEffect(() => {
    setCronExpr(value);
  }, [value]);

  // 预定义的常用Cron表达式
  const commonCronExpressions = [
    { label: '每分钟执行', value: '* * * * *' },
    { label: '每小时执行', value: '0 * * * *' },
    { label: '每天凌晨执行', value: '0 0 * * *' },
    { label: '每周一凌晨执行', value: '0 0 * * 1' },
    { label: '每月1号凌晨执行', value: '0 0 1 * *' },
    { label: '工作日早上9点执行', value: '0 9 * * 1-5' },
    { label: '每天中午12点执行', value: '0 12 * * *' },
    { label: '每2小时执行', value: '0 */2 * * *' },
    { label: '每15分钟执行', value: '*/15 * * * *' },
    { label: '每周日凌晨2点执行', value: '0 2 * * 0' },
  ];

  // Cron字段解释
  const cronFields = [
    { name: '分钟', range: '0-59', example: '*/15 表示每15分钟' },
    { name: '小时', range: '0-23', example: '9-17 表示工作时间' },
    { name: '日期', range: '1-31', example: '1,15 表示每月1号和15号' },
    { name: '月份', range: '1-12', example: '*/3 表示每季度' },
    { name: '星期', range: '0-6', example: '1-5 表示工作日' },
  ];

  const tableColumns = [
    {
      title: '字段',
      dataIndex: 'name',
      key: 'name',
      width: 80,
    },
    {
      title: '取值范围',
      dataIndex: 'range',
      key: 'range',
      width: 100,
    },
    {
      title: '示例说明',
      dataIndex: 'example',
      key: 'example',
    },
  ];

  // 解析Cron表达式为可读文本
  const parseCronExpression = (expr: string): string => {
    try {
      const parts = expr.split(' ');
      if (parts.length !== 5) return '无效的Cron表达式';

      const [minute, hour, day, month, weekday] = parts;
      let description = '每';

      // 简单的解析逻辑
      if (minute === '*') description += '分钟';
      else if (minute.includes('/')) description += `${minute.split('/')[1]}分钟`;
      else if (minute === '0') description += '';
      else description += `${minute}分`;

      if (hour === '*') description += hour === '*' && minute !== '*' ? '' : '小时';
      else if (hour.includes('/')) description += `${hour.split('/')[1]}小时`;
      else if (hour !== '*') description += `${hour}点`;

      if (day !== '*') description += `${day}号`;
      if (month !== '*') description += `${month}月`;
      if (weekday !== '*') {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        if (weekday.includes('-')) {
          const [start, end] = weekday.split('-');
          description += `周${days[parseInt(start)]}到周${days[parseInt(end)]}`;
        } else {
          description += `周${days[parseInt(weekday)]}`;
        }
      }

      return description + '执行';
    } catch {
      return '无效的Cron表达式';
    }
  };

  const handleCronChange = (newValue: string) => {
    setCronExpr(newValue);
    onChange?.(newValue);
  };

  const handleQuickSelect = (selectedValue: string) => {
    handleCronChange(selectedValue);
  };

  return (
    <div>
      <Row gutter={24}>
        <Col span={showHelp ? 14 : 24}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                快速选择常用表达式
              </Text>
              <Select
                placeholder="选择常用的Cron表达式"
                onChange={handleQuickSelect}
                allowClear
                style={{ width: '100%' }}
                size={size}
              >
                {commonCronExpressions.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.label} ({item.value})
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Cron表达式
              </Text>
              <Input
                value={cronExpr}
                onChange={(e) => handleCronChange(e.target.value)}
                placeholder="如: 0 9 * * 1-5 (工作日早上9点执行)"
                style={{ fontFamily: 'monospace' }}
                size={size}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  格式: 分钟 小时 日期 月份 星期 (使用空格分隔)
                </Text>
                <br />
                <Text strong style={{ color: '#1890ff' }}>
                  解析结果: {parseCronExpression(cronExpr)}
                </Text>
              </div>
            </div>
          </Space>
        </Col>

        {showHelp && (
          <Col span={10}>
            <Card title="Cron表达式说明" size="small" bordered={false}>
              <Alert
                message="Cron表达式格式"
                description="由5个字段组成，用空格分隔: 分钟 小时 日期 月份 星期"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Table
                columns={tableColumns}
                dataSource={cronFields}
                pagination={false}
                size="small"
                style={{ marginBottom: 16 }}
              />

              <Divider />
              
              <Title level={5} style={{ fontSize: 14 }}>
                <InfoCircleOutlined /> 特殊字符说明
              </Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text style={{ fontSize: 12 }}><Text code>*</Text> 表示匹配任意值</Text>
                <Text style={{ fontSize: 12 }}><Text code>?</Text> 表示不指定值</Text>
                <Text style={{ fontSize: 12 }}><Text code>-</Text> 表示范围，如1-5</Text>
                <Text style={{ fontSize: 12 }}><Text code>,</Text> 表示列举，如1,3,5</Text>
                <Text style={{ fontSize: 12 }}><Text code>/</Text> 表示递增，如*/5表示每5个单位</Text>
              </Space>

              <Divider />

              <Title level={5} style={{ fontSize: 14 }}>常用示例</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text style={{ fontSize: 12 }}><Text code>0 0 * * *</Text> 每天凌晨0点</Text>
                <Text style={{ fontSize: 12 }}><Text code>*/30 * * * *</Text> 每30分钟</Text>
                <Text style={{ fontSize: 12 }}><Text code>0 9-17 * * 1-5</Text> 工作日9-17点整点</Text>
                <Text style={{ fontSize: 12 }}><Text code>0 0 1 * *</Text> 每月1号凌晨</Text>
                <Text style={{ fontSize: 12 }}><Text code>0 0 * * 0</Text> 每周日凌晨</Text>
              </Space>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CronEditor;