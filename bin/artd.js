#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const log = require('../lib/log');
const init = require('../lib/console/init');
const githubRequest = require('../lib/handleRequest');
const program = require('commander');
const pkg = require('../package.json');
const ora = require('ora');
const chalk = require('chalk');
const utils = require('../lib/utils');

const spinner = ora('Downloading template...');
const temps = ['vue-admin', 'antd-admin'];

program
    .option('-v, --version', 'output the version')
    .description('art commander');

program
    .usage('<command> [template]')
    .version(pkg.version)
    .parse(process.argv);

program.on('--help', function () {
    help();
});

const TEMPLATES = [
    {
        value: 'vue-admin',
        name: 'vue-admin',
        des: 'vue2 + element-ui + axios',
        template: 'vue-admin'
    },
    {
        value: 'antd-admin',
        name: 'antd-admin',
        des: 'react + antd',
        template: 'antd-admin'
    }
];

let defaultConfig = [
    {name: 'name', message: '请输入项目名', default: 'project-name'},
    {name: 'description', message: '描述', default: '项目描述'},
    {name: 'version', message: '版本号?', default: '0.0.1'},
    {name: 'author', message: '作者?', default: utils.getGitInfo('user.name')},
    {name: 'template', message: '请选择模板类型?', type: 'list', choices: TEMPLATES.map(item => {
        let {name, value} = item;
        return {name, value};
    }), default: 'vue-admin'},
    {
        name: 'confirm',
        message: '是否确认生成项目',
        default: 'Yes'
    },
    {
        name: 'judege',
        message: '',
        default: '',
        when: function(anwser) {
            if (['y', 'Y', 'Yes', 'yes', 'YES'].indexOf(anwser.confirm) < 0) {
                process.exit();
            }
        }
    }
];

const commands = program.args;

if(commands[0]) {
    runCommand(commands, program);
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
                log.info(`正在开始为您初始化项目(${secondCommand}).......`);
                spinner.start();
                githubRequest.handleRequest()
                    .then(() => {
                        spinner.succeed(chalk.green('Get template form remote successfully'));
                        let template = secondCommand;
                        const config = defaultConfig.filter(item => item.name !== 'template');
                        initFunction(config, template);
                    }).catch(() => {
                        spinner.warn('Get template fail');
                    });
            }else {
                program.help(); 
            }
        }else {
            log.info('Get template form remote ......');
            spinner.start();
            githubRequest.handleRequest()
                .then(() => {
                    spinner.succeed(chalk.green('Get template form remote successfully'));
                    initFunction();
                })
                .catch(() => {
                    spinner.warn('Get template fail');
                });
        }
        break;
    default:
        program.help();
    } 
}

function initFunction (config = defaultConfig, tpl) {
    inquirer.prompt(config)
        .then(data => {
            const config = data;
            const template = tpl || config.template;
            const dirPath = config.name;
            log.info(`项目选择成功，正在开始为您初始化项目(${template}).......`);
            init({
                template,
                dirPath,
                config
            });
        });
}

// 自定义 help
function help() {
    console.log();
    console.log('  Global Commands:');
    console.log();
    log.tip('    artd start: ', '开启cli模板选择');
    log.tip('    artd start <template>(vue-admin/antd-admin): ', '初始化项目模板');
}




