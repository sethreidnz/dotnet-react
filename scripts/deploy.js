const chalk = require('chalk')
const program = require('commander')

const {
  azureUtilities: {
    runArmDeployment
  }
} = require('./lib')

program
  .option('-a, --resourceGroupName <resourceGroupName>', 'The resource group to deploy to')
  .option('-a, --armTemplateFilePath <armTemplateFilePath>', 'Defaults to "./deploy/template.json"')
  .option('-a, --armParametersFilePath <armParametersFilePath>', 'Defaults to "./deploy/template-parameters.json"')
  .parse(process.argv)

let resourceGroupName = program.resourceGroupName
if (!resourceGroupName) {
  console.log(chalk.red('You must supply the parameter --resourceGroupName'))
  process.exit()
}
let deploymentName = null
let armTemplateFilePath = program.armTemplateFilePath || './deploy/template.json'
let armParametersFilePath = program.armParametersFilePath || './deploy/template-parameters.json'

console.log(chalk.blue('Beginning arm deployment: \n'))
console.log(chalk.blue(`resourceGroupName: ${resourceGroupName}`))
console.log(chalk.blue(`armTemplateFilePath: ${armTemplateFilePath}`))
console.log(chalk.blue(`armParametersFilePath: ${armParametersFilePath}`))
runArmDeployment(resourceGroupName, deploymentName, armTemplateFilePath, armParametersFilePath)
  .then((armResponse) => {
    console.log(chalk.green(`Finished arm deployment: \n`))
    console.log(chalk.grey(JSON.stringify(armResponse, null, 2)))
    process.exit()
  })
  .catch((error) => {
    console.log(chalk.red('Error while deploying to Azure:'))
    console.log(chalk.red(`${error}`))
  })
