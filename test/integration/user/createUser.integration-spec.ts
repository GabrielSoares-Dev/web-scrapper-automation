import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import { Role } from '@domain/enums/role.enum';
import { create as createUser } from '@test/helpers/db/factories/user.factory';
import { create as createRole } from '@test/helpers/db/factories/role.factory';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';

const path = '/v1/user';

const input = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: 'Test@2312',
  phoneNumber: '11991742156',
};

describe('Create User', () => {
  let app: INestApplication;

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
  });

  it('Should be create user with success', async () => {
    await createRole(Role.ADMIN);
    const expectedStatusCode = HttpStatus.CREATED;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'User created successfully',
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .expect(expectedStatusCode)
      .expect(expectedResponse);
  });

  it('Should be failure when user already exists', async () => {
    const adminRole = await createRole(Role.ADMIN);
    const userCreatedBefore = await createUser(adminRole.id);

    const expectedStatusCode = HttpStatus.BAD_REQUEST;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'User already exists',
    };
    const input = {
      name: faker.person.firstName(),
      email: userCreatedBefore.email,
      password: 'Test@2312',
      phoneNumber: '11991742156',
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
        'name must be a string',
        'name should not be empty',
        'email must be an email',
        'email must be a string',
        'email should not be empty',
        'phoneNumber must be shorter than or equal to 11 characters',
        'phoneNumber must be longer than or equal to 11 characters',
        'phoneNumber must be a string',
        'phoneNumber should not be empty',
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
