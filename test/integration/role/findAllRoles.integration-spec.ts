import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import { create } from '@test/helpers/db/factories/role.factory';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@domain/enums/role.enum';
import { Permission } from '@domain/enums/permission.enum';
import * as request from 'supertest';

const path = '/v1/role';

const userLogged = {
  id: 1,
  name: 'test',
  email: 'test@gmail.com',
  phoneNumber: '11991742156',
  role: Role.ADMIN,
  permissions: [Permission.READ_ALL_ROLES],
};
describe('Find all roles', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    const tokenGenerated = await jwtService.signAsync(userLogged);
    token = `Bearer ${tokenGenerated}`;
  });

  it('Should be found roles with success', async () => {
    const roleCreatedBefore = await create();

    const expectedStatusCode = HttpStatus.OK;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Found roles',
      content: [
        {
          ...roleCreatedBefore,
          createdAt: roleCreatedBefore.createdAt.toISOString(),
          updatedAt: roleCreatedBefore.updatedAt.toISOString(),
        },
      ],
    };
    return request(app.getHttpServer())
      .get(path)
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
      .get(path)
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be resource access denied', async () => {
    const userLogged = {
      id: 1,
      name: 'test',
      email: 'test@gmail.com',
      phoneNumber: '11991742156',
      role: Role.ADMIN,
      permissions: ['test'],
    };

    const tokenGenerated = await jwtService.signAsync(userLogged);
    token = `Bearer ${tokenGenerated}`;
    const expectedStatusCode = HttpStatus.FORBIDDEN;
    const expectedResponse = {
      message: 'Access to this resource was denied',
      statusCode: expectedStatusCode,
    };

    return request(app.getHttpServer())
      .get(path)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
