'use strict';

module.exports = function (program) {
    const path = require('path');
    const {template, dirPath} = program;
    const fse = require('fs-extra');
    const log = require('../log');

    let templatePath = path.resolve(__dirname, '../../template', template);
    fse.pathExists(templatePath).then(exists => {
        if(exists) {
            log.success('模板解析成功');
            fse.copySync(templatePath, path.resolve(process.cwd(), dirPath));
        } else {
            log.error('模板解析失败');
        }
    }).catch(err=>{
        throw err;
    });
};