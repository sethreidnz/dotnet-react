// nodeX_modules
var zipdir = require('zip-dir');
const program = require('commander');
const chalk = require('chalk');

// local dependencies
const validateParameters = require('./lib/validateParameters');

program
.option('-d, --directory <directory>', 'The directory to zip')
.option('-o, --output <directory>', 'The file location/name to publish to. eg. c:/release.zip')
.parse(process.argv);

validateParameters(program, [
  'directory',
  'output'
]);

const zipDirectory = (directory, output) => {
  return new Promise((resolve, reject) => {
    zipdir(directory, { saveTo: output }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const directory = program.directory;
const output = program.output;

console.log(chalk.blue('Beginning zipping...'));
console.log(`directory: ${directory}`);
console.log(`output: ${output}`);

zipDirectory(directory, output)
.then(() => {
  console.log(chalk.green(`Succsessfully Zipped folder "${directory}" to archive "${output}"`));
})
.catch((error) => {
  console.log(chalk.red(`Failed to zip folder "${directory}" to archive "${output}": /n/n ${error}`));
});