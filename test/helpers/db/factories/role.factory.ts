import { prisma } from '@test/helpers/db/prisma.client';
import { faker } from '@faker-js/faker';

const model = prisma.role;

const fieldsToReturn = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

export const create = async (name?: string) => {
  return model.create({
    data: {
      id: faker.number.int({ max: 100 }),
      name: name ?? faker.lorem.word(),
      description: faker.lorem.word(),
    },
    select: fieldsToReturn,
  });
};

export const deleteRoles = async () => {
  return model.deleteMany({});
};
