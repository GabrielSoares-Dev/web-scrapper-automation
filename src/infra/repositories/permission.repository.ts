import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/services/prisma.service';
import { PermissionRepositoryInterface } from '@application/repositories/permission.repository';
import {
  CreatePermissionRepositoryInputDto,
  CreatePermissionRepositoryOutputDto,
} from '@application/dtos/repositories/permission/create.dto';
import {
  UpdatePermissionRepositoryInputDto,
  UpdatePermissionRepositoryOutputDto,
} from '@application/dtos/repositories/permission/update.dto';
import { FindPermissionByNameRepositoryOutputDto } from '@application/dtos/repositories/permission/findByName.dto';
import { FindAllPermissionsRepositoryOutputDto } from '@application/dtos/repositories/permission/findAll.dto';
import { FindPermissionRepositoryOutputDto } from '@application/dtos/repositories/permission/find.dto';
import { DeletePermissionRepositoryOutputDto } from '@application/dtos/repositories/permission/delete.dto';

@Injectable()
export class PermissionRepository implements PermissionRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private readonly model = this.prisma.permission;

  protected readonly defaultFieldsToReturn = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
  };

  protected readonly softDeleteClause = {
    deletedAt: null,
  };

  async create(
    input: CreatePermissionRepositoryInputDto,
  ): Promise<CreatePermissionRepositoryOutputDto> {
    return this.model.create({
      data: input,
      select: this.defaultFieldsToReturn,
    });
  }

  async update(
    input: UpdatePermissionRepositoryInputDto,
  ): Promise<UpdatePermissionRepositoryOutputDto> {
    return this.model.update({
      where: {
        ...this.softDeleteClause,
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
      },
      select: this.defaultFieldsToReturn,
    });
  }

  async findByName(
    name: string,
  ): Promise<FindPermissionByNameRepositoryOutputDto> {
    return this.model.findFirst({
      where: {
        ...this.softDeleteClause,
        name,
      },
      select: this.defaultFieldsToReturn,
    });
  }

  async findAll(): Promise<FindAllPermissionsRepositoryOutputDto> {
    return this.model.findMany({
      select: this.defaultFieldsToReturn,
      where: { ...this.softDeleteClause },
    });
  }

  async find(id: number): Promise<FindPermissionRepositoryOutputDto> {
    return this.model.findFirst({
      where: { ...this.softDeleteClause, id },
      select: this.defaultFieldsToReturn,
    });
  }

  async delete(id: number): Promise<DeletePermissionRepositoryOutputDto> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
