#!/usr/bin/env node
import 'reflect-metadata';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { Component } from './shared/types/index.js';
import { Application } from './rest/rest.application.js';

async function bootstrap() {
  const container = createRestApplicationContainer();
  const application = container.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
