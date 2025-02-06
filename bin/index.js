
import { Command } from 'commander';
import Conf from 'conf';
import chalk from 'chalk';
import fetch from 'node-fetch';
import inquirer from 'inquirer';
import inquirerAutocomplete from 'inquirer-autocomplete-prompt';

const program = new Command();
inquirer.registerPrompt('autocomplete', inquirerAutocomplete);

const config = new Conf({
    projectName: 'lib-check'
});

async function getUserId() {
    let userId = config.get('userId');

    if (!userId) {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'userId',
                message: 'Please enter your user ID or name:',
                validate: input => input.trim().length > 0 || 'User ID is required'
            }
        ]);

        userId = answer.userId;
        config.set('userId', userId);
        // Initialize empty array for new user
        if (!config.has(`libraries.${userId}`)) {
            config.set(`libraries.${userId}`, []);
        }
        console.log(chalk.green(`User ID "${userId}" has been set successfully!`));
    }

    return userId;
}

async function searchNpmPackages(searchText) {
    try {
        if (!searchText || searchText.length < 3) {
            return [];
        }

        const response = await fetch(
            `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(searchText)}&size=10`
        );

        if (!response.ok) {
            throw new Error(`NPM API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.objects || !Array.isArray(data.objects)) {
            console.error(chalk.yellow('Warning: Unexpected API response format'));
            return [];
        }

        return data.objects.map(pkg => ({
            name: pkg.package.name,
            description: pkg.package.description || 'No description available'
        }));
    } catch (error) {
        console.error(chalk.red('Error searching packages:', error.message));
        return [];
    }
}

async function fetchPackageInfo(packageName) {
    try {
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        const data = await response.json();

        return {
            name: packageName,
            currentVersion: data['dist-tags'].latest,
            lastUpdate: new Date(data.time.modified).toLocaleDateString(),
            description: data.description,
            homepage: data.homepage || null
        };
    } catch (error) {
        console.error(chalk.red(`Error fetching info for ${packageName}: ${error.message}`));
        return null;
    }
}

program
    .name('lib-check')
    .description('CLI to check NPM library versions with autocomplete')
    .version('1.0.0');

program
    .command('config')
    .description('Manage user configuration')
    .option('-s, --show', 'Show current configuration')
    .option('-c, --change', 'Change user ID')
    .option('-r, --reset', 'Reset all configuration')
    .action(async (options) => {
        if (options.show) {
            const userId = config.get('userId');
            const libraries = config.get(`libraries.${userId}`) || [];
            console.log(chalk.blue('Current configuration:'));
            console.log(`User ID: ${userId}`);
            console.log(`Number of watched libraries: ${libraries.length}`);
        } else if (options.change) {
            const oldUserId = config.get('userId');
            const answer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newUserId',
                    message: 'Enter new user ID:',
                    validate: input => input.trim().length > 0 || 'User ID is required'
                }
            ]);

            const libraries = config.get(`libraries.${oldUserId}`) || [];
            config.set('userId', answer.newUserId);
            config.set(`libraries.${answer.newUserId}`, libraries);
            config.delete(`libraries.${oldUserId}`);
            console.log(chalk.green(`User ID changed from "${oldUserId}" to "${answer.newUserId}"`));
        } else if (options.reset) {
            config.clear();
            console.log(chalk.green('All configuration has been reset'));
        } else {
            console.log('Use --show, --change, or --reset option');
        }
    });

program
    .command('add')
    .description('Add a library to watch list with autocomplete')
    .action(async () => {
        const userId = await getUserId();

        try {
            const answer = await inquirer.prompt([
                {
                    type: 'autocomplete',
                    name: 'library',
                    message: 'Search for a package:',
                    source: async (answersSoFar, input = '') => {
                        const packages = await searchNpmPackages(input);
                        return packages.map(pkg => ({
                            name: `${pkg.name} - ${pkg.description}`,
                            value: pkg.name
                        }));
                    }
                }
            ]);

            const userLibraries = config.get(`libraries.${userId}`) || [];

            if (!Array.isArray(userLibraries)) {
                config.set(`libraries.${userId}`, []);
            }

            if (!userLibraries.includes(answer.library)) {
                config.set(`libraries.${userId}`, [...userLibraries, answer.library]);
                console.log(chalk.green(`Added ${answer.library} to your watch list`));
            } else {
                console.log(chalk.yellow(`${answer.library} is already in your watch list`));
            }
        } catch (error) {
            console.error(chalk.red('Error adding library:', error.message));
        }
    });

program
    .command('list')
    .description('List all watched libraries')
    .action(async () => {
        const userId = await getUserId();
        const userLibraries = config.get(`libraries.${userId}`) || [];

        console.log(chalk.blue(`Watched libraries for user "${userId}":`));
        if (!Array.isArray(userLibraries) || userLibraries.length === 0) {
            console.log('No libraries in watch list. Add one with: lib-check add');
        } else {
            userLibraries.forEach(lib => console.log(`- ${lib}`));
        }
    });

program
    .command('remove')
    .description('Remove a library from watch list')
    .action(async () => {
        const userId = await getUserId();
        const userLibraries = config.get(`libraries.${userId}`) || [];

        if (userLibraries.length === 0) {
            console.log(chalk.yellow('No libraries in your watch list'));
            return;
        }

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'library',
                message: 'Select library to remove:',
                choices: userLibraries
            }
        ]);

        const index = userLibraries.indexOf(answer.library);
        if (index > -1) {
            userLibraries.splice(index, 1);
            config.set(`libraries.${userId}`, userLibraries);
            console.log(chalk.green(`Removed ${answer.library} from your watch list`));
        }
    });

program
    .command('check')
    .description('Check versions of all watched libraries')
    .action(async () => {
        const userId = await getUserId();
        const userLibraries = config.get(`libraries.${userId}`) || [];

        if (userLibraries.length === 0) {
            console.log(chalk.yellow('No libraries in your watch list. Add one with: lib-check add'));
            return;
        }

        console.log(chalk.blue('Fetching library information...\n'));

        for (const lib of userLibraries) {
            const info = await fetchPackageInfo(lib);
            if (info) {
                console.log(chalk.green(`${info.name}:`));
                console.log(`  Current version: ${info.currentVersion}`);
                console.log(`  Last updated: ${info.lastUpdate}`);
                console.log(`  Description: ${info.description}`);
                if (info.homepage) {
                    console.log(`  Homepage: ${info.homepage}`);
                }
                console.log('');
            }
        }
    });

program.parse(process.argv);
