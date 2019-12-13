#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const log = require('../lib/log');
const init = require('../lib/console/init');
const program = require('commander');
const pkg = require('../package.json');

const temps = ['vue-admin', 'antd-admin'];

program
    .usage('<command> [template]')
    .version(pkg.version)
    .parse(process.argv);

program.on('--help', function () {
    help();
});

let config = [
    {
        type: 'checkbox',
        message: '请选择',
        name: 'select',
        choices: [
            new inquirer.Separator(' = 前台程序 = '),
            {
                name: 'vue-admin',
                value: 'vue-admin'
            },
            {
                name: 'antd-admin',
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
                let template = secondCommand;
                let dirPath = secondCommand;
                init({
                    template,
                    dirPath
                });
            }else {
                program.help(); 
            }
        }else {
            inquirer.prompt(config)
                .then(data => {
                    let template = data.select[0];
                    let dirPath = data.select[0];
                    log.info(`项目选择成功，正在开始为您初始化项目(${template}).......`);
                    init({
                        template,
                        dirPath
                    });
                });
        }
        break;
    default:
        program.help();
    } 
}

// 自定义 help
function help() {
    console.log();
    console.log('  Global Commands:');
    console.log();
    log.tip('    artd start: ', '开启cli模板选择');
    log.tip('    artd start <template>(vue-admin/antd-admin): ', '初始化项目模板');
}




