import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index';
import { Offer, User, UserType } from '../../shared/types/index.js';


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
      fileReader.toArray(this.users).forEach((offer: Offer, index) => {
        console.log(JSON.stringify(offer, null, 2));
      });
      console.log(fileReader.toArray(this.users).toString());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}