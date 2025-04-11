import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { LoggerServiceInterface } from '@application/services/logger.service';

@Injectable()
export class LoggerService implements LoggerServiceInterface {
  private readonly logger = new Logger();
  private readonly context = process.env.APP_NAME;

  private formattedMessage(message: string) {
    return `${this.context} ${message}`;
  }

  private hasInput(input?: unknown) {
    return input !== undefined;
  }

  info(message: string, input?: unknown): void {
    const formattedMessage = this.formattedMessage(message);
    this.hasInput(input)
      ? this.logger.log(formattedMessage, input)
      : this.logger.log(formattedMessage);
  }

  debug(message: string, input?: unknown): void {
    const formattedMessage = this.formattedMessage(message);
    this.hasInput(input)
      ? this.logger.debug(formattedMessage, input)
      : this.logger.debug(formattedMessage);
  }

  error(message: string, input?: unknown): void {
    const formattedMessage = this.formattedMessage(message);

    this.hasInput(input)
      ? this.logger.error(formattedMessage, input, input)
      : this.logger.error(formattedMessage, input);
  }

  warning(message: string, input?: unknown): void {
    const formattedMessage = this.formattedMessage(message);
    this.hasInput(input)
      ? this.logger.warn(formattedMessage, input)
      : this.logger.warn(formattedMessage);
  }

  fatal(message: string, input?: unknown): void {
    const formattedMessage = this.formattedMessage(message);
    this.hasInput(input)
      ? this.logger.fatal(formattedMessage, input)
      : this.logger.fatal(formattedMessage);
  }
}
