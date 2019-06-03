const tasksIds = [
  'issues-without-project',
  'last-production-deploy',
  'labeled-issues-in-projects'
]
const tasks = tasksIds.reduce((tasks, taskId) => {
  tasks[taskId] = require(`./${taskId}`).default
  return tasks
}, {})

export default tasks
