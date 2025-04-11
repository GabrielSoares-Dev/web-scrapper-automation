import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infra/modules/app.module';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

const path = '/v1/room/search';

const input = {
  checkIn: '2024-08-25',
  checkOut: '2024-08-27',
};

describe('Search rooms', () => {
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

  it('Should be search rooms with success', async () => {
    const expectedStatusCode = HttpStatus.OK;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'Found rooms',
      content: [
        {
          name: 'Chalé Casal',
          description:
            'O Chalé casal conta com 1 quarto, 1 banheiro e 1 pequena sacada. Contém 1 cama de casal e 1 de solteiro.',
          price: null,
          image:
            'https://s3.sa-east-1.amazonaws.com/fasthotel.cdn/quartosTipo/214-1-1632320429599483292.jpg',
        },
        {
          name: 'Chalé Família',
          description:
            'O Chalé Familia é uma acomodação que tem 2 andares com 1 sala, 1 quarto, 1 mezanino e 1 banheiro com chuveiro. Contém 1 cama de casal e 1 de solteiro no quarto e 4 colchões no piso do mezanino.',
          price: 'R$ 750',
          image:
            'https://s3.sa-east-1.amazonaws.com/fasthotel.cdn/quartosTipo/214-2-16323199891636144298.jpg',
        },
        {
          name: 'Apartamento',
          description:
            'Os Apartamentos se localizam em um bloco de dois andares. Cada unidade tem 1 quarto e 1 banheiro com chuveiro. O apartamento possui 1 cama de casal e 2 camas de solteiro.',
          price: null,
          image:
            'https://s3.sa-east-1.amazonaws.com/fasthotel.cdn/quartosTipo/214-3-1632320055779578127.jpg',
        },
        {
          name: 'Apartamento c/ varanda',
          description:
            'Os Apartamentos se localizam em um bloco de dois andares. Cada unidade tem 1 quarto e 1 banheiro com chuveiro. O apartamento possui 1 cama de casal e 1 cama de solteiro.',
          price: null,
          image:
            'https://s3.sa-east-1.amazonaws.com/fasthotel.cdn/quartosTipo/214-5-16983248591465854416.jpg',
        },
      ],
    };
    return request(app.getHttpServer())
      .post(path)
      .send(input)
      .expect(expectedStatusCode)
      .expect(expectedResponse)
      .then((response) => {
        console.log('Response:', response.body);
      });
  });

  it('Should be not found rooms', async () => {
    const input = {
      checkIn: '2024-08-25',
      checkOut: '2025-08-29',
    };
    const expectedStatusCode = HttpStatus.NOT_FOUND;
    const expectedResponse = {
      statusCode: expectedStatusCode,
      message: 'No rooms found',
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
        'The checkIn field must be in the format YYYY-MM-DD.',
        'The checkIn field is required.',
        'checkIn must be a string',
        'The checkOut field must be in the format YYYY-MM-DD.',
        'The checkOut field is required.',
        'checkOut must be a string',
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
