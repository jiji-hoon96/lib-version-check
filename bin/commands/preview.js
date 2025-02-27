import inquirer from 'inquirer';
import chalk from 'chalk';
import { getUserId, addLibrary } from '../utils/user-utils.js';
import { fetchPackageInfo } from '../utils/npm-utils.js';
import { PRESETS } from '../presets/index.js';
import { analyzeDependencies } from '../utils/dependencyAnalyzer.js';

export const previewCommand = {
  name: 'preview',
  description: 'Preview information about packages in a preset without adding them',
  options: [
    {
      flags: '-d, --detailed',
      description: 'Show detailed dependency information',
    },
  ],
  action: async (options) => {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'preset',
          message: 'Select a preset to preview:',
          choices: Object.entries(PRESETS).flatMap(([category, categoryPresets]) =>
            Object.entries(categoryPresets).map(([key, value]) => ({
              name: `[${category}] ${value.name} (${value.packages.length} packages)`,
              value: { category, key },
            }))
          ),
        },
      ]);

      const selectedCategory = answer.preset.category;
      const selectedKey = answer.preset.key;
      const selectedPreset = PRESETS[selectedCategory][selectedKey];

      console.log(chalk.blue(`\nPreviewing ${selectedPreset.name}:`));
      console.log(
        chalk.dim(
          'This will show information about the preset packages without adding them to your watch list.\n'
        )
      );

      console.log(chalk.yellow('Calculating total bundle size and analyzing dependencies...\n'));

      let totalSize = 0;
      let totalGzip = 0;
      const totalDependencies = new Set();
      const totalPeerDependencies = new Set();

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

              // 모든 의존성 수집
              for (const dep of Object.keys(deps.dependencies || {})) {
                totalDependencies.add(dep);
              }
              for (const dep of Object.keys(deps.peerDependencies || {})) {
                totalPeerDependencies.add(dep);
              }

              console.log(`  Dependencies: ${Object.keys(deps.dependencies || {}).length}`);
              console.log(
                `  Peer Dependencies: ${Object.keys(deps.peerDependencies || {}).length}`
              );
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
        console.log(
          `Total bundle size: ${(totalSize / 1024).toFixed(1)}KB (${(totalGzip / 1024).toFixed(
            1
          )}KB gzipped)`
        );
      }

      const actionAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Add this preset to my watch list', value: 'add' },
            { name: 'Preview another preset', value: 'preview' },
            { name: 'Exit', value: 'exit' },
          ],
        },
      ]);

      if (actionAnswer.action === 'add') {
        const userId = await getUserId();

        for (const pkg of selectedPreset.packages) {
          const added = addLibrary(userId, pkg);
          if (added) {
            console.log(chalk.green(`Added ${pkg}`));
          } else {
            console.log(chalk.yellow(`${pkg} is already in your watch list`));
          }
        }

        console.log(chalk.green('\nPreset added successfully!'));
      } else if (actionAnswer.action === 'preview') {
        // 동일한 명령어를 다시 실행
        await previewCommand.action(options);
      }
    } catch (error) {
      console.error(chalk.red('Error previewing preset:', error.message));
    }
  },
};
