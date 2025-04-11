import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@domain/enums/role.enum';
import { AuthServiceInterface } from '@application/services/auth.service';
import {
  CACHE_SERVICE_TOKEN,
  CacheServiceInterface,
} from '@application/services/cache.service';
import { AuthService } from '@infra/services/auth.service';

describe('AuthService', () => {
  let service: AuthServiceInterface;
  let cacheService: CacheServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token-test'),
            verifyAsync: jest.fn().mockResolvedValue({ name: 'user' }),
          },
        },
        {
          provide: CACHE_SERVICE_TOKEN,
          useValue: {
            set: jest.fn(),
            get: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthServiceInterface>(AuthService);
    cacheService = module.get<CacheServiceInterface>(CACHE_SERVICE_TOKEN);
  });
  describe('generateToken', () => {
    it('Should be generate token', async () => {
      const input = {
        id: 1,
        name: 'test',
        email: 'test@gmail.com',
        phoneNumber: '11991742156',
        role: Role.ADMIN,
        permissions: ['test'],
      };
      const output = await service.generateToken(input);

      const expectedOutput = 'token-test';
      expect(output).toEqual(expectedOutput);
    });
  });
  describe('verifyToken', () => {
    it('Should be verify token', async () => {
      const input = 'mock-token';
      const output = await service.verifyToken(input);

      const expectedOutput = { name: 'user' };
      expect(output).toEqual(expectedOutput);
    });
    it('Should be token is blacklisted', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue('blacklisted');
      const input = 'mock-token';

      await expect(service.verifyToken(input)).rejects.toThrow('Unauthorized');
    });
  });

  describe('invalidateToken', () => {
    it('Should be invalidate token', async () => {
      const setCacheSpyOn = jest.spyOn(cacheService, 'set');
      const input = 'mock-token';
      await service.invalidateToken(input);

      expect(setCacheSpyOn).toHaveBeenCalledWith(input, 'blacklisted');
    });
  });
});
