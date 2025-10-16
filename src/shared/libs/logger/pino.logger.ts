import { Logger } from './logger.interface.js';
import { pino, Logger as PinoInstance } from 'pino';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino();
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(args.length ? { args } : {}, message);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(args.length ? { args } : {}, message);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(args.length ? { args } : {}, message);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(args.length ? { args } : {}, message);
  }
}
