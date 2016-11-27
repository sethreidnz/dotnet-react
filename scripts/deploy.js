// nodeX_modules
const git = require('git-rev');
const program = require('commander');
const chalk = require('chalk');

// local dependencies
const validateParameters = require('./lib/validateParameters');
const AzureBlobStorageClient = require('./lib/AzureBlobStorageClient');

program
.option('-a, --storageAccountName <storageAccountName>', 'The storage account to use')
.option('-k, --storageAccountKey <storageAccountKey>', 'The storage account access key to use')
.option('-c, --storageContainerName <storageContainerName>', 'The storage container name')
.parse(process.argv);

validateParameters(program, [
  'storageAccountName', 
  'storageAccountKey', 
  'storageContainerName'
]);

const storageAccountName = program.storageAccountName;
const storageAccountKey = program.storageAccountKey;
const containerName = program.storageContainerName;

console.log(`storageAccountName: ${storageAccountName}`);
console.log(`storageAccountKey: ${storageAccountKey.replace(/./g, '*')}`);
console.log(`storageContainerName: ${containerName}`);



