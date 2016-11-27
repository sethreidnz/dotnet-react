
const chalk = require('chalk');

module.exports = (program, parameterKeys) => {
    const missingParameters = parameterKeys.filter((key) => {
        if (!program[key]) { return key; }
    })
    if (missingParameters.length > 0) {
    console.error(chalk.bold.red('You are missing the following required parameters:'));
    console.error(chalk.bold.red(missingParameters.toString()));
    process.exit();
    }
}