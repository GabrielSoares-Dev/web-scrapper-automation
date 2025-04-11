interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FindAllRolesRepositoryOutputDto = Role[];
