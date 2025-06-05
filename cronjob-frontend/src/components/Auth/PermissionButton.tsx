import React from 'react';
import { Button, ButtonProps } from 'antd';
import { useAuthStore } from '../../store/useAuthStore';

interface PermissionButtonProps extends ButtonProps {
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  role,
  fallback = null,
  children,
  ...buttonProps
}) => {
  const { hasPermission, hasRole } = useAuthStore();

  // 检查权限
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // 检查角色
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <Button {...buttonProps}>{children}</Button>;
};

export default PermissionButton; 