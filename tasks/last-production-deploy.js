import moment from 'moment'
import repos from '../utils/repos'

export default async (octokit, config) => {
  const messages = []
  for (const repo of config.repos) {
    try {
      const repoInfo = {
        owner: repos.getOwner(repo),
        repo: repos.getRepoName(repo)
      }

      const refs = await octokit.git.listRefs({
        ...repoInfo,
        namespace: 'tags/'
      })

      const previous = refs.data[refs.data.length - 2].ref.substring(
        'refs/tags/'.length
      )
      const latest = refs.data[refs.data.length - 1].ref.substring(
        'refs/tags/'.length
      )
      const commits = (await octokit.repos.compareCommits({
        ...repoInfo,
        base: previous,
        head: latest
      })).data.commits
      const lastCommit = commits[commits.length - 1]
      const lastCommitInfo = await octokit.git.getCommit({
        ...repoInfo,
        commit_sha: lastCommit.sha
      })

      const date = moment(lastCommitInfo.data.committer.date).fromNow()
      messages.push(
        `The last deploy of ${repo} to production happened ${date}.`
      )
    } catch (e) {
      console.error(e)
      messages.push(`Error checking for last ${repo} deploy date.`)
    }
  }
  return messages
}
