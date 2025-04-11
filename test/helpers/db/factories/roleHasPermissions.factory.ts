import { prisma } from '@test/helpers/db/prisma.client';

const model = prisma.roleHasPermissions;

export const deleteRoleHasPermissions = async () => {
  return model.deleteMany({});
};
