import { CryptographyServiceInterface } from '@application/services/cryptography.service';
import { CryptographyService } from '@infra/services/cryptography.service';
import * as bcrypt from 'bcrypt';

describe('CryptographyService', () => {
  let service: CryptographyServiceInterface;

  beforeEach(() => {
    service = new CryptographyService();
  });
  describe('encrypt', () => {
    it('Should be encrypt', async () => {
      const mockGenSaltOutput = '$2b$10$QTwuafopwnOX1K/XkbqwGe';
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => mockGenSaltOutput);

      const input = 'test';
      const output = await service.encrypt(input);

      const expectedOutput =
        '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y';
      expect(output).toEqual(expectedOutput);
    });
  });
  describe('compare', () => {
    it('Should be compare', async () => {
      const input = {
        value: 'test',
        encrypted:
          '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y',
      };
      const output = await service.compare(input.value, input.encrypted);

      const expectedOutput = true;

      expect(output).toEqual(expectedOutput);
    });
  });
});
