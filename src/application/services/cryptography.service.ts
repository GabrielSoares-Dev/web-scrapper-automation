export const CRYPTOGRAPHY_SERVICE_TOKEN = 'CRYPTOGRAPHY_SERVICE_TOKEN';

export interface CryptographyServiceInterface {
  encrypt(value: string): Promise<string>;
  compare(value: string, encrypted: string): Promise<boolean>;
}
