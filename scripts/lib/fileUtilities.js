const fsp = require('fs-promise')
const path = require('path')
const rimrafPromise = require('rimraf-promise')

const readJsonFile = (filePath) => {
  return fsp.readFile(filePath, { encoding:'utf8' })
}

const writeJsonToFile = (ouputFilePath, json) => {
  return fsp.writeFile(ouputFilePath, json)
}

const copyAndUpdateJson = (jsonFilePath, jsonUpdater, outputPath = null) => {
  return readJsonFile(jsonFilePath)
    .then((json) => {
      const parsedJson = JSON.parse(json)
      jsonUpdater(parsedJson)
      if (outputPath) {
        jsonFilePath = path.join(outputPath, path.basename(jsonFilePath))
      }
      const jsonString = JSON.stringify(parsedJson, null, 2)
      return writeJsonToFile(jsonFilePath, jsonString)
    })
}

const copyFile = (filePath, destinationFolderPath) => {
  const destinationFilePath = path.join(destinationFolderPath, path.basename(filePath))
  return fsp.copy(filePath, destinationFilePath)
}

const copyFiles = (filePaths, destinationFolderPath) => {
  const promises = []
  for (const filePath of filePaths) {
    promises.push(copyFile(filePath, destinationFolderPath))
  }
  return Promise.all(promises)
}

const ensureDirectory = (directory) => {
  return rimrafPromise(directory)
}

const ensureDirectories = (directories) => {
  const promises = []
  for (const directory of directories) {
    promises.push(cleanDirectory(directory))
  }
  return Promise.all(promises)
}

const cleanDirectory = (directory) => {
  return fsp.emptydir(directory)
}

const cleanDirectories = (directories) => {
  const promises = []
  for (const directory of directories) {
    promises.push(cleanDirectory(directory))
  }
  return Promise.all(promises)
}

module.exports = {
  readJsonFile,
  writeJsonToFile,
  copyAndUpdateJson,
  cleanDirectory,
  cleanDirectories,
  ensureDirectory,
  ensureDirectories,
  copyFile,
  copyFiles
}
