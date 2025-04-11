import { Injectable, Inject } from '@nestjs/common';
import { AuthServiceInterface } from '@application/services/auth.service';
import { GenerateTokenServiceInputDto } from '@application/dtos/services/auth/generateToken.dto';
import { JwtService } from '@nestjs/jwt';
import {
  CACHE_SERVICE_TOKEN,
  CacheServiceInterface,
} from '@application/services/cache.service';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_SERVICE_TOKEN)
    private readonly cacheService: CacheServiceInterface,
  ) {}

  async generateToken(input: GenerateTokenServiceInputDto): Promise<string> {
    return this.jwtService.signAsync(input);
  }

  async verifyToken(token: string): Promise<object> {
    const cachedToken = await this.cacheService.get(token);
    const isBlacklisted = cachedToken === 'blacklisted';

    if (isBlacklisted) throw new BusinessException('Unauthorized');
    return this.jwtService.verifyAsync(token);
  }

  async invalidateToken(token: string): Promise<void> {
    await this.cacheService.set(token, 'blacklisted');
  }
}
