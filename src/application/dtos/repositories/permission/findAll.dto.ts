interface Permission {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FindAllPermissionsRepositoryOutputDto = Permission[];
