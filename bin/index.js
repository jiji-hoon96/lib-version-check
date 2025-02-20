#!/usr/bin/env node

import { Command } from 'commander';
import Conf from 'conf';
import chalk from 'chalk';
import fetch from 'node-fetch';
import inquirer from 'inquirer';
import inquirerAutocomplete from 'inquirer-autocomplete-prompt';
import {PRESETS} from "./presets.js";
import {analyzeDependencies} from "./dependencyAnalyzer.js";
import {getUpdateType} from "./versionUtils.js";

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
    .command('preset')
    .description('Add a preset group of libraries to watch list')
    .action(async () => {
        const userId = await getUserId();

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'preset',
                message: 'Select a preset to add:',
                choices: Object.entries(PRESETS).map(([key, value]) => ({
                    name: value.name,
                    value: key
                }))
            }
        ]);

        const selectedPreset = PRESETS[answer.preset];
        const userLibraries = new Set(config.get(`libraries.${userId}`) || []);

        console.log(chalk.blue(`Adding ${selectedPreset.name} packages...`));

        for (const pkg of selectedPreset.packages) {
            if (!userLibraries.has(pkg)) {
                userLibraries.add(pkg);
                console.log(chalk.green(`Added ${pkg}`));
            } else {
                console.log(chalk.yellow(`${pkg} is already in your watch list`));
            }
        }

        config.set(`libraries.${userId}`, Array.from(userLibraries));
        console.log(chalk.green('\nPreset added successfully!'));
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
    .option('-d, --detailed', 'Show detailed dependency information')
    .action(async (options) => {
        const userId = await getUserId();
        const userLibraries = config.get(`libraries.${userId}`) || [];
        const savedVersions = config.get(`versions.${userId}`) || {};

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

                if (savedVersions[lib]) {
                    const updateType = getUpdateType(savedVersions[lib], info.currentVersion);
                    if (updateType !== 'NONE') {
                        console.log(chalk.yellow(`  Update available: ${savedVersions[lib]} → ${info.currentVersion} (${updateType})`));
                    }
                }

                console.log(`  Last updated: ${info.lastUpdate}`);
                console.log(`  Description: ${info.description}`);

                if (options.detailed) {
                    const deps = await analyzeDependencies(lib, info.currentVersion);
                    if (deps) {
                        if (deps.bundleSize) {
                            console.log(`  Bundle size: ${(deps.
                                bundleSize.size / 1024).toFixed(1)}KB (${(deps.bundleSize.gzip / 1024).toFixed(1)}KB gzipped)`);
                        }
                        if (deps.vulnerabilities && deps.vulnerabilities.length > 0) {
                            console.log(chalk.red(`  Vulnerabilities found: ${deps.vulnerabilities.length}`));
                        }
                        console.log('  Dependencies:', Object.keys(deps.dependencies).length);
                        console.log('  Peer Dependencies:', Object.keys(deps.peerDependencies).length);
                    }
                }

                if (info.homepage) {
                    console.log(`  Homepage: ${info.homepage}`);
                }
                console.log('');
            }
        }
    });

program
    .command('save-versions')
    .description('Save current versions as reference for future comparisons')
    .action(async () => {
        const userId = await getUserId();
        const userLibraries = config.get(`libraries.${userId}`) || [];
        const versions = {};

        for (const lib of userLibraries) {
            const info = await fetchPackageInfo(lib);
            if (info) {
                versions[lib] = info.currentVersion;
            }
        }

        config.set(`versions.${userId}`, versions);
        console.log(chalk.green('Current versions saved as reference'));
    });

program
    .command('preview')
    .description('Preview information about packages in a preset without adding them')
    .option('-d, --detailed', 'Show detailed dependency information')
    .action(async (options) => {
        try {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'preset',
                    message: 'Select a preset to preview:',
                    choices: Object.entries(PRESETS).map(([key, value]) => ({
                        name: `${value.name} (${value.packages.length} packages)`,
                        value: key
                    }))
                }
            ]);

            const selectedPreset = PRESETS[answer.preset];

            console.log(chalk.blue(`\nPreviewing ${selectedPreset.name}:`));
            console.log(chalk.dim('This will show information about the preset packages without adding them to your watch list.\n'));

            console.log(chalk.yellow('Calculating total bundle size and analyzing dependencies...\n'));

            let totalSize = 0;
            let totalGzip = 0;
            let totalDependencies = new Set();
            let totalPeerDependencies = new Set();

            for (const pkg of selectedPreset.packages) {
                const info = await fetchPackageInfo(pkg);
                if (info) {
                    console.log(chalk.green(`${info.name}:`));
                    console.log(`  Current version: ${info.currentVersion}`);
                    console.log(`  Last updated: ${info.lastUpdate}`);
                    console.log(`  Description: ${info.description}`);

                    if (options.detailed) {
                        const deps = await analyzeDependencies(pkg, info.currentVersion);
                        if (deps) {
                            if (deps.bundleSize) {
                                const sizeKB = (deps.bundleSize.size / 1024).toFixed(1);
                                const gzipKB = (deps.bundleSize.gzip / 1024).toFixed(1);
                                console.log(`  Bundle size: ${sizeKB}KB (${gzipKB}KB gzipped)`);
                                totalSize += deps.bundleSize.size;
                                totalGzip += deps.bundleSize.gzip;
                            }

                            // Collect all dependencies
                            Object.keys(deps.dependencies || {}).forEach(dep => totalDependencies.add(dep));
                            Object.keys(deps.peerDependencies || {}).forEach(dep => totalPeerDependencies.add(dep));

                            console.log(`  Dependencies: ${Object.keys(deps.dependencies || {}).length}`);
                            console.log(`  Peer Dependencies: ${Object.keys(deps.peerDependencies || {}).length}`);
                        }
                    }

                    if (info.homepage) {
                        console.log(`  Homepage: ${info.homepage}`);
                    }
                    console.log('');
                }
            }

            console.log(chalk.blue('\nPreset Summary:'));
            console.log(`Total packages: ${selectedPreset.packages.length}`);
            if (options.detailed) {
                console.log(`Total unique dependencies: ${totalDependencies.size}`);
                console.log(`Total unique peer dependencies: ${totalPeerDependencies.size}`);
                console.log(`Total bundle size: ${(totalSize / 1024).toFixed(1)}KB (${(totalGzip / 1024).toFixed(1)}KB gzipped)`);
            }

            const actionAnswer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        { name: 'Add this preset to my watch list', value: 'add' },
                        { name: 'Preview another preset', value: 'preview' },
                        { name: 'Exit', value: 'exit' }
                    ]
                }
            ]);

            if (actionAnswer.action === 'add') {
                const userId = await getUserId();
                const userLibraries = new Set(config.get(`libraries.${userId}`) || []);

                for (const pkg of selectedPreset.packages) {
                    if (!userLibraries.has(pkg)) {
                        userLibraries.add(pkg);
                        console.log(chalk.green(`Added ${pkg}`));
                    } else {
                        console.log(chalk.yellow(`${pkg} is already in your watch list`));
                    }
                }

                config.set(`libraries.${userId}`, Array.from(userLibraries));
                console.log(chalk.green('\nPreset added successfully!'));
            } else if (actionAnswer.action === 'preview') {
                await program.commands.find(cmd => cmd.name() === 'preview').action(options);
            }
        } catch (error) {
            console.error(chalk.red('Error previewing preset:', error.message));
        }
    });

program.parse(process.argv);
