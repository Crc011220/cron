import React from 'react';
import { Tabs } from 'antd';
import JobList from './JobList';
import ScriptUpload from './ScriptUpload';

// 这个组件已经不需要了，因为现在使用路由
// 保留只是为了兼容，建议删除
const JobManager: React.FC = () => {
  return (
    <div>
      <p>此组件已弃用，请使用路由访问具体页面。</p>
    </div>
  );
};

export default JobManager;