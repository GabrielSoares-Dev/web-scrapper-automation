import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import { Role } from '@domain/enums/role.enum';
import { create as createUser } from '@test/helpers/db/factories/user.factory';
import { create as createRole } from '@test/helpers/db/factories/role.factory';
import { JwtService } from '@nestjs/jwt';
import {
  CRYPTOGRAPHY_SERVICE_TOKEN,
  CryptographyServiceInterface,
} from '@application/services/cryptography.service';
import * as request from 'supertest';

const path = '/v1/auth/login';

describe('Login', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let cryptographyService: CryptographyServiceInterface;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    app.enableVersioning();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    cryptographyService = moduleFixture.get<CryptographyServiceInterface>(
      CRYPTOGRAPHY_SERVICE_TOKEN,
    );
  });

  it('Should be authenticated', async () => {
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-token');
    jest.spyOn(cryptographyService, 'compare').mockResolvedValue(true);
    const adminRole = await createRole(Role.ADMIN);
    const password = 'Test@2312';
    const userCreatedBefore = await createUser(adminRole.id, password);

    const input = {
      email: userCreatedBefore.email,
      password,
    };
    const expectedStatusCode = HttpStatus.OK;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Authenticated',
      content: {
        token: 'mock-token',
      },
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be is invalid credentials', async () => {
    jest.spyOn(cryptographyService, 'compare').mockResolvedValue(false);
    const input = {
      email: 'test@gmail.com',
      password: 'Test@2312',
    };
    const expectedStatusCode = HttpStatus.UNAUTHORIZED;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Invalid credentials',
    };

    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be failure without fields', () => {
    const expectedStatusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    const expectedResponse = {
      message: [
        'email must be an email',
        'email must be a string',
        'email should not be empty',
        'password must match /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$/ regular expression',
        'password must be longer than or equal to 8 characters',
        'password must be a string',
        'password should not be empty',
      ],
      error: 'Unprocessable Entity',
      statusCode: expectedStatusCode,
    };

    return request(app.getHttpServer())
      .post(path)
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
