import projects from '../utils/projects'

const findProject = async (octokit, projectUrl) => {
  const repo = projects.getRepoName(projectUrl)
  let result
  if (repo) {
    result = await octokit.projects.listForRepo({
      owner: projects.getOwner(projectUrl),
      repo
    })
  } else {
    result = await octokit.projects.listForOrg({
      org: projects.getOwner(projectUrl)
    })
  }

  return result.data.filter(project => {
    return project.number === projects.getNumber(projectUrl)
  })[0]
}

const findColumns = async (octokit, project, columns) => {
  const { data } = await octokit.projects.listColumns({
    project_id: project.id
  })
  return data.filter(column => columns.includes(column.name))
}

const findCards = async (octokit, columns) => {
  let allCards = []
  for (const column of columns) {
    const { data } = await octokit.projects.listCards({
      column_id: column.id,
      archived_state: 'not_archived'
    })
    allCards = [...allCards, ...data.filter(card => !card.note)]
  }
  return allCards
}

const findIssues = async (octokit, cards, projectUrl) => {
  const { data } = await octokit.search.issuesAndPullRequests({
    q: `project:${projectUrl} type:issue is:open`
  })
  const issueIds = cards
    .filter(card => !!card.content_url)
    .map(card => {
      const split = card.content_url.split('/')
      return parseInt(split[split.length - 1])
    })
  return data.items.filter(issue => issueIds.includes(issue.number))
}

export default async (octokit, config) => {
  const messages = []

  for (const projectConfig of config.projects) {
    try {
      const project = await findProject(octokit, projectConfig.projectUrl)
      const columns = await findColumns(octokit, project, projectConfig.columns)
      const cards = await findCards(octokit, columns)
      const issues = await findIssues(octokit, cards, projectConfig.projectUrl)

      const labeledIssues = issues.filter(issue =>
        issue.labels.some(label => projectConfig.labels.includes(label.name))
      )
      if (labeledIssues.length) {
        const labels = labeledIssues.reduce(
          (labels, issue) => [
            ...labels,
            ...issue.labels
              .filter(label => projectConfig.labels.includes(label.name))
              .map(label => label.name)
          ],
          []
        )
        let message =
          projectConfig.message ||
          `Found $number labeled issues in ${
            projectConfig.projectUrl
          } ($labels)`
        message = message.replace('$number', [...new Set(labeledIssues)].length)
        message = message.replace('$labels', [...new Set(labels)].join(', '))
        messages.push(message)
      }
    } catch (e) {
      console.error(e)
      messages.push(
        `Error checking labeled issues in project ${projectConfig.projectUrl}.`
      )
    }
  }

  return messages
}
