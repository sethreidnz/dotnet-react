const chalk = require('chalk')
const path = require('path')
const program = require('commander')

// local dependendies
const { cleanDirectories, ensureDirectories } = require('./lib/fileUtilities')

program
  .option('-a, --publishDirectory <publishDirectory>', 'The directory where the web package is published to. Defaults to "./release"')
  .option('-a, --deployDirectory <deployDirectory>', 'Defaults to "./deploy"')
  .parse(process.argv)

const publishDirectory = program.publishDirectory ? program.publishDirectory : path.join(__dirname, '../release')
const deployDirectory = program.deployDirectory ? program.deployDirectory : path.join(__dirname, '../deploy')

cleanDirectories([publishDirectory, deployDirectory])
.then(() => ensureDirectories([publishDirectory, deployDirectory]))
.then(() => {
  console.log(chalk.green('Finished cleaning.'))
})
.catch((error) => {
  console.log(chalk.red(`Error while cleaning. ${error}`))
})
