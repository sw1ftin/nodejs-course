import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import chalk from 'chalk';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    return this.commands[this.defaultCommand];
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const entries = Object.entries(parsedCommand);

    if (entries.length === 0) {
      const def = this.getDefaultCommand();
      await Promise.resolve(def.execute());
      return;
    }

    for (const [commandName, args] of entries) {
      const command = this.getCommand(commandName);
      try {
        await Promise.resolve(command.execute(...(args ?? [])));
      } catch (err) {
        if (err instanceof Error) {
          console.error(chalk.red(`Error executing ${commandName}: ${err.message}`));
        } else {
          console.error(chalk.red(`Error executing ${commandName}:`), err);
        }
      }
    }
  }
}
