export interface CreatePermissionRepositoryInputDto {
  name: string;
  description?: string;
}

export interface CreatePermissionRepositoryOutputDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
