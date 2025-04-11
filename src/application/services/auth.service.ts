import { GenerateTokenServiceInputDto } from '@application/dtos/services/auth/generateToken.dto';

export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE_TOKEN';

export interface AuthServiceInterface {
  generateToken(input: GenerateTokenServiceInputDto): Promise<string>;
  verifyToken(token: string): Promise<object>;
  invalidateToken(token: string): Promise<void>;
}
