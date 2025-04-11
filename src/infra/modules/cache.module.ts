import { Module } from '@nestjs/common';
import { CacheModule as CacheLibModule } from '@nestjs/cache-manager';
import { CACHE_SERVICE_TOKEN } from '@application/services/cache.service';
import { CacheService } from '@infra/services/cache.service';

@Module({
  imports: [CacheLibModule.register()],
  providers: [
    {
      provide: CACHE_SERVICE_TOKEN,
      useClass: CacheService,
    },
  ],
  exports: [CACHE_SERVICE_TOKEN],
})
export class CacheModule {}
