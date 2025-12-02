
import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.cyan.bold('\nПрограмма для подготовки данных для REST API сервера.'));
    console.info(chalk.cyan('Пример:'));
    console.info('    cli.js --<command> [--arguments]\n');
    console.info(chalk.green('Команды:'));
    console.info(`  ${chalk.yellow('--version')}:                   выводит номер версии`);
    console.info(`  ${chalk.yellow('--help')}:                      печатает этот текст`);
    console.info(`  ${chalk.yellow('--import <path>')}:             импортирует данные из TSV`);
    console.info(`  ${chalk.yellow('--generate <n> <path> <url>')}:  генерирует тестовые данные`);
    console.info();
  }
}
