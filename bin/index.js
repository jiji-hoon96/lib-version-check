#!/usr/bin/env node

import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { checkCommand } from './commands/check.js';
import { configCommand } from './commands/config.js';
import { listCommand } from './commands/list.js';
import { presetCommand } from './commands/preset.js';
import { previewCommand } from './commands/preview.js';
import { removeCommand } from './commands/remove.js';
import { saveVersionsCommand } from './commands/save-versions.js';

// 명령어 등록 프로그램 생성
const program = new Command();
program
  .name('lib-check')
  .description('CLI to check NPM library versions with autocomplete')
  .version('1.3.2');

// add 명령어 등록
program.command(addCommand.name).description(addCommand.description).action(addCommand.action);

// check 명령어 등록
program
  .command(checkCommand.name)
  .description(checkCommand.description)
  .option('-d, --detailed', 'Show detailed dependency information')
  .action(checkCommand.action);

// config 명령어 등록
const configCmd = program
  .command(configCommand.name)
  .description(configCommand.description)
  .action(configCommand.action);

// config 명령어 옵션 등록
if (configCommand.options) {
  configCommand.options.forEach((option) => {
    configCmd.option(option.flags, option.description);
  });
}

// list 명령어 등록
program.command(listCommand.name).description(listCommand.description).action(listCommand.action);

// preset 명령어 등록
program
  .command(presetCommand.name)
  .description(presetCommand.description)
  .action(presetCommand.action);

// preview 명령어 등록
const previewCmd = program
  .command(previewCommand.name)
  .description(previewCommand.description)
  .action(previewCommand.action);

// preview 명령어 옵션 등록
if (previewCommand.options) {
  previewCommand.options.forEach((option) => {
    previewCmd.option(option.flags, option.description);
  });
}

// remove 명령어 등록
program
  .command(removeCommand.name)
  .description(removeCommand.description)
  .action(removeCommand.action);

// save-versions 명령어 등록
program
  .command(saveVersionsCommand.name)
  .description(saveVersionsCommand.description)
  .action(saveVersionsCommand.action);

// 명령줄 인수 파싱 및 실행
program.parse(process.argv);
