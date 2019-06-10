require('@babel/register')({
  extends: './.babelrc'
})

module.exports = require('./task-runner.js')
