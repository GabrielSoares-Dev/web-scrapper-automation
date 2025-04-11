export interface UpdateRoleRepositoryInputDto {
  id: number;
  name?: string;
  description?: string;
}

export interface UpdateRoleRepositoryOutputDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
