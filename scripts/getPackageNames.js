const fs = require('fs')
const path = require('path')

exports.PACKAGES_SRC_DIR = './src/packages'
exports.PACKAGES_OUT_DIR = './lib/packages'

let names

exports.getPackageNames = () => {
  if (!names) {
    names = fs.readdirSync(exports.PACKAGES_SRC_DIR).filter(file => {
      try {
        const packageJsonPath = path.resolve(
          exports.PACKAGES_SRC_DIR,
          file,
          'package.json'
        )
        return fs.statSync(packageJsonPath).isFile()
      } catch (error) {
        return false
      }
    })
  }
  return names
}
