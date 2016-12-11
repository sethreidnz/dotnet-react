const azureStorage = require('azure-storage')

class AzureBlobStorageClient {
  constructor (storageAccountName = null, storageAccountKey = null) {
    if (!storageAccountName) {
      throw new Error('You must supply a environment variable "AZURE_STORAGE_ACCOUNT" or the "storageAccountName"')
    }
    if (!storageAccountKey) {
      throw new Error('You must supply a "AZURE_STORAGE_ACCESS_KEY" or the "storageAccountKey"')
    }
    this.azureBlobService = this.getBlobService(storageAccountName, storageAccountKey)
  }
  createContainerIfNotExists (containerName) {
    const self = this
    return new Promise((resolve, reject) => {
      self.azureBlobService.createContainerIfNotExists(containerName, (error, result, response) => {
        if (error) {
          reject(error)
        }
        if (!response.isSuccessful) {
          reject(response)
        }
        resolve({ created: result.created, result, response })
      })
    })
  }
  createBlockBlobFromFile (filePath, blobName, containerName, options = {}) {
    const self = this
    return new Promise((resolve, reject) => {
      self.azureBlobService.createBlockBlobFromLocalFile(containerName, blobName, filePath, options,
      (error, result, response) => {
        if (error) {
          console.error(`${error} ${response}`)
          reject(error)
        } else if (!response.isSuccessful) {
          console.error(`${error} ${response}`)
          reject(response)
        } else {
          const blobUri = `${self.azureBlobService.host.primaryHost}${containerName}/${blobName}`
          resolve(blobUri)
        }
      })
    })
  }
  getBlobService (storageAccountName, storageAccountKey) {
    process.env.AZURE_STORAGE_ACCOUNT = storageAccountName
    process.env.AZURE_STORAGE_ACCESS_KEY = storageAccountKey
    return azureStorage.createBlobService()
  }
}

module.exports = AzureBlobStorageClient
