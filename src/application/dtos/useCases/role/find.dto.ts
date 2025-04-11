export interface FindUseCaseInputDto {
  id: number;
}

export interface FindUseCaseOutputDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
