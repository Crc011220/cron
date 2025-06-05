/**
 * Cron表达式工具函数
 */

// 验证Cron表达式格式
export const validateCronExpression = (expression: string): boolean => {
  if (!expression) return false;
  
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  
  // 基本的格式验证
  const patterns = [
    /^(\*|([0-5]?\d)(-([0-5]?\d))?)(\/\d+)?$/,  // 分钟 (0-59)
    /^(\*|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?)(\/\d+)?$/,  // 小时 (0-23)
    /^(\*|([01]?\d|2\d|3[01])(-([01]?\d|2\d|3[01]))?)(\/\d+)?$/,  // 日期 (1-31)
    /^(\*|([01]?\d)(-([01]?\d))?)(\/\d+)?$/,  // 月份 (1-12)
    /^(\*|[0-6](-[0-6])?)(\/\d+)?$/,  // 星期 (0-6)
  ];
  
  return parts.every((part, index) => patterns[index].test(part));
};

// 解析Cron表达式为人类可读的描述
export const parseCronDescription = (expression: string): string => {
  if (!validateCronExpression(expression)) {
    return '无效的Cron表达式';
  }
  
  const [minute, hour, day, month, weekday] = expression.split(' ');
  
  let description = '';
  
  // 处理分钟
  if (minute === '*') {
    description += '每分钟';
  } else if (minute.includes('/')) {
    const interval = minute.split('/')[1];
    description += `每${interval}分钟`;
  } else if (minute.includes('-')) {
    const [start, end] = minute.split('-');
    description += `第${start}-${end}分钟`;
  } else if (minute.includes(',')) {
    description += `第${minute}分钟`;
  } else {
    description += minute === '0' ? '' : `第${minute}分钟`;
  }
  
  // 处理小时
  if (hour === '*') {
    if (minute !== '*') description += '每小时';
  } else if (hour.includes('/')) {
    const interval = hour.split('/')[1];
    description += `每${interval}小时`;
  } else if (hour.includes('-')) {
    const [start, end] = hour.split('-');
    description += `${start}:00-${end}:00`;
  } else if (hour.includes(',')) {
    description += `${hour.replace(/,/g, '点、')}点`;
  } else {
    description += `${hour}点`;
  }
  
  // 处理日期
  if (day !== '*') {
    if (day.includes('/')) {
      const interval = day.split('/')[1];
      description += `每${interval}天`;
    } else if (day.includes('-')) {
      const [start, end] = day.split('-');
      description += `${start}-${end}号`;
    } else if (day.includes(',')) {
      description += `${day}号`;
    } else {
      description += `${day}号`;
    }
  }
  
  // 处理月份
  if (month !== '*') {
    const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', 
                       '7月', '8月', '9月', '10月', '11月', '12月'];
    if (month.includes('/')) {
      const interval = month.split('/')[1];
      description += `每${interval}个月`;
    } else if (month.includes('-')) {
      const [start, end] = month.split('-');
      description += `${monthNames[parseInt(start)]}-${monthNames[parseInt(end)]}`;
    } else if (month.includes(',')) {
      const months = month.split(',').map(m => monthNames[parseInt(m)]).join('、');
      description += months;
    } else {
      description += monthNames[parseInt(month)];
    }
  }
  
  // 处理星期
  if (weekday !== '*') {
    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    if (weekday.includes('/')) {
      const interval = weekday.split('/')[1];
      description += `每${interval}周`;
    } else if (weekday.includes('-')) {
      const [start, end] = weekday.split('-');
      description += `${weekdayNames[parseInt(start)]}-${weekdayNames[parseInt(end)]}`;
    } else if (weekday.includes(',')) {
      const days = weekday.split(',').map(d => weekdayNames[parseInt(d)]).join('、');
      description += days;
    } else {
      description += weekdayNames[parseInt(weekday)];
    }
  }
  
  return description + '执行';
};

// 计算下次执行时间（简化版本）
export const getNextExecutionTime = (cronExpression: string): Date | null => {
  // 这里应该使用专门的Cron解析库，如 cron-parser
  // 简化版本仅作演示
  try {
    const now = new Date();
    const [minute, hour, day, month, weekday] = cronExpression.split(' ');
    
    // 简单的下次执行时间计算
    const next = new Date(now);
    
    if (minute !== '*') {
      next.setMinutes(parseInt(minute));
    }
    if (hour !== '*') {
      next.setHours(parseInt(hour));
    }
    
    // 如果计算出的时间已经过去，则加一天
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  } catch (error) {
    return null;
  }
};

// 常用的Cron表达式模板
export const cronTemplates = [
  { label: '每分钟', value: '* * * * *', description: '每分钟执行一次' },
  { label: '每5分钟', value: '*/5 * * * *', description: '每5分钟执行一次' },
  { label: '每10分钟', value: '*/10 * * * *', description: '每10分钟执行一次' },
  { label: '每15分钟', value: '*/15 * * * *', description: '每15分钟执行一次' },
  { label: '每30分钟', value: '*/30 * * * *', description: '每30分钟执行一次' },
  { label: '每小时', value: '0 * * * *', description: '每小时整点执行' },
  { label: '每2小时', value: '0 */2 * * *', description: '每2小时执行一次' },
  { label: '每3小时', value: '0 */3 * * *', description: '每3小时执行一次' },
  { label: '每天凌晨', value: '0 0 * * *', description: '每天凌晨0点执行' },
  { label: '每天早上9点', value: '0 9 * * *', description: '每天早上9点执行' },
  { label: '每天中午12点', value: '0 12 * * *', description: '每天中午12点执行' },
  { label: '每天下午6点', value: '0 18 * * *', description: '每天下午6点执行' },
  { label: '工作日早上9点', value: '0 9 * * 1-5', description: '周一到周五早上9点执行' },
  { label: '工作日下午6点', value: '0 18 * * 1-5', description: '周一到周五下午6点执行' },
  { label: '每周一凌晨', value: '0 0 * * 1', description: '每周一凌晨0点执行' },
  { label: '每周日凌晨', value: '0 0 * * 0', description: '每周日凌晨0点执行' },
  { label: '每月1号凌晨', value: '0 0 1 * *', description: '每月1号凌晨0点执行' },
  { label: '每季度首日', value: '0 0 1 */3 *', description: '每季度第一天凌晨执行' },
  { label: '每年1月1号', value: '0 0 1 1 *', description: '每年1月1号凌晨执行' },
];

// Cron字段说明
export const cronFieldsDescription = [
  {
    field: '分钟',
    range: '0-59',
    wildcards: '* 表示任意分钟',
    examples: ['0 表示整点', '*/15 表示每15分钟', '0,30 表示0分和30分'],
  },
  {
    field: '小时',
    range: '0-23',
    wildcards: '* 表示任意小时',
    examples: ['0 表示凌晨', '9-17 表示工作时间', '*/2 表示每2小时'],
  },
  {
    field: '日期',
    range: '1-31',
    wildcards: '* 表示任意日期',
    examples: ['1 表示每月1号', '1,15 表示每月1号和15号', '*/7 表示每7天'],
  },
  {
    field: '月份',
    range: '1-12',
    wildcards: '* 表示任意月份',
    examples: ['1 表示1月', '1-6 表示上半年', '*/3 表示每季度'],
  },
  {
    field: '星期',
    range: '0-6 (0=周日)',
    wildcards: '* 表示任意星期',
    examples: ['0 表示周日', '1-5 表示工作日', '6,0 表示周末'],
  },
];

export default {
  validateCronExpression,
  parseCronDescription,
  getNextExecutionTime,
  cronTemplates,
  cronFieldsDescription,
};