import chalk from 'chalk';
import { getUserId, getUserLibraries, changeUserId, resetConfig } from '../utils/user-utils.js';

export const configCommand = {
  name: 'config',
  description: 'Manage user configuration',
  options: [
    {
      flags: '-s, --show',
      description: 'Show current configuration',
    },
    {
      flags: '-c, --change',
      description: 'Change user ID',
    },
    {
      flags: '-r, --reset',
      description: 'Reset all configuration',
    },
  ],
  action: async (options) => {
    if (options.show) {
      const userId = await getUserId();
      const libraries = getUserLibraries(userId);
      console.log(chalk.blue('Current configuration:'));
      console.log(`User ID: ${userId}`);
      console.log(`Number of watched libraries: ${libraries.length}`);
    } else if (options.change) {
      await changeUserId();
    } else if (options.reset) {
      resetConfig();
      console.log(chalk.green('All configuration has been reset'));
    } else {
      console.log('Use --show, --change, or --reset option');
    }
  },
};
