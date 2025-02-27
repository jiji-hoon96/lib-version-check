import inquirer from 'inquirer';
import chalk from 'chalk';
import { getUserId, getUserLibraries, removeLibrary } from '../utils/user-utils.js';

export const removeCommand = {
  name: 'remove',
  description: 'Remove a library from watch list',
  action: async () => {
    const userId = await getUserId();
    const userLibraries = getUserLibraries(userId);

    if (userLibraries.length === 0) {
      console.log(chalk.yellow('No libraries in your watch list'));
      return;
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'library',
        message: 'Select library to remove:',
        choices: userLibraries,
      },
    ]);

    if (removeLibrary(userId, answer.library)) {
      console.log(chalk.green(`Removed ${answer.library} from your watch list`));
    }
  },
};
