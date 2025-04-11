import { Permission } from '@domain/entities/permission.entity';

describe('Permission', () => {
  describe('create', () => {
    it('Should be create a new permission', () => {
      const input = {
        name: 'test',
        description: 'permission for tests',
      };

      const entity = new Permission(input);

      entity.create();
    });

    it('Should be is invalid name', () => {
      const input = {
        name: '',
        description: 'permission for tests',
      };

      const entity = new Permission(input);

      expect(() => entity.create()).toThrow('Invalid name');
    });
  });
});
