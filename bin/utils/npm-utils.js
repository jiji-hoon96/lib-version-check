import fetch from 'node-fetch';
import chalk from 'chalk';

/**
 * NPM 패키지 검색
 */
export async function searchNpmPackages(searchText) {
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

    return data.objects.map((pkg) => ({
      name: pkg.package.name,
      description: pkg.package.description || 'No description available',
    }));
  } catch (error) {
    console.error(chalk.red('Error searching packages:', error.message));
    return [];
  }
}

/**
 * 패키지 정보 가져오기
 */
export async function fetchPackageInfo(packageName) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    const data = await response.json();

    return {
      name: packageName,
      currentVersion: data['dist-tags'].latest,
      lastUpdate: new Date(data.time.modified).toLocaleDateString(),
      description: data.description,
      homepage: data.homepage || null,
    };
  } catch (error) {
    console.error(chalk.red(`Error fetching info for ${packageName}: ${error.message}`));
    return null;
  }
}
