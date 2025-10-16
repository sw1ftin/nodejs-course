#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { Component } from './shared/types/index.js';
import { Application } from './rest/rest.application.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer()
  );

  const application = appContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
