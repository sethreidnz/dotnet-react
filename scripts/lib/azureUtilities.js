const scripty = require('azure-scripty')
const path = require('path')

const AzureBlobStorageClient = require('./azureBlobStorageClient')
const { readJsonFile } = require('./fileUtilities')
const pack = require('./pack')

const envokeAzureCommand = (
  azureCommand,
  args
) => {
  const command = {
    command: azureCommand,
    positional: args
  }
  return new Promise((resolve, reject) => {
    scripty.invoke(command, (err, results) => {
      if (err) {
        reject(err)
      }
      resolve(results)
    })
  })
}

const uploadFileToBlobStorage = (
  packagePath,
  packageName,
  storageContainerName,
  storageAccountName,
  storageAccountKey
) => {
  const azureBlobStorageClient = new AzureBlobStorageClient(storageAccountName, storageAccountKey)
  return azureBlobStorageClient.createBlockBlobFromFile(
    packagePath,
    packageName,
    storageContainerName
  )
}

const uploadFolderAsPackage = (
  packageDirectory,
  outputDirectory,
  storageContainerName,
  storageAccountName,
  storageAccountKey
) => {
  const azureBlobStorageClient = new AzureBlobStorageClient(storageAccountName, storageAccountKey)
  return pack(packageDirectory, outputDirectory).then((packagePath) => {
    return azureBlobStorageClient.createBlockBlobFromFile(
      packagePath,
      path.basename(packagePath),
      storageContainerName
    )
  })
}

const changeToArmMode = () => {
  return envokeAzureCommand('config', ['mode', 'arm'])
}

const runArmDeployment = (
  resourceGroupName,
  deploymentName,
  templatePath,
  parameters
) => {
  return changeToArmMode()
    .then(() => {
      const parametersArgs = typeof parameters === 'string'
        ? ['--parameters-file', parameters]
        : ['--parameters', parameters]
      const deploymentNameArgs = deploymentName ? ['--name', deploymentName] : []
      return envokeAzureCommand('group', [
        'deployment',
        'create',
        '--template-file', templatePath,
        ...parametersArgs,
        '--resource-group', resourceGroupName,
        ...deploymentNameArgs
      ])
    })
}

const getMissingAzureStorageConfigValues = (azureConfig) => {
  const requiredParameters = [
    'storageAccountName',
    'storageAccountKey',
    'storageContainerName'
  ]
  return getMissingConfigValues(azureConfig, requiredParameters)
}

const getMissingAzureAdConfigValues = (azureConfig) => {
  const requiredParameters = [
    'azureAdTenant',
    'azureAdClientId',
    'azureAdAadInstance',
    'azureAdPostLogoutRedirectUri'
  ]
  return getMissingConfigValues(azureConfig, requiredParameters)
}

const getMissingConfigValues = (config, requiredParameters) => {
  const missingParameters = requiredParameters.filter((parameter) => {
    return config && !config[parameter]
  })
  return missingParameters.length ? missingParameters : false
}

const parseAzureStorageCredentials = (commandLineConfig = null, azureConfigPath = null) => {
  return new Promise((resolve, reject) => {
    if (azureConfigPath) {
      readJsonFile(azureConfigPath).then((configJson) => {
        const config = JSON.parse(configJson)
        const missingConfigValues = getMissingAzureStorageConfigValues(config)
        if (missingConfigValues) {
          reject(`You have missing config file values: \n${JSON.stringify(missingConfigValues.join(','))}`)
        }
        resolve(config)
      })
    } else if (commandLineConfig) {
      let missingConfigValues = getMissingAzureStorageConfigValues(commandLineConfig)
      if (missingConfigValues) {
        missingConfigValues = missingConfigValues.map((configValue) => {
          return `--${configValue}`
        })
        reject(`You have missing command line arguments values: \n${JSON.stringify(missingConfigValues.join(','))}`)
      }
      resolve(commandLineConfig)
    } else {
      const missingConfigValues = getMissingAzureStorageConfigValues(commandLineConfig).map((configValue) => {
        return `--${configValue}`
      })
      reject(`
You have need to either provide the command line argument --azureConfigFilePath or 
provide the command line arguments: \n${JSON.stringify(missingConfigValues.join(','))}
`)
    }
  })
}

module.exports = {
  uploadFileToBlobStorage,
  uploadFolderAsPackage,
  runArmDeployment,
  changeToArmMode,
  parseAzureStorageCredentials,
  getMissingConfigValues,
  getMissingAzureStorageConfigValues,
  getMissingAzureAdConfigValues
}
