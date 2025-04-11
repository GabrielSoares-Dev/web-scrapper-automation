export interface UpdatePermissionRepositoryInputDto {
  id: number;
  name?: string;
  description?: string;
}

export interface UpdatePermissionRepositoryOutputDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
