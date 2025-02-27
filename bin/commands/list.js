import chalk from 'chalk';
import { getUserId, getUserLibraries } from '../utils/user-utils.js';

export const listCommand = {
  name: 'list',
  description: 'List all watched libraries',
  action: async () => {
    const userId = await getUserId();
    const userLibraries = getUserLibraries(userId);

    console.log(chalk.blue(`Watched libraries for user "${userId}":`));
    if (userLibraries.length === 0) {
      console.log('No libraries in watch list. Add one with: lib-check add');
    } else {
      for (const lib of userLibraries) {
        console.log(`- ${lib}`);
      }
    }
  },
};
