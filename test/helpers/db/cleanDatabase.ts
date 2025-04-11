import { deleteUsers } from '@test/helpers/db/factories/user.factory';
import { deleteRoleHasPermissions } from '@test/helpers/db/factories/roleHasPermissions.factory';
import { deleteRoles } from '@test/helpers/db/factories/role.factory';
import { deletePermissions } from '@test/helpers/db/factories/permission.factory';

export const cleanDatabase = async () => {
  await deleteUsers();
  await deleteRoleHasPermissions();
  await deleteRoles();
  await deletePermissions();
};
