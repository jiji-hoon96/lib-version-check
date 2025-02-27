import chalk from 'chalk';
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

    console.log(chalk.blue('Fetching library information...\n'));

    for (const lib of userLibraries) {
      const info = await fetchPackageInfo(lib);
      if (info) {
        console.log(chalk.green(`${info.name}:`));
        console.log(`  Current version: ${info.currentVersion}`);

        if (savedVersions[lib]) {
          const updateType = getUpdateType(savedVersions[lib], info.currentVersion);
          if (updateType !== 'NONE') {
            console.log(
              chalk.yellow(
                `  Update available: ${savedVersions[lib]} → ${info.currentVersion} (${updateType})`
              )
            );
          }
        }

        console.log(`  Last updated: ${info.lastUpdate}`);
        console.log(`  Description: ${info.description}`);

        if (options.detailed) {
          const deps = await analyzeDependencies(lib, info.currentVersion);
          if (deps) {
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
            console.log(`  Dependencies: ${Object.keys(deps.dependencies).length}`);
            console.log(`  Peer Dependencies: ${Object.keys(deps.peerDependencies).length}`);
          }
        }

        if (info.homepage) {
          console.log(`  Homepage: ${info.homepage}`);
        }
        console.log('');
      }
    }
  },
};
