import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getUserId, addLibrary } from '../utils/user-utils.js';
import { fetchPackageInfo, fetchMultiplePackageInfo } from '../utils/npm-utils.js';
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

      const infoSpinner = ora(chalk.yellow('Fetching package information...')).start();

      // 병렬로 모든 패키지 정보 가져오기
      const packagesInfo = await fetchMultiplePackageInfo(selectedPreset.packages);

      infoSpinner.succeed('Package information fetched successfully!');

      let totalSize = 0;
      let totalGzip = 0;
      const totalDependencies = new Set();
      const totalPeerDependencies = new Set();

      // 상세 정보가 필요한 경우 병렬로 의존성 정보 가져오기
      if (options.detailed) {
        const depSpinner = ora(
          chalk.yellow('Calculating total bundle size and analyzing dependencies...')
        ).start();

        // 모든 패키지 의존성 분석을 병렬로 처리
        const depsPromises = packagesInfo.map(async (info) => {
          const deps = await analyzeDependencies(info.name, info.currentVersion);
          return { name: info.name, deps };
        });

        const depsResults = await Promise.all(depsPromises);

        // 결과 처리
        for (const result of depsResults) {
          if (result.deps) {
            if (result.deps.bundleSize) {
              totalSize += result.deps.bundleSize.size;
              totalGzip += result.deps.bundleSize.gzip;
            }

            // 모든 의존성 수집
            for (const dep of Object.keys(result.deps.dependencies || {})) {
              totalDependencies.add(dep);
            }
            for (const dep of Object.keys(result.deps.peerDependencies || {})) {
              totalPeerDependencies.add(dep);
            }
          }
        }

        depSpinner.succeed('Dependencies analyzed successfully!');
        console.log(''); // 빈 줄 추가
      }

      // 패키지 정보 표시
      for (const info of packagesInfo) {
        console.log(chalk.green(`${info.name}:`));
        console.log(`  Current version: ${info.currentVersion}`);
        console.log(`  Last updated: ${info.lastUpdate}`);
        console.log(`  Description: ${info.description}`);

        if (options.detailed) {
          // 해당 패키지의 의존성 정보 찾기 (이미 위에서 분석했으므로 다시 API 호출 없음)
          const deps = depsResults.find((r) => r.name === info.name)?.deps;

          if (deps) {
            if (deps.bundleSize) {
              const sizeKB = (deps.bundleSize.size / 1024).toFixed(1);
              const gzipKB = (deps.bundleSize.gzip / 1024).toFixed(1);
              console.log(`  Bundle size: ${sizeKB}KB (${gzipKB}KB gzipped)`);
            }

            console.log(`  Dependencies: ${Object.keys(deps.dependencies || {}).length}`);
            console.log(`  Peer Dependencies: ${Object.keys(deps.peerDependencies || {}).length}`);
          }
        }

        if (info.homepage) {
          console.log(`  Homepage: ${info.homepage}`);
        }
        console.log('');
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
