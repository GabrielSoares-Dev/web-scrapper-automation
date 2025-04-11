import { PrismaClient } from '@prisma/client';
import { createRoles } from './seeders/role.seed';
import { createPermissions } from './seeders/permission.seed';
import { syncRolesWithPermissions } from './seeders/roleWithPermissions.seed';
import { createUsers } from './seeders/user.seed';

export const prisma = new PrismaClient();

async function main() {
  await createRoles();
  await createPermissions();
  await syncRolesWithPermissions();
  await createUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('SEEDERS RUNNING WITH SUCCESS');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
