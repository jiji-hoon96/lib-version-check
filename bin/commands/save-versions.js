import chalk from 'chalk';
import { getUserId, getUserLibraries, saveVersions } from '../utils/user-utils.js';
import { fetchPackageInfo } from '../utils/npm-utils.js';

export const saveVersionsCommand = {
  name: 'save-versions',
  description: 'Save current versions as reference for future comparisons',
  action: async () => {
    const userId = await getUserId();
    const userLibraries = getUserLibraries(userId);
    const versions = {};

    for (const lib of userLibraries) {
      const info = await fetchPackageInfo(lib);
      if (info) {
        versions[lib] = info.currentVersion;
      }
    }

    saveVersions(userId, versions);
    console.log(chalk.green('Current versions saved as reference'));
  },
};
