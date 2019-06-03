import fs from 'fs'
import taskRunner from './task-runner'

const run = async () => {
  try {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
    const messages = await taskRunner(config)
    messages.forEach(message => console.log(message))
  } catch (e) {
    console.error(e)
  }
}

run()
