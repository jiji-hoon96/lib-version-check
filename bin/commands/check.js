import chalk from 'chalk';
import ora from 'ora';
import { getUserId, getUserLibraries, getSavedVersions } from '../utils/user-utils.js';
import { fetchPackageInfo } from '../utils/npm-utils.js';
import { getUpdateType } from '../utils/versionUtils.js';
import { analyzeDependencies } from '../utils/dependencyAnalyzer.js';

export const checkCommand = {
  name: 'check',
  description: 'Check versions of all watched libraries',
  options: [
    {
      flags: '-d, --detailed',
      description: 'Show detailed dependency information',
    },
  ],
  action: async (options) => {
    const userId = await getUserId();
    const userLibraries = getUserLibraries(userId);
    const savedVersions = getSavedVersions(userId);

    if (userLibraries.length === 0) {
      console.log(chalk.yellow('No libraries in your watch list. Add one with: lib-check add'));
      return;
    }

    const spinner = ora('Fetching library information...').start();

    try {
      // 병렬로 모든 패키지 정보 가져오기
      const packagePromises = userLibraries.map((lib) => fetchPackageInfo(lib));
      const packagesInfo = await Promise.all(packagePromises);

      // 스피너 완료 표시
      spinner.succeed('Library information fetched successfully!');
      console.log(''); // 빈 줄 추가

      // 유효한 패키지 정보만 필터링
      const validPackages = packagesInfo.filter((info) => info);

      // 상세 정보가 필요한 경우 병렬로 분석 데이터 가져오기
      let dependencyData = {};
      if (options.detailed) {
        const depSpinner = ora('Analyzing dependencies...').start();

        const depPromises = validPackages.map(async (info) => {
          const deps = await analyzeDependencies(info.name, info.currentVersion);
          return { name: info.name, deps };
        });

        const depsResults = await Promise.all(depPromises);
        dependencyData = depsResults.reduce((acc, item) => {
          if (item.deps) {
            acc[item.name] = item.deps;
          }
          return acc;
        }, {});

        depSpinner.succeed('Dependencies analyzed successfully!');
        console.log(''); // 빈 줄 추가
      }

      // 결과 표시
      for (const info of validPackages) {
        console.log(chalk.green(`${info.name}:`));
        console.log(`  Current version: ${info.currentVersion}`);

        if (savedVersions[info.name]) {
          const updateType = getUpdateType(savedVersions[info.name], info.currentVersion);
          if (updateType !== 'NONE') {
            console.log(
              chalk.yellow(
                `  Update available: ${savedVersions[info.name]} → ${
                  info.currentVersion
                } (${updateType})`
              )
            );
          }
        }

        console.log(`  Last updated: ${info.lastUpdate}`);
        console.log(`  Description: ${info.description}`);

        if (options.detailed && dependencyData[info.name]) {
          const deps = dependencyData[info.name];
          if (deps.bundleSize) {
            console.log(
              `  Bundle size: ${(deps.bundleSize.size / 1024).toFixed(1)}KB (${(
                deps.bundleSize.gzip / 1024
              ).toFixed(1)}KB gzipped)`
            );
          }
          if (deps.vulnerabilities && deps.vulnerabilities.length > 0) {
            console.log(chalk.red(`  Vulnerabilities found: ${deps.vulnerabilities.length}`));
          }
          console.log(`  Dependencies: ${Object.keys(deps.dependencies || {}).length}`);
          console.log(`  Peer Dependencies: ${Object.keys(deps.peerDependencies || {}).length}`);
        }

        if (info.homepage) {
          console.log(`  Homepage: ${info.homepage}`);
        }
        console.log('');
      }
    } catch (error) {
      spinner.fail('Error fetching library information');
      console.error(chalk.red('Error:', error.message));
    }
  },
};
