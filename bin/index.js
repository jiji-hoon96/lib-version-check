#!/usr/bin/env node

const { program } = require('commander');
const Conf = require('conf');
const chalk = require('chalk');
const fetch = require('node-fetch');

const config = new Conf({
    projectName: 'lib-check',
    defaults: {
        libraries: []
    }
});

async function fetchPackageInfo(packageName) {
    try {
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        const data = await response.json();

        return {
            name: packageName,
            currentVersion: data['dist-tags'].latest,
            lastUpdate: new Date(data.time.modified).toLocaleDateString(),
            description: data.description
        };
    } catch (error) {
        console.error(chalk.red(`Error fetching info for ${packageName}: ${error.message}`));
        return null;
    }
}

program
    .name('lib-check')
    .description('CLI to check NPM library versions and updates')
    .version('1.0.0');

program
    .command('add <library>')
    .description('Add a library to watch list')
    .action((library) => {
        const libraries = config.get('libraries');
        if (!libraries.includes(library)) {
            libraries.push(library);
            config.set('libraries', libraries);
            console.log(chalk.green(`Added ${library} to watch list`));
        } else {
            console.log(chalk.yellow(`${library} is already in watch list`));
        }
    });

program
    .command('remove <library>')
    .description('Remove a library from watch list')
    .action((library) => {
        const libraries = config.get('libraries');
        const index = libraries.indexOf(library);
        if (index > -1) {
            libraries.splice(index, 1);
            config.set('libraries', libraries);
            console.log(chalk.green(`Removed ${library} from watch list`));
        } else {
            console.log(chalk.yellow(`${library} is not in watch list`));
        }
    });

program
    .command('list')
    .description('List all watched libraries')
    .action(() => {
        const libraries = config.get('libraries');
        console.log(chalk.blue('Watched libraries:'));
        libraries.forEach(lib => console.log(`- ${lib}`));
    });

program
    .command('check')
    .description('Check versions of all watched libraries')
    .action(async () => {
        const libraries = config.get('libraries');
        console.log(chalk.blue('Fetching library information...\n'));

        for (const lib of libraries) {
            const info = await fetchPackageInfo(lib);
            if (info) {
                console.log(chalk.green(`${info.name}:`));
                console.log(`  Current version: ${info.currentVersion}`);
                console.log(`  Last updated: ${info.lastUpdate}`);
                console.log(`  Description: ${info.description}\n`);
            }
        }
    });

program.parse();