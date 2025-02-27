import inquirer from 'inquirer';
import inquirerAutocomplete from 'inquirer-autocomplete-prompt';
import chalk from 'chalk';
import { getUserId, addLibrary } from '../utils/user-utils.js';
import { searchNpmPackages } from '../utils/npm-utils.js';

inquirer.registerPrompt('autocomplete', inquirerAutocomplete);

export const addCommand = {
  name: 'add',
  description: 'Add a library to watch list with autocomplete',
  action: async () => {
    const userId = await getUserId();

    try {
      const answer = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'library',
          message: 'Search for a package:',
          source: async (answersSoFar, input = '') => {
            const packages = await searchNpmPackages(input);
            return packages.map((pkg) => ({
              name: `${pkg.name} - ${pkg.description}`,
              value: pkg.name,
            }));
          },
        },
      ]);

      if (addLibrary(userId, answer.library)) {
        console.log(chalk.green(`Added ${answer.library} to your watch list`));
      } else {
        console.log(chalk.yellow(`${answer.library} is already in your watch list`));
      }
    } catch (error) {
      console.error(chalk.red('Error adding library:', error.message));
    }
  },
};
