require('@babel/register')({
  extends: './.babelrc'
})

module.exports = require('./console.js')
