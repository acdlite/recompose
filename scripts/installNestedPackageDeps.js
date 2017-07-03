const path = require('path')
const { exec } = require('shelljs')
const { getPackageNames, PACKAGES_SRC_DIR } = require('./getPackageNames.js')

const packageNames = getPackageNames()

packageNames.forEach(packageName => {
  const sourceDir = path.resolve(PACKAGES_SRC_DIR, packageName)
  exec(`cd ${sourceDir} && yarn`, { async: true })
})
