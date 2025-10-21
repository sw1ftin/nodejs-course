import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { User, UserType } from '../../shared/types/index.js';
import chalk from 'chalk';
import { inspect } from 'node:util';


export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public users: User[] = [
    { name: 'Kirill', email: 'kirill@gmail.com', password: 'qwerty', type: UserType.PRO, avatarUrl: 'kirillAvatar.png' },
    { name: 'Sergey', email: 'sergey@gmail.com', password: 'rtyqwe', type: UserType.REGULAR, avatarUrl: 'sergeyAvatar.png' }
  ];

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray(this.users);
  console.info(chalk.cyan(`Imported ${offers.length} offers from ${filename}`));
  console.log(inspect(offers, { colors: true, depth: null }));
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }
}