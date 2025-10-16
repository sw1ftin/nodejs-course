import { Logger } from '../shared/libs/logger/index.js';

export class Application {
  constructor(private readonly logger: Logger) {}

  public async init() {
    this.logger.info('Application initialization');
  }
}
