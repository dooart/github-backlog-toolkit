export default {
  getOwner: projectUrl => projectUrl.split('/')[0],
  getRepoName: projectUrl => {
    const split = projectUrl.split('/')
    if (split.length === 2) return null // org project eg. "org/123"
    return split[1] // repo project eg. "org/repo/123"
  },
  getNumber: projectUrl => {
    const split = projectUrl.split('/')
    if (split.length === 2) return parseInt(split[1]) // org project eg. "org/123"
    return parseInt(split[2]) // repo project eg. "org/repo/123"
  }
}
