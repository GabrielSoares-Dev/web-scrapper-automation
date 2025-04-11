import { prisma } from '../seed';

const syncAdminRole = async () => {
  const adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });

  const roleId = adminRole?.id;

  const permissionsNames = [
    'create_permission',
    'read_all_permissions',
    'delete_permission',
    'read_permission',
    'update_permission',
    'create_role',
    'read_all_roles',
    'delete_role',
    'read_role',
    'update_role',
    'sync_role_with_permissions',
    'unsync_role_with_permissions',
  ];

  const permissions = await prisma.permission.findMany({
    where: { name: { in: permissionsNames } },
  });

  const permissionIds = permissions.map((permission) => permission.id);

  const dataToSync = permissionIds.map((id) => ({
    permissionId: id,
    roleId: roleId!,
  }));

  await prisma.roleHasPermissions.createMany({ data: dataToSync });
};

export const syncRolesWithPermissions = async () => {
  await syncAdminRole();
};
