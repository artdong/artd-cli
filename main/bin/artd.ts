#!/usr/bin/env node
'use strict';

import * as inquirer from 'inquirer';
import log from '../lib/log';
import init from '../lib/console/init';
import * as program from 'commander';
import githubTemplateRequest, {configHandler, handleResponseSource} from '../lib/handleRequest';
import chalk from "chalk";
import * as ora from 'ora';

const pkg = require('../../package.json');

const spinner = ora('Downloading template...');
const temps = ['vue-admin', 'antd-admin'];

program
    .usage('<command> [template]')
    .version(pkg.version)
    .parse(process.argv);

program.on('--help', function () {
  help();
});

const defaultConfig = [
  {
    type: 'checkbox',
    message: '请选择创建项目类型',
    name: 'select',
    choices: [
      new inquirer.Separator(' = 前台程序 = '),
      {
        name: 'vue2 + element-ui + axios',
        value: 'vue-admin'
      },
      {
        name: 'react + antd',
        value: 'antd-admin'
      }
    ],
    validate: function (answer) {
      if (answer.length !== 1) {
        return '只能选择一个初始化项目模板';
      }
      return true;
    }
  }
];

const commands = program.args;

if(commands[0]) {
    runCommand(commands);
}else{ // 当没有时,默认输出help信息
    program.help();
}

/**
 * 运行命令
 * @param  {String} command 命令脚本
 * @param  {Object} env     运行环境
 */
function runCommand(commands) {
  const firstCommand = commands[0];
  const secondCommand = commands[1];
  switch(firstCommand) {
  case 'start':
      if(secondCommand) {
          if(temps.includes(secondCommand)) {
            log.info('Get template form remote ......');
            spinner.start();
            githubTemplateRequest()
                .then((res: any[]) => {
                  spinner.succeed(chalk.green('Get template form remote successfully'));
                  log.info(`正在开始为您初始化项目(${secondCommand}).......`);
                  let template = secondCommand;
                  let dirPath = secondCommand;
                  init({
                      template,
                      dirPath
                  });
                })
                .catch(err => {
                  spinner.warn('Get template fail');
                });
          }else {
              program.help(); 
          }
      }else {
          log.info('Get template form remote ......');
          spinner.start();
          githubTemplateRequest()
              .then((res: any[]) => {
                spinner.succeed(chalk.green('Get template form remote successfully'));
                const choicesList: { name: string, value: string }[] = handleResponseSource(res);
                initFunction(configHandler(choicesList))
              })
              .catch(err => {
                spinner.warn('Get template fail');
              });
      }
      break;
  default:
      program.help();
  } 
}

function initFunction (config: any[] = defaultConfig) {
  inquirer.prompt(config)
      .then(data => {
        const {select} = data;
        const template = select[0];
        const dirPath = select[0];
        log.info(`项目选择成功，正在开始为您初始化项目(${template}).......`);
        init({
          template,
          dirPath,
        })
      });
};

// 自定义 help
function help() {
  console.log();
  console.log('  Global Commands:');
  console.log();
  log.tip('    artd start: ', '开启cli模板选择');
  log.tip('    artd start <template>(vue-admin/antd-admin): ', '初始化项目模板');
}




