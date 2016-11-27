// nodeX_modules
const program = require('commander');
const chalk = require('chalk');
const path = require('path');

// local dependencies
const { 
  validateParameters, 
  parseJsonFile, 
  fileExists,
  getArmTemplateParamters,
  getGitCommitHash
} = require('./lib/utility');
const AzureBlobStorageClient = require('./lib/AzureBlobStorageClient');

program
.option('-c, --packagePath <storageContainerName>', 'The storage container name')
.parse(process.argv);

validateParameters(program, [
  'packagePath'
]);

var armTemplateParametersFilePath = path.join(__dirname, '/parameters.json');
if(!fileExists(armTemplateParametersFilePath)) {
  console.log(chalk.red(`You must rename the file './scripts/paramters-example.js' and fill in the values.`));
}

validateStorageAccountParameters = (storageAccountName, storageAccountKey, containerName) => {
  if(!storageAccountName, storageAccountKey, containerName){
    console.log(chalk.red(`You need to provide all the parameters in your parameters.json file`));
    process.exit();
  }
}

deployPackageToAzureStorage = (armParameters) => {
  const packagePath = program.packagePath;
  const storageAccountName = armParameters.deploymentStorageAccountName.value;
  const storageAccountKey = armParameters.deploymentStorageAccountKey.value;
  const storageContainerName = armParameters.deploymentStorageAccountContainer.value;
  const azureBlobStorageClient = new AzureBlobStorageClient(storageAccountName, storageAccountKey);
  return azureBlobStorageClient.createBlockBlobFromFile(packagePath, storageContainerName, 'release.zip')
}

getArmTemplateParamters(path.join(__dirname, '/parameters.json'))
.then((armParameters) => {
  return deployPackageToAzureStorage(armParameters);
})
.then(() => {
  console.log(chalk.green(`Succsessfully deployed package "${packagePath}"`));
})
.catch((error) => {
  console.log(chalk.red(`Failed to zip folder "${packagePath}": /n/n ${error}`));
});




// console.log(`storageAccountName: ${storageAccountName}`);
// console.log(`storageAccountKey: ${storageAccountKey.replace(/./g, '*')}`);
// console.log(`storageContainerName: ${containerName}`);
// console.log(`packagePath: ${packagePath}`);

// const azureBlobStorageClient = new AzureBlobStorageClient(storageAccountName, storageAccountKey);

// zipDirectory(directory, output)
// .then(() => {
//   console.log(chalk.green(`Succsessfully deployed package "${packagePath}"`));
// })
// .catch((error) => {
//   console.log(chalk.red(`Failed to zip folder "${packagePath}": /n/n ${error}`));
// });