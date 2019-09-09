import repos from '../utils/repos'

export default async (octokit, config) => {
  const messages = []
  for (const repo of config.repos) {
    try {
      const repoInfo = {
        owner: repos.getOwner(repo),
        repo: repos.getRepoName(repo)
      }

      const release = await octokit.repos.getLatestRelease({
        ...repoInfo
      })

      if (release.data.prerelease) {
        messages.push(`There is a release marked as prerelease in ${repo}.`)
      }
    } catch (e) {
      console.error(e)
      messages.push(`Error checking for unreleased releases in ${repo}.`)
    }
  }
  return messages
}
