import { Request } from 'express';
import { Permission } from '@domain/enums/permission.enum';

type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  permissions: Permission[];
};

export type RequestWithUser = Request & {
  user: User;
};
