import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/services/prisma.service';
import { RoleRepositoryInterface } from '@application/repositories/role.repository';
import {
  CreateRoleRepositoryInputDto,
  CreateRoleRepositoryOutputDto,
} from '@application/dtos/repositories/role/create.dto';
import {
  UpdateRoleRepositoryInputDto,
  UpdateRoleRepositoryOutputDto,
} from '@application/dtos/repositories/role/update.dto';
import { FindRoleByNameRepositoryOutputDto } from '@application/dtos/repositories/role/findByName.dto';
import { FindAllRolesRepositoryOutputDto } from '@application/dtos/repositories/role/findAll.dto';
import { FindRoleRepositoryOutputDto } from '@application/dtos/repositories/role/find.dto';
import { DeleteRoleRepositoryOutputDto } from '@application/dtos/repositories/role/delete.dto';
import { SyncPermissionsRepositoryInputDto } from '@application/dtos/repositories/role/syncPermissions.dto';
import { UnsyncPermissionsRepositoryInputDto } from '@application/dtos/repositories/role/unsyncPermissions.dto';

@Injectable()
export class RoleRepository implements RoleRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private readonly model = this.prisma.role;
  private readonly pivotModel = this.prisma.roleHasPermissions;

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
    input: CreateRoleRepositoryInputDto,
  ): Promise<CreateRoleRepositoryOutputDto> {
    return this.model.create({
      data: input,
      select: this.defaultFieldsToReturn,
    });
  }

  async update(
    input: UpdateRoleRepositoryInputDto,
  ): Promise<UpdateRoleRepositoryOutputDto> {
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

  async findByName(name: string): Promise<FindRoleByNameRepositoryOutputDto> {
    return this.model.findFirst({
      where: {
        ...this.softDeleteClause,
        name,
      },
      select: this.defaultFieldsToReturn,
    });
  }

  async findAll(): Promise<FindAllRolesRepositoryOutputDto> {
    return this.model.findMany({
      select: this.defaultFieldsToReturn,
      where: { ...this.softDeleteClause },
    });
  }

  async find(id: number): Promise<FindRoleRepositoryOutputDto> {
    return this.model.findFirst({
      where: { ...this.softDeleteClause, id },
      select: this.defaultFieldsToReturn,
    });
  }

  async delete(id: number): Promise<DeleteRoleRepositoryOutputDto> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async syncPermissions(
    input: SyncPermissionsRepositoryInputDto,
  ): Promise<number> {
    const data = input.permissionIds.map((permissionId) => ({
      roleId: input.roleId,
      permissionId,
    }));

    const records = await this.pivotModel.createMany({
      data,
    });

    return records.count;
  }

  async unsyncPermissions(
    input: UnsyncPermissionsRepositoryInputDto,
  ): Promise<number> {
    const recordsDeleted = await this.pivotModel.deleteMany({
      where: {
        roleId: input.roleId,
        permissionId: { in: input.permissionIds },
      },
    });

    return recordsDeleted.count;
  }
}
