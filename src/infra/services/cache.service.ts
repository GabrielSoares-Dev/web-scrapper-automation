import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CacheServiceInterface } from '@application/services/cache.service';

@Injectable()
export class CacheService implements CacheServiceInterface {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: unknown, ttl: number = 0): Promise<void> {
    return this.cacheManager.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    return this.cacheManager.reset();
  }
}
