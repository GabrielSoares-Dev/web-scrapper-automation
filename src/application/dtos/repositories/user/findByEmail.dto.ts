export interface FindUserByEmailRepositoryOutputDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
