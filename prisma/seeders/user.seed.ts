import { prisma } from '../seed';
import * as bcrypt from 'bcrypt';

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();

  return bcrypt.hash(password, salt);
};

const admin = async () => {
  const adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });

  const roleId = adminRole?.id;

  const user = {
    name: 'admin',
    email: 'admin@gmail.com',
    phoneNumber: '11942421224',
    password: await encryptPassword('Admin@1234'),
    roleId,
  };

  await prisma.user.create({ data: user });
};

export const createUsers = async () => {
  await admin();
};
