import { Role } from '@domain/entities/role.entity';

describe('Role', () => {
  describe('create', () => {
    it('Should be create a new role', () => {
      const input = {
        name: 'test',
        description: 'role for tests',
      };

      const entity = new Role(input);

      entity.create();
    });

    it('Should be is invalid name', () => {
      const input = {
        name: '',
        description: 'role for tests',
      };

      const entity = new Role(input);

      expect(() => entity.create()).toThrow('Invalid name');
    });
  });
});
