import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { create as createRole } from '@test/helpers/db/factories/role.factory';
import { create as createPermission } from '@test/helpers/db/factories/permission.factory';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@domain/enums/role.enum';
import { Permission } from '@domain/enums/permission.enum';
import * as request from 'supertest';

const path = '/v1/role/sync-permissions';
const userLogged = {
  id: 1,
  name: 'test',
  email: 'test@gmail.com',
  phoneNumber: '11991742156',
  role: Role.ADMIN,
  permissions: [Permission.SYNC_ROLE_WITH_PERMISSIONS],
};

describe('Sync permissions', () => {
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

  it('Should be sync permissions', async () => {
    const createdRoleBefore = await createRole();
    const createdPermissionBefore = await createPermission();

    const input = {
      role: createdRoleBefore.name,
      permissions: [createdPermissionBefore.name],
    };
    const expectedStatusCode = HttpStatus.OK;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Role sync successfully',
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be is invalid role', async () => {
    const input = {
      role: faker.lorem.word(),
      permissions: [faker.lorem.word()],
    };
    const expectedStatusCode = HttpStatus.BAD_REQUEST;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Invalid role',
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be is invalid role ', async () => {
    const createdRoleBefore = await createRole();

    const input = {
      role: createdRoleBefore.name,
      permissions: [faker.lorem.word()],
    };
    const expectedStatusCode = HttpStatus.BAD_REQUEST;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Invalid permission',
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be failure without fields', () => {
    const expectedStatusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    const expectedResponse = {
      message: [
        'role must be a string',
        'role should not be empty',
        'permissions must contain at least 1 elements',
        'each value in permissions must be a string',
        'permissions must be an array',
      ],
      error: 'Unprocessable Entity',
      statusCode: expectedStatusCode,
    };

    return request(app.getHttpServer())
      .post(path)
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
      .post(path)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
