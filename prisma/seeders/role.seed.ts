import { prisma } from '../seed';

export const createRoles = async () => {
  const roles = [{ name: 'admin', description: 'role to manage system' }];

  await prisma.role.createMany({ data: roles });
};
