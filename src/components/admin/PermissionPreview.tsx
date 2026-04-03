/**
 * Permission Preview & Management Component
 * Admin dashboard for role assignment and permission management
 */

'use client';

import React, { useState } from 'react';
import { Role, Permission, ROLE_PERMISSIONS, ROLE_METADATA, getPermissionLabel } from '@/lib/rbac/roles';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Shield, Copy, Check } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

interface PermissionPreviewProps {
  user?: User;
  onRoleChange?: (newRole: Role) => Promise<void>;
  onPermissionsChange?: (permissions: Permission[]) => Promise<void>;
  isLoading?: boolean;
}

export const PermissionPreview: React.FC<PermissionPreviewProps> = ({
  user,
  onRoleChange,
  onPermissionsChange,
  isLoading = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(user?.role || null);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(
    new Set(user?.permissions || [])
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);

  const rolePermissions = selectedRole ? ROLE_PERMISSIONS[selectedRole] : [];

  const handleRoleChange = async (newRole: Role) => {
    setSelectedRole(newRole);
    // Auto-set permissions based on role
    setSelectedPermissions(new Set(ROLE_PERMISSIONS[newRole]));
    setHasChanges(true);

    if (onRoleChange) {
      try {
        await onRoleChange(newRole);
      } catch (error) {
        console.error('Failed to change role:', error);
      }
    }
  };

  const handlePermissionToggle = (permission: Permission) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permission)) {
      newPermissions.delete(permission);
    } else {
      newPermissions.add(permission);
    }
    setSelectedPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (onPermissionsChange) {
      try {
        await onPermissionsChange(Array.from(selectedPermissions));
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to save changes:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Permission Management</h2>
        <p className="text-gray-600">
          Configure roles and permissions for system users
        </p>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Assign Role</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(ROLE_METADATA).map(([roleKey, metadata]) => {
            const isSelected = selectedRole === roleKey;
            return (
              <button
                key={roleKey}
                onClick={() => handleRoleChange(roleKey as Role)}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-gray-900">{metadata.label}</span>
                  {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-xs text-gray-600 mb-3">{metadata.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: metadata.color }} />
                  Level {metadata.level}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Permissions Grid */}
      {selectedRole && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({Object.values(Permission).length})
              </TabsTrigger>
              <TabsTrigger value="granted">
                Granted ({selectedPermissions.size})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available ({rolePermissions.length})
              </TabsTrigger>
            </TabsList>

            {/* All Permissions */}
            <TabsContent value="all" className="space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {Object.values(Permission).map((permission) => {
                  const isGranted = selectedPermissions.has(permission);
                  return (
                    <label
                      key={permission}
                      className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer"
                    >
                      <Checkbox
                        checked={isGranted}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getPermissionLabel(permission)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">{permission}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </TabsContent>

            {/* Granted Permissions */}
            <TabsContent value="granted" className="space-y-3 mt-4">
              {selectedPermissions.size === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Permissions</AlertTitle>
                  <AlertDescription>
                    No permissions have been granted to this user
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Array.from(selectedPermissions).map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getPermissionLabel(permission)}
                        </div>
                        <div className="text-xs text-gray-600 font-mono">{permission}</div>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle(permission)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Available Permissions for Role */}
            <TabsContent value="available" className="space-y-3 mt-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Role-Based Permissions</AlertTitle>
                <AlertDescription>
                  These permissions are typically granted for the {ROLE_METADATA[selectedRole].label} role
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2 bg-blue-50 rounded-lg">
                {rolePermissions.map((permission) => {
                  const isGranted = selectedPermissions.has(permission);
                  return (
                    <label
                      key={permission}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                        isGranted ? 'bg-white' : 'hover:bg-white'
                      }`}
                    >
                      <Checkbox
                        checked={isGranted}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getPermissionLabel(permission)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">{permission}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Summary & Actions */}
      {selectedRole && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedPermissions.size}
              </div>
              <div className="text-xs text-gray-600">Permissions Granted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(Permission).length}
              </div>
              <div className="text-xs text-gray-600">Total Permissions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((selectedPermissions.size / Object.values(Permission).length) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Coverage</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                const permsList = Array.from(selectedPermissions)
                  .map(p => `- ${getPermissionLabel(p)}`)
                  .join('\n');
                navigator.clipboard.writeText(permsList);
                setShowCopyConfirm(true);
                setTimeout(() => setShowCopyConfirm(false), 2000);
              }}
              className="flex-1"
              disabled={isLoading}
            >
              <Copy className="w-4 h-4 mr-2" />
              {showCopyConfirm ? 'Copied!' : 'Copy Permissions'}
            </Button>

            {hasChanges && (
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionPreview;

