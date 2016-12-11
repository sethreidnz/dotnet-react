const git = require('git-rev')

const getGitCommitHash = () => new Promise((resolve, reject) => {
  git.long((str) => {
    if (!str) {
      reject('No git commit hash found')
    }
    resolve(str)
  })
})

module.exports = getGitCommitHash
