export interface CreateUserRepositoryInputDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  roleId: number;
}

export interface CreateUserRepositoryOutputDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}
