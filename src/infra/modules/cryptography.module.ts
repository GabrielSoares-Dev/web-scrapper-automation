import { Module } from '@nestjs/common';
import { CryptographyService } from '@infra/services/cryptography.service';
import { CRYPTOGRAPHY_SERVICE_TOKEN } from '@application/services/cryptography.service';

@Module({
  providers: [
    { provide: CRYPTOGRAPHY_SERVICE_TOKEN, useClass: CryptographyService },
  ],
  exports: [CRYPTOGRAPHY_SERVICE_TOKEN],
})
export class CryptographyModule {}
