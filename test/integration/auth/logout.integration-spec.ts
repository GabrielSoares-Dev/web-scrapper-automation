import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@domain/enums/role.enum';
import { Permission } from '@domain/enums/permission.enum';
import * as request from 'supertest';

const path = '/v1/auth/logout';

const input = {
  name: faker.person.firstName(),
  description: 'test',
};

const userLogged = {
  id: 1,
  name: 'test',
  email: 'test@gmail.com',
  phoneNumber: '11991742156',
  role: Role.ADMIN,
  permissions: [Permission.CREATE_PERMISSION],
};

describe('Logout', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

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
    const tokenGenerated = await jwtService.signAsync(userLogged);
    token = `Bearer ${tokenGenerated}`;
  });

  it('Should be logout', () => {
    const expectedStatusCode = HttpStatus.OK;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Successfully logged out',
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be is unauthorized', () => {
    const expectedStatusCode = HttpStatus.UNAUTHORIZED;
    const expectedResponse = {
      message: 'Unauthorized',
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
