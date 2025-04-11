import { prisma } from '../seed';

export const createPermissions = async () => {
  const permissions = [
    {
      name: 'create_permission',
      description: 'permission to create new permissions',
    },
    {
      name: 'read_all_permissions',
      description: 'permission to read all permissions',
    },
    {
      name: 'delete_permission',
      description: 'permission to delete a permission',
    },
    {
      name: 'read_permission',
      description: 'permission to read a specific permission',
    },
    {
      name: 'update_permission',
      description: 'permission to update a permission',
    },
    { name: 'create_role', description: 'permission to create new roles' },
    { name: 'read_all_roles', description: 'permission to read all roles' },
    { name: 'delete_role', description: 'permission to delete a role' },
    { name: 'read_role', description: 'permission to read a specific role' },
    { name: 'update_role', description: 'permission to update a role' },
    {
      name: 'sync_role_with_permissions',
      description: 'permission to synchronize a role with permissions',
    },
    {
      name: 'unsync_role_with_permissions',
      description: 'permission to unsynchronize a role from permissions',
    },
  ];

  await prisma.permission.createMany({ data: permissions });
};
