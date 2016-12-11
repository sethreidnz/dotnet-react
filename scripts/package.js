const chalk = require('chalk')
const path = require('path')
const program = require('commander')

const {
  azureUtilities: {
    uploadFolderAsPackage,
    parseAzureStorageCredentials,
    getMissingConfigValues
  },
  fileUtilities: {
    copyAndUpdateJson,
    copyFiles
  }
} = require('./lib')

program
  .option('-a, --storageAccountName <storageAccountName>', 'The name of Azure Storage Account to use')
  .option('-k, --storageAccountKey <storageAccountKey>', 'The access key for hte Azure Storage Account supplied')
  .option('-c, --storageContainerName <storageContainerName>', 'The storage container to deploy the MSDeploy package')
  .option('-a, --azureConfigFilePath <azureConfigFilePath>',
`A json file with the following format: 

${JSON.stringify({
  storageAccountName: '',
  storageAccountKey: '',
  storageContainerName: ''
}, null, 2)}

If supplied then the corresponding command line arguments are ignored
`
  )
  .option('-c, --packageDirectory <packageDirectory>', 'Defaults to "./release"')
  .option('-c, --outputDirectory <outputDirectory>', 'Defaults to "./deploy"')
  .option('-c, --sourceDirectoryPath <sourceDirectoryPath>', 'Defaults to "../"')
  .parse(process.argv)

let azureConfigCommandLineArgs = null
let azureConfigPath = null
if (!program.azureConfigFilePath) {
  azureConfigCommandLineArgs = {
    resourceGroupName: program.resourceGroupName,
    storageAccountName: program.storageAccountName,
    storageAccountKey: program.storageAccountKey,
    storageContainerName: program.storageContainerName
  }
  const missingArguments = getMissingConfigValues(azureConfigCommandLineArgs)
  azureConfigCommandLineArgs = !missingArguments
    ? azureConfigCommandLineArgs
    : null
} else {
  azureConfigPath = program.azureConfigFilePath
  ? program.azureConfigFilePath
  : path.join(sourceDirectoryPath, 'scripts/configuration/azure.config.json')
}

const sourceDirectoryPath = program.sourceDirectoryPath === undefined
  ? path.join(__dirname, '../')
  : program.sourceDirectoryPath

const outputDirectory = program.outputDirectory === undefined
  ? path.join(sourceDirectoryPath, 'deploy')
  : program.outputDirectory

const packageDirectory = program.packageDirectory === undefined
  ? path.join(sourceDirectoryPath, '/release')
  : program.packageDirectory

const armTemplateFilePath = path.join(sourceDirectoryPath, 'scripts/configuration/template.json')
const armParametersFilePath = path.join(sourceDirectoryPath, 'scripts/configuration/template-parameters.json')
let packageUri = null

console.log(chalk.blue('Beginning deployment with the following values:'))
console.log(chalk.blue(`outputDirectory: ${outputDirectory}`))
console.log(chalk.blue(`packageDirectory: ${packageDirectory}`))

console.log(chalk.blue(`Parsing Azure config input`))
parseAzureStorageCredentials(azureConfigCommandLineArgs, azureConfigPath).then((config) => {
  console.log(chalk.green(`Azure config input validated`))
  console.log(chalk.blue('Beginning uploading package to Azure Storage...'))
  return uploadFolderAsPackage(
      packageDirectory,
      outputDirectory,
      config.storageContainerName,
      config.storageAccountName,
      config.storageAccountKey
    )
})
  .then((uploadUri) => {
    if (!uploadUri) {
      throw new Error(`No uploadUri was returned from uploadFileToBlobStorage`)
    }
    packageUri = uploadUri
    console.log(chalk.green(`Finished uploading MSDeploy package to URI "${packageUri}"`))
    console.log(chalk.blue(`Updating paramaters file with package URI: '${armParametersFilePath}'`))
    return copyAndUpdateJson(armParametersFilePath, (templateParemeterJson) => {
      templateParemeterJson.parameters.packageUri.value = packageUri
    }, outputDirectory)
  })
  .then(() => {
    console.log(chalk.blue(`Finished updating paramaters file with package URI: '${armParametersFilePath}'`))
    console.log(chalk.green(`\n\n Finished uploading package to: '${packageUri}'`))
    return copyFiles([armTemplateFilePath], outputDirectory)
  })
  .then(() => {
    console.log(chalk.green(`\n\n Finished preparing deployment. Assets in folder: '${outputDirectory}'`))
    process.exit()
  })
  .catch((error) => {
    console.log(chalk.red('Error while deploying to Azure:'))
    console.log(chalk.red(`${error}`))
    process.exit()
  })
