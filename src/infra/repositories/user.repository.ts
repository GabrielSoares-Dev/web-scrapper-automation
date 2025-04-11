import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/services/prisma.service';
import { UserRepositoryInterface } from '@application/repositories/user.repository';
import {
  CreateUserRepositoryInputDto,
  CreateUserRepositoryOutputDto,
} from '@application/dtos/repositories/user/create.dto';
import { FindUserByEmailRepositoryOutputDto } from '@application/dtos/repositories/user/findByEmail.dto';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private readonly model = this.prisma.user;

  protected readonly defaultFieldsToReturn = {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    roleId: true,
    password: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(
    input: CreateUserRepositoryInputDto,
  ): Promise<CreateUserRepositoryOutputDto> {
    return this.model.create({
      data: input,
      select: this.defaultFieldsToReturn,
    });
  }

  async findByEmail(
    email: string,
  ): Promise<FindUserByEmailRepositoryOutputDto | null> {
    const user = await this.model.findFirst({
      where: {
        email,
      },
      select: {
        ...this.defaultFieldsToReturn,
        role: {
          select: {
            name: true,
            roleHasPermissions: {
              select: { permission: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!user) return null;

    const role = user.role.name;

    const permissions = user.role.roleHasPermissions.map(
      (roleHasPermission) => roleHasPermission.permission.name,
    );

    return {
      ...user,
      role,
      permissions,
    };
  }
}
