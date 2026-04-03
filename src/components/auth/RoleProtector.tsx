/**
 * RoleProtector - Higher-Order Component for Role-Based Access Control
 * Wraps components and controls rendering based on user permissions/roles
 */

import React from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Permission, Role } from '@/lib/rbac/roles';
import { AlertCircle, Lock } from 'lucide-react';

interface RoleProtectorProps {
  children: React.ReactNode;
  permissions?: Permission | Permission[];
  roles?: Role | Role[];
  fallback?: React.ReactNode;
  showLocked?: boolean;
}

/**
 * RoleProtector Component
 * Controls rendering based on user permissions and roles
 */
export const RoleProtector: React.FC<RoleProtectorProps> = ({
  children,
  permissions,
  roles,
  fallback,
  showLocked = false,
}) => {
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);
  const hasRole = useAuthStore((state) => state.hasRole);

  // Check if user is authenticated
  if (!user) {
    return (
      fallback || (
        <div className="p-4 text-center text-red-600">
          <p>Authentication required</p>
        </div>
      )
    );
  }

  // Check permissions if specified
  if (permissions) {
    const permArray = Array.isArray(permissions) ? permissions : [permissions];
    const hasRequiredPermission = permArray.some((perm) => hasPermission(perm));

    if (!hasRequiredPermission) {
      return (
        fallback || (
          showLocked && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <Lock size={16} />
              <span>Insufficient permissions to access this resource</span>
            </div>
          )
        )
      );
    }
  }

  // Check roles if specified
  if (roles) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasRequiredRole = rolesArray.some((role) => hasRole(role));

    if (!hasRequiredRole) {
      return (
        fallback || (
          showLocked && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <Lock size={16} />
              <span>Insufficient role to access this resource</span>
            </div>
          )
        )
      );
    }
  }

  // All checks passed - render children
  return <>{children}</>;
};

/**
 * ConditionalButton - Button that renders or hides based on permissions
 */
interface ConditionalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permissions?: Permission | Permission[];
  roles?: Role | Role[];
  tooltip?: string;
  children: React.ReactNode;
}

export const ConditionalButton = React.forwardRef<
  HTMLButtonElement,
  ConditionalButtonProps
>(({ permissions, roles, tooltip, disabled, children, ...props }, ref) => {
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasRole = useAuthStore((state) => state.hasRole);

  let isDisabled = disabled ?? false;
  let disabledReason = '';

  if (!user) {
    isDisabled = true;
    disabledReason = 'Authentication required';
  } else if (permissions) {
    const permArray = Array.isArray(permissions) ? permissions : [permissions];
    const hasRequiredPermission = permArray.some((perm) => hasPermission(perm));
    if (!hasRequiredPermission) {
      isDisabled = true;
      disabledReason = 'Insufficient permissions';
    }
  } else if (roles) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasRequiredRole = rolesArray.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      isDisabled = true;
      disabledReason = 'Insufficient role';
    }
  }

  const title = isDisabled && !tooltip ? disabledReason : tooltip;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      title={title}
      className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      {...props}
    >
      {children}
    </button>
  );
});

ConditionalButton.displayName = 'ConditionalButton';

/**
 * ConditionalRender - Only renders children if permission/role check passes
 */
interface ConditionalRenderProps {
  permissions?: Permission | Permission[];
  roles?: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  permissions,
  roles,
  children,
  fallback,
}) => {
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasRole = useAuthStore((state) => state.hasRole);

  if (!user) {
    return fallback || null;
  }

  if (permissions) {
    const permArray = Array.isArray(permissions) ? permissions : [permissions];
    const hasRequiredPermission = permArray.some((perm) => hasPermission(perm));
    if (!hasRequiredPermission) {
      return fallback || null;
    }
  }

  if (roles) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasRequiredRole = rolesArray.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return fallback || null;
    }
  }

  return <>{children}</>;
};

/**
 * UnauthorizedFallback - Default fallback component
 */
interface UnauthorizedFallbackProps {
  message?: string;
  action?: React.ReactNode;
}

export const UnauthorizedFallback: React.FC<UnauthorizedFallbackProps> = ({
  message = 'You do not have permission to access this resource',
  action,
}) => (
  <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg">
    <AlertCircle className="text-red-600" size={32} />
    <div className="text-center">
      <h3 className="font-semibold text-red-900">Access Denied</h3>
      <p className="text-sm text-red-700 mt-1">{message}</p>
    </div>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default RoleProtector;

