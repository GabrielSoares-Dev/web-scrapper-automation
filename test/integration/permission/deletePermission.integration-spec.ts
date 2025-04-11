import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import { create } from '@test/helpers/db/factories/permission.factory';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@domain/enums/role.enum';
import { Permission } from '@domain/enums/permission.enum';
import * as request from 'supertest';

const path = '/v1/permission';

const userLogged = {
  id: 1,
  name: 'test',
  email: 'test@gmail.com',
  phoneNumber: '11991742156',
  role: Role.ADMIN,
  permissions: [Permission.DELETE_PERMISSION],
};
describe('Delete permission', () => {
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

  it('Should be deleted permission with success', async () => {
    const permissionCreatedBefore = await create();
    const id = permissionCreatedBefore.id;

    const expectedStatusCode = HttpStatus.OK;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Permission deleted successfully',
    };

    return request(app.getHttpServer())
      .delete(`${path}/${id}`)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be is invalid id', async () => {
    const id = faker.number.int({ max: 100 });
    const expectedStatusCode = HttpStatus.BAD_REQUEST;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Invalid id',
    };

    return request(app.getHttpServer())
      .delete(`${path}/${id}`)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be failure with wrong field', async () => {
    const expectedStatusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    const expectedResponse = {
      message: ['id must be a number string'],
      error: 'Unprocessable Entity',
      statusCode: expectedStatusCode,
    };

    const id = 'test';
    return request(app.getHttpServer())
      .delete(`${path}/${id}`)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be is unauthorized', async () => {
    const expectedStatusCode = HttpStatus.UNAUTHORIZED;
    const expectedResponse = {
      message: 'Unauthorized',
      statusCode: expectedStatusCode,
    };
    const id = 'test';
    return request(app.getHttpServer())
      .delete(`${path}/${id}`)
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be resource access denied', async () => {
    const id = faker.number.int({ max: 100 });
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
      .delete(`${path}/${id}`)
      .set({ Authorization: token })
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
