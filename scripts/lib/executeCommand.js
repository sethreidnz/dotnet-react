const chalk = require('chalk')
const spawn = require('child_process').spawn

const executeCommand = (command, args) => new Promise((resolve, reject) => {
  console.log(chalk.blue(`Running command: \n\n ${command} ${args.join(' ')} \n\n`))
  const childProcess = spawn(command, args)
  childProcess.stdout.on('data', (data) => {
    console.log(chalk.gray(data.toString()))
  })
  childProcess.stdout.on('error', (err) => {
    reject(err)
  })
  childProcess.on('close', (code) => {
    if (code !== 0) {
      reject(`Command '${command} ${args.join(' ')} failed with code 0'`)
    }
    console.log(chalk.green(`Successfully ran command: \n\n ${command} ${args.join(' ')} \n\n`))
    resolve()
  })
})

module.exports = executeCommand
