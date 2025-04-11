import { prisma } from '@test/helpers/db/prisma.client';
import { faker } from '@faker-js/faker';

const model = prisma.user;

const fieldsToReturn = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  createdAt: true,
  updatedAt: true,
};

export const create = async (roleId: number, password?: string) => {
  return model.create({
    data: {
      id: faker.number.int({ max: 100 }),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: password ?? faker.internet.password(),
      phoneNumber: '11991742156',
      roleId,
    },
    select: fieldsToReturn,
  });
};

export const deleteUsers = async () => {
  return model.deleteMany({});
};
