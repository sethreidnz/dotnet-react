var fs = require('fs');  
const chalk = require('chalk');
const path = require('path');
const git = require('git-rev');

const fileExists = (path) => (resolve, reject) => {
    try {
        fs.accessSync(path, fs.F_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const getArmTemplateParamters = (path) => new Promise((resolve, reject) => {
    return parseJsonFile(path).then((parametersFileJson) => {
        if (!parametersFileJson.parameters) {
            console.log(chalk.red(`You must have a "parameters" section in the file './scripts/paramters-example.js'.`));
            reject();
        }
        const armParameters= parametersFileJson.parameters;          
        resolve(armParameters);
    });
});

const parseJsonFile = (path) => new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {  
        if (err) reject(err);
        var jsonObject = JSON.parse(data);
        resolve(jsonObject);
    });
});

const getGitCommitHash = () => new Promise((resolve) => {
  git.long((str) => {
    resolve(str);
  });
});

const validateParameters = (program, parameterKeys) => {
    const missingParameters = parameterKeys.filter((key) => {
        if (!program[key]) { return key; }
    })
    if (missingParameters.length > 0) {
    console.error(chalk.bold.red('You are missing the following required parameters:'));
    console.error(chalk.bold.red(missingParameters.toString()));
    process.exit();
    }
}

module.exports = {
    fileExists,
    parseJsonFile,
    validateParameters,
    getArmTemplateParamters,
    getGitCommitHash
}