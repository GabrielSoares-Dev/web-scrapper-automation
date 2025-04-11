import { prisma } from '@test/helpers/db/prisma.client';
import { cleanDatabase } from '@test/helpers/db/cleanDatabase';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});
