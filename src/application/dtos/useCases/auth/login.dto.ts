export interface LoginUseCaseInputDto {
  email: string;
  password: string;
}

export interface LoginUseCaseOutputDto {
  token: string;
}
