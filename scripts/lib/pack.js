const path = require('path')
const getGitCommitHash = require('./getGitHash')
const zip = require('./zip')

const pack = (pathToPack, outputDirectory) => {
  return getGitCommitHash()
  .then((hash) => {
    const packageName = `package-${hash}.zip`
    const outputFilePath = path.join(outputDirectory, packageName)
    return zip(pathToPack, outputFilePath)
  })
}

module.exports = pack
