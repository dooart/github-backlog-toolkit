import Octokit from '@octokit/rest'
import tasks from './tasks'

export default async config => {
  const octokit = new Octokit({
    auth: config.githubToken || process.env.GITHUB_TOKEN,
    userAgent: 'github-backlog-toolkit 0.0.1'
  })

  let allMessages = []
  for (const task in config.tasks) {
    const messages = await tasks[task](octokit, config.tasks[task])
    allMessages = [...allMessages, ...messages]
  }
  return allMessages
}
