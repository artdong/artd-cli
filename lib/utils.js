'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

exports.getGitInfo = (key) => {
    try {
        return execSync(`git config --get ${key || ''}`).toString().trim();
    } catch (e) {
        return '';
    }
};

const isPaitObject = (data) => {
    if (data) {
        return data.toString() === '[object Object]';
    } else {
        return false;
    }
};

/**
 * 生成package.json
 * @param {*} _path
 * @param {*} conf
 * @param {*} oldPackage
 */
exports.packageGenerater = (_path, conf) => {
    try {
        _path = path.resolve(_path, 'package.json');
        let packageJson = JSON.parse(fs.readFileSync(_path) || '{}');
        let items = ['version', 'name', 'author', 'description'];
        let deleteItems = ['repository', 'private'];
        items.forEach(item => {
            if (deleteItems.indexOf(item) >= 0) {
                return delete packageJson[item];
            }
            let _item = packageJson[item];
            if (isPaitObject(_item)) {
                packageJson[item] = Object.assign(_item, conf[item] || {});
            } else if (Array.isArray(_item)) {
                packageJson[item] = [..._item, ...(conf[item] || [])];
            } else {
                packageJson[item] = conf[item] || '';
            }
        });
        fs.writeFileSync(_path, JSON.stringify(packageJson, null, 4));
    } catch (e) {
        console.log(e.message);
    }
};