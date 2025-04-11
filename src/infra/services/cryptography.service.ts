import { Injectable } from '@nestjs/common';
import { CryptographyServiceInterface } from '@application/services/cryptography.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptographyService implements CryptographyServiceInterface {
  private async generateRandomSalt(): Promise<string> {
    return bcrypt.genSalt();
  }

  async encrypt(value: string): Promise<string> {
    const salt = await this.generateRandomSalt();
    return bcrypt.hash(value, salt);
  }

  async compare(value: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(value, encrypted);
  }
}
