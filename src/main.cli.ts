#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication, HelpCommand, ImportCommand, VersionCommand, GenerateCommand } from './cli/index.js';

async function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);
  await cliApplication.processCommand(process.argv);
}

bootstrap();
