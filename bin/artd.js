#!/usr/bin/env node

const inquirer = require('inquirer');
const log = require('../lib/log');
const init = require('../lib/console/init');
const program = require('commander');
const pkg = require('../package.json');

program
    .usage('--start')
    .version(pkg.version)
    .option('-s, --start', '开启cli模板选择')
    .parse(process.argv);

program.on('--help', function () {
    console.log('  示例(Examples):');
    console.log();
    console.log('    art --start/-s');
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

if (program.start) {
    inquirer.prompt(config)
        .then(data => {
            log.info('项目选择成功，正在开始给您初始化项目.......');
            let template = data.select[0];
            let dirPath = data.select[0];
            init({
                template,
                dirPath
            })
        });
} else {
    program.help();
}




