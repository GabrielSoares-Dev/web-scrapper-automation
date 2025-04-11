export class BusinessException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Business error';
    Error.captureStackTrace(this, this.constructor);
  }
}
