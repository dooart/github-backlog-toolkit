import repos from '../utils/repos'

export default async (octokit, config) => {
  const messages = []
  for (const repo of config.repos) {
    try {
      const result = await octokit.search.issuesAndPullRequests({
        q: `repo:${repo} type:issue no:project is:open`
      })
      if (result.data.total_count) {
        messages.push(
          `There are ${
            result.data.total_count
          } issues without project in ${repo}:\n  ${repos.getGithubUrl(
            repo
          )}/issues?q=is:issue+is:open+no:project`
        )
      }
    } catch (e) {
      console.error(e)
      messages.push(`Error checking ${repo} for issues without project.`)
    }
  }
  return messages
}
