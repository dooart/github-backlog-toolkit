import repos from '../utils/repos'

export default async (octokit, config) => {
  const messages = []
  for (const repo of config.repos) {
    try {
      const labels = repo.labels.map(label => `label:"${label}"`).join(' ')
      const result = await octokit.search.issuesAndPullRequests({
        q: `repo:${repo.repoUrl} type:pr is:open ${labels}`
      })

      if (result.data.total_count) {
        const foundLabels = result.data.items.reduce(
          (foundLabels, pr) => [
            ...foundLabels,
            ...pr.labels
              .filter(label => repo.labels.includes(label.name))
              .map(label => label.name)
          ],
          []
        )
        let message =
          repo.message ||
          'Found $number labeled prs ($labels) in $repo \n  $repoUrl'
        message = message.replace('$repo', repo.repoUrl)
        message = message.replace('$number', result.data.total_count)
        message = message.replace(
          '$labels',
          [...new Set(foundLabels)].join(' + ')
        )
        message = message.replace(
          '$repoUrl',
          `${repos.getGithubUrl(repo.repoUrl)}/pulls?q=is:pr+is:open`
        )
        messages.push(message)
      }
    } catch (e) {
      console.error(e)
      messages.push(`Error checking ${repo} for issues without project.`)
    }
  }
  return messages
}
