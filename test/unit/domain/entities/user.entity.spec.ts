import { User } from '@domain/entities/user.entity';

describe('User', () => {
  describe('create', () => {
    it('Should be create a new user', () => {
      const input = {
        name: 'test',
        email: 'test@gmail.com',
        phoneNumber: '11991742156',
        password: 'Test@2312',
      };

      const entity = new User(input);

      entity.create();
    });

    it('Should be is invalid name', () => {
      const input = {
        name: '',
        email: 'test@gmail.com',
        phoneNumber: '11991742156',
        password: 'Test@2312',
      };

      const entity = new User(input);

      expect(() => entity.create()).toThrow('Invalid name');
    });

    it('Should be is invalid email', () => {
      const input = {
        name: 'test',
        email: 'test@gmail.',
        phoneNumber: '11991742156',
        password: 'Test@2312',
      };

      const entity = new User(input);

      expect(() => entity.create()).toThrow('Invalid email');
    });

    it('Should be is invalid phone number', () => {
      const input = {
        name: 'test',
        email: 'test@gmail.com',
        phoneNumber: '1199174215',
        password: 'Test@2312',
      };

      const entity = new User(input);

      expect(() => entity.create()).toThrow('Invalid phoneNumber');
    });

    it('Should be is invalid password', () => {
      const input = {
        name: 'test',
        email: 'test@gmail.com',
        phoneNumber: '11991742156',
        password: 'Test@',
      };

      const entity = new User(input);

      expect(() => entity.create()).toThrow('Invalid password');
    });
  });
});
