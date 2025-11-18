import { inject, injectable } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestConfig } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  private async initDb() {
    const mongoUri = (this.config as RestConfig).getMongoURI();
    await this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this.initDb();
    this.logger.info('Database initialized');
  }
}
