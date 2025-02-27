import inquirer from 'inquirer';
import chalk from 'chalk';
import { getUserId, getUserLibraries, addLibrary } from '../utils/user-utils.js';
import { fetchPackageInfo } from '../utils/npm-utils.js';
import { PRESETS } from '../presets/index.js';

export const presetCommand = {
  name: 'preset',
  description: 'Explore preset library stacks and their details',
  action: async () => {
    const userId = await getUserId();
    const userLibraries = new Set(getUserLibraries(userId));

    async function explorePresets() {
      // 카테고리 선택
      const categoryAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'category',
          message: 'Select a technology category:',
          choices: [
            ...Object.keys(PRESETS).map((category) => ({
              name: category.charAt(0).toUpperCase() + category.slice(1),
              value: category,
            })),
            { name: 'Adding your own presets', value: 'contribute' },
            { name: 'Exit Preset Explorer', value: 'exit' },
          ],
        },
      ]);

      // 기여 옵션 처리
      if (categoryAnswer.category === 'contribute') {
        displayContributeInfo();
        const continueAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Would you like to go back to preset explorer?',
            default: true,
          },
        ]);
        return continueAnswer.continue;
      }

      // 종료 옵션 처리
      if (categoryAnswer.category === 'exit') {
        console.log(chalk.blue('Exiting preset explorer.'));
        return false;
      }

      // 선택한 카테고리 내에서 프리셋 선택
      const presetAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'preset',
          message: 'Select a preset stack:',
          choices: [
            ...Object.entries(PRESETS[categoryAnswer.category]).map(([key, value]) => ({
              name: value.name,
              value: key,
            })),
            { name: '⬅️ Back to Categories', value: 'back' },
            { name: '🆕 Adding your own presets', value: 'contribute' },
          ],
        },
      ]);

      // 기여 옵션 처리
      if (presetAnswer.preset === 'contribute') {
        displayContributeInfo();
        const continueAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Would you like to go back to preset explorer?',
            default: true,
          },
        ]);
        return continueAnswer.continue;
      }

      // 카테고리 선택으로 돌아가기
      if (presetAnswer.preset === 'back') {
        return true;
      }

      const selectedPreset = PRESETS[categoryAnswer.category][presetAnswer.preset];

      console.log(chalk.blue(`\n📦 ${selectedPreset.name} Details:\n`));

      // 패키지 정보 가져오기 및 표시
      const packageDetails = [];
      for (const pkg of selectedPreset.packages) {
        try {
          const info = await fetchPackageInfo(pkg);
          if (info) {
            packageDetails.push({
              name: pkg,
              version: info.currentVersion,
              description: info.description,
              lastUpdated: info.lastUpdate,
              inWatchList: userLibraries.has(pkg),
            });
          }
        } catch (error) {
          console.error(chalk.red(`Error fetching info for ${pkg}: ${error.message}`));
        }
      }

      // 패키지 정보를 테이블 형태로 표시
      for (const pkg of packageDetails) {
        console.log(
          chalk.green(
            `${pkg.name}${pkg.inWatchList ? chalk.yellow(' (Already in watch list)') : ''}:`
          )
        );
        console.log(`  Version:      ${pkg.version}`);
        console.log(`  Last Updated: ${pkg.lastUpdated}`);
        console.log(`  Description:  ${pkg.description}`);
        console.log('');
      }

      // 다음 작업 선택
      const actionAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Add all packages to my watch list', value: 'add' },
            { name: 'Explore another preset', value: 'explore' },
            { name: 'Adding your own presets', value: 'contribute' },
            { name: 'Exit Preset Explorer', value: 'exit' },
          ],
        },
      ]);

      switch (actionAnswer.action) {
        case 'add': {
          // 감시 목록에 패키지 추가
          for (const pkg of selectedPreset.packages) {
            if (!userLibraries.has(pkg)) {
              addLibrary(userId, pkg);
              console.log(chalk.green(`Added ${pkg} to your watch list`));
            } else {
              console.log(chalk.yellow(`${pkg} is already in your watch list`));
            }
          }
          console.log(chalk.blue('\n✅ Packages added to your watch list!'));
          break;
        }
        case 'explore':
          // 계속 탐색
          return true;
        case 'contribute':
          displayContributeInfo();
          const continueAnswer = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'continue',
              message: 'Would you like to go back to preset explorer?',
              default: true,
            },
          ]);
          return continueAnswer.continue;
        case 'exit':
          console.log(chalk.blue('Exiting preset explorer.'));
          return false;
      }

      // 기본적으로 계속 탐색
      return true;
    }

    // 사용자가 종료할 때까지 탐색 계속
    while (await explorePresets()) {
      // 사용자가 종료를 선택할 때까지 루프 계속
    }
  },
};

// 기여 정보 표시
function displayContributeInfo() {
  console.log(chalk.blue('\n🚀 Contribute Your Preset Stack\n'));
  console.log(chalk.green('How to Add a New Preset:'));
  console.log('1. Visit the GitHub repository:');
  console.log(chalk.yellow('   https://github.com/jiji-hoon96/lib-version-check/pulls\n'));
  console.log(chalk.green('Contribution Steps:'));
  console.log('- Fork the repository');
  console.log('- Modify the `presets.js` file');
  console.log('- Create a pull request with your new preset stack\n');
  console.log(chalk.blue('🔗 Direct PR Link:'));
  console.log(chalk.yellow('https://github.com/jiji-hoon96/lib-version-check/compare\n'));
}
