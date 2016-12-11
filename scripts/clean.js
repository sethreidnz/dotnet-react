const chalk = require('chalk')
const path = require('path')

// local dependendies
const { cleanDirectories, ensureDirectories } = require('./lib/fileUtilities')

const releaseDirectory = path.join(__dirname, '../release')
const deployDirectory = path.join(__dirname, '../deploy')

cleanDirectories([releaseDirectory, deployDirectory])
.then(() => ensureDirectories([releaseDirectory, deployDirectory]))
.then(() => {
  console.log(chalk.green('Finished cleaning.'))
})
.catch((error) => {
  console.log(chalk.red(`Error while cleaning. ${error}`))
})
