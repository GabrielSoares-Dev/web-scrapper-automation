import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@infra/services/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
