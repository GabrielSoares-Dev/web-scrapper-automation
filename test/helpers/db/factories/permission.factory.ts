import { prisma } from '@test/helpers/db/prisma.client';
import { faker } from '@faker-js/faker';

const model = prisma.permission;

const fieldsToReturn = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

export const create = async () => {
  return model.create({
    data: {
      id: faker.number.int({ max: 100 }),
      name: faker.lorem.word(),
      description: faker.lorem.word(),
    },
    select: fieldsToReturn,
  });
};

export const deletePermissions = async () => {
  return model.deleteMany({});
};
