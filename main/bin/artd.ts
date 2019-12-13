#!/usr/bin/env node

import * as inquirer from 'inquirer';
import log from '../lib/log';
import init from '../lib/console/init';
import * as program from 'commander';
import githubTemplateRequest, {configHandler, handleResponseSource} from '../lib/handleRequest';
import chalk from "chalk";
import * as ora from 'ora';

const pkg = require('../../package.json');

const spinner = ora('Downloading template...');

program
    .usage('--start')
    .version(pkg.version)
    .option('-s, --start', '开启cli模板选择')
    .parse(process.argv);

program.on('--help', function () {
  log.info('  示例(Examples):');
  log.info();
  log.info('  artd  --start/-s ');
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

const initFunction = (config: any[] = defaultConfig) => {
  inquirer.prompt(config)
      .then(data => {
        log.info('项目选择成功，正在开始给您初始化项目.......');
        const {select} = data;
        const template = select[0];
        const dirPath = select[0];
        init({
          template,
          dirPath,
        })
      });
};

if (program.start) {
  log.info('Get template form remote ......');
  spinner.start();
  githubTemplateRequest()
      .then((res: any[]) => {
        spinner.succeed(chalk.green('Download template successfully'));
        const choicesList: { name: string, value: string }[] = handleResponseSource(res);
        initFunction(configHandler(choicesList))
      })
      .catch(err => {
        spinner.warn('Get template fail');
        log.info('Start local template config......');
        initFunction();
      });
} else {
  program.help();
}




