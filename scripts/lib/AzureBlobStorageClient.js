const azureStorage = require('azure-storage');

module.exports = class AzureBlobStorageClient {
  constructor(storageAccountName, storageAccountKey) {
    if (!storageAccountName) throw new Error('You must supply a "storageAccountName"');
    if (!storageAccountKey) throw new Error('You must supply a "storageAccountKey"');
    this.azureStorage = azureStorage;
    process.env.AZURE_STORAGE_ACCOUNT = storageAccountName;
    process.env.AZURE_STORAGE_ACCESS_KEY = storageAccountKey;
    const azureBlobService = this.getBlobService(storageAccountName, storageAccountKey);
    this.azureBlobService = azureBlobService;
  }

  createContainerIfNotExists(containerName) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.azureBlobService.createContainerIfNotExists(containerName, (error, result, response) => {
        if (error) {
          reject(error);
        }
        if (!response.isSuccessful) {
          reject(response);
        }
        resolve({ created: result.created, result, response });
      });
    });
  }
  createBlockBlobFromFile(filePath, containerName, blobName, options = {}) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.azureBlobService.createBlockBlobFromLocalFile(containerName, blobName, filePath, options,
      (error, result, response) => {
        if (error) {
          reject(error);
        } else if (!response.isSuccessful) {
          reject(response);
        } else {
          resolve(`${self.azureBlobService.host.primaryHost}${containerName}/${blobName}`);
        }
      });
    });
  }
  getBlobService(storageAccountName, storageAccountKey) {
    process.env.AZURE_STORAGE_ACCOUNT = storageAccountName;
    process.env.AZURE_STORAGE_ACCESS_KEY = storageAccountKey;
    return this.azureStorage.createBlobService();
  }
};