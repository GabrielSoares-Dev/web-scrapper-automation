export const CACHE_SERVICE_TOKEN = 'CACHE_SERVICE_TOKEN';

export interface CacheServiceInterface {
  get<T>(key: string): Promise<T>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  reset(): Promise<void>;
}
