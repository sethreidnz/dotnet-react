const zipdir = require('zip-dir')

const zip = (releaseDirectory, publishFilePath) => {
  return new Promise((resolve, reject) => {
    zipdir(releaseDirectory, { saveTo: publishFilePath }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(publishFilePath)
      }
    })
  })
}

module.exports = zip
