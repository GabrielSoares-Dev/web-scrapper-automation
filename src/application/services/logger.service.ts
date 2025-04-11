export const LOGGER_SERVICE_TOKEN = 'LOGGER_SERVICE_TOKEN';

export interface LoggerServiceInterface {
  info(message: string, input?: unknown): void;
  debug(message: string, input?: unknown): void;
  error(message: string, input?: unknown): void;
  warning(message: string, input?: unknown): void;
  fatal(message: string, input?: unknown): void;
}
