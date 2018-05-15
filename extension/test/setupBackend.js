const path = require('path')
const fs = require('fs')

const errorCallback = function (err) {
  if (err) {
    return true
  }
}

const integrationTestCredentialFile = path.dirname(__dirname) + '/.integration-credentials.js'
fs.writeFile(integrationTestCredentialFile, 'module.exports = {\n' +
  '  clientId: \'***\',\n' +
  '  accessToken: \'***\',\n' +
  '  storeHash: \'***\'\n' +
  '}', {flag: 'wx'}, errorCallback)

const chai = require('chai')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()
