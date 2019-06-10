export default {
  getOwner: fullRepoName => fullRepoName.split('/')[0],
  getRepoName: fullRepoName => fullRepoName.split('/')[1],
  getGithubUrl: fullRepoName => `https://github.com/${fullRepoName}`
}
