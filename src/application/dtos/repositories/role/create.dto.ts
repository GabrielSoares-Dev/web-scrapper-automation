export interface CreateRoleRepositoryInputDto {
  name: string;
  description?: string;
}

export interface CreateRoleRepositoryOutputDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
