import inquirer from 'inquirer';
import chalk from 'chalk';
import Conf from 'conf';

const config = new Conf({
  projectName: 'lib-check',
});

/**
 * 사용자 ID를 가져오거나 새로 설정하는 함수
 */
export async function getUserId() {
  let userId = config.get('userId');

  if (!userId) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'userId',
        message: 'Please enter your user ID or name:',
        validate: (input) => input.trim().length > 0 || 'User ID is required',
      },
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

/**
 * 사용자의 라이브러리 목록을 가져오는 함수
 */
export function getUserLibraries(userId) {
  const libraries = config.get(`libraries.${userId}`) || [];
  return Array.isArray(libraries) ? libraries : [];
}

/**
 * 사용자 ID 변경 함수
 */
export async function changeUserId() {
  const oldUserId = config.get('userId');

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'newUserId',
      message: 'Enter new user ID:',
      validate: (input) => input.trim().length > 0 || 'User ID is required',
    },
  ]);

  const libraries = getUserLibraries(oldUserId);
  config.set('userId', answer.newUserId);
  config.set(`libraries.${answer.newUserId}`, libraries);
  config.delete(`libraries.${oldUserId}`);

  console.log(chalk.green(`User ID changed from "${oldUserId}" to "${answer.newUserId}"`));

  return answer.newUserId;
}

/**
 * 라이브러리 추가
 */
export function addLibrary(userId, libraryName) {
  const libraries = getUserLibraries(userId);

  if (!libraries.includes(libraryName)) {
    libraries.push(libraryName);
    config.set(`libraries.${userId}`, libraries);
    return true;
  }

  return false;
}

/**
 * 라이브러리 제거
 */
export function removeLibrary(userId, libraryName) {
  const libraries = getUserLibraries(userId);
  const index = libraries.indexOf(libraryName);

  if (index > -1) {
    libraries.splice(index, 1);
    config.set(`libraries.${userId}`, libraries);
    return true;
  }

  return false;
}

/**
 * 설정 초기화
 */
export function resetConfig() {
  config.clear();
  return true;
}

/**
 * 버전 정보 저장
 */
export function saveVersions(userId, versionsMap) {
  config.set(`versions.${userId}`, versionsMap);
  return true;
}

/**
 * 저장된 버전 정보 가져오기
 */
export function getSavedVersions(userId) {
  return config.get(`versions.${userId}`) || {};
}

export { config };
