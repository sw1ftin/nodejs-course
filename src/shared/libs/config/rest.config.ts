import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import convict from 'convict';
import validator from 'convict-format-with-validator';
import { Config } from './config.interface.js';
import { RestSchema } from './rest.schema.js';
import { Logger } from '../logger/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: convict.Config<RestSchema>;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    convict.addFormats(validator);

    config({ path: '.env' });

    this.config = convict<RestSchema>({
      PORT: {
        doc: 'Port for incoming connections',
        format: 'port',
        env: 'PORT',
        default: 4000
      },
      DB_HOST: {
        doc: 'IP address of the database server (MongoDB)',
        format: 'ipaddress',
        env: 'DB_HOST',
        default: '127.0.0.1'
      },
      SALT: {
        doc: 'Salt for password hash',
        format: String,
        env: 'SALT',
        default: ''
      },
      DB_USER: {
        doc: 'Username to connect to the database',
        format: String,
        env: 'DB_USER',
        default: ''
      },
      DB_PASSWORD: {
        doc: 'Password to connect to the database',
        format: String,
        env: 'DB_PASSWORD',
        default: ''
      },
      DB_PORT: {
        doc: 'Port to connect to the database',
        format: 'port',
        env: 'DB_PORT',
        default: '27017'
      },
      DB_NAME: {
        doc: 'Database name',
        format: String,
        env: 'DB_NAME',
        default: 'six-cities'
      }
    });

    this.config.validate({ allowed: 'strict' });

    this.logger.info(`Port: ${this.get('PORT')}`);
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config.get(key) as RestSchema[T];
  }

  public getMongoURI(): string {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = this.config.getProperties();
    return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
  }
}
