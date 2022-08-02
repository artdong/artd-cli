'use strict';

const path = require('path');
const fs = require('fs-extra');
const userHome = require('user-home');
const download = require('download-git-repo');
const log = require('../log');
const chalk = require('chalk');
const ora = require('ora');
const utils = require('../utils');

module.exports = function (program) {
    const {template, dirPath, config} = program;
    const templateDownLoadPath = path.resolve(userHome, '.artd-cli-template', template);

    const remotePath = `github:art-cli-template/${template}`;
    const spinner = ora('downloading template...');

    spinner.start();
    download(remotePath, templateDownLoadPath, {clone: false}, (err) => {
        if (err) {
            spinner.fail(chalk.red('download template unsuccessfully'));
            log.error(err);
        } else {
            spinner.succeed(chalk.green('download template successfully'));
            const _path = path.resolve(process.cwd(), dirPath);
            fs.copySync(templateDownLoadPath, _path);
            utils.packageGenerater(dirPath, config);
            log.success('模板解析成功， 初始化成功');
        }
    });
};