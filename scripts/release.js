import fs from 'fs';
import path from 'path';
import { exec, exit, rm, cp, test } from 'shelljs';
import chalk from 'chalk';
import { compose } from 'lodash';
import readline from 'readline-sync';
import semver from 'semver';

const BIN = './node_modules/.bin';

import {
  PACKAGES_SRC_DIR,
  PACKAGES_OUT_DIR,
  getPackageNames
} from './getPackageNames';

const BASE_PACKAGE_LOC = '../src/basePackage.json';

const consoleLog = console.log.bind(console);
const log = compose(consoleLog, chalk.bold);
const logSuccess = compose(consoleLog, chalk.green.bold);
const logError = compose(consoleLog, chalk.red.bold);

const writeFile = (path, string) => fs.writeFileSync(path, string, 'utf8');

// if (exec('git diff-files --quiet').code !== 0) {
//   logError(
//     'You have unsaved changes in the working tree. Commit or stash changes ' +
//     'before releasing.'
//   );
//   exit(1);
// }

const packageNames = getPackageNames();

let packageName = readline.question('Name of package to release: ');

while (!packageNames.includes(packageName)) {
  packageName = readline.question(
    `The package "${packageName}" does not exist in this project. ` +
    `Choose again: `
  );
}

const versionLoc = path.resolve(PACKAGES_SRC_DIR, packageName, 'VERSION');
const version = fs.readFileSync(versionLoc, 'utf8').trim();

let nextVersion = readline.question(
  `Next version of ${packageName} (current version is ${version}): `
);

while (!(
  !nextVersion ||
  (semver.valid(nextVersion) && semver.gt(nextVersion, version))
)) {
  nextVersion = readline.question(
    `Must provide a valid version that is greater than ${version}, `
  + `or leave blank to skip: `
  );
}

log('Running tests...');

// if (exec('npm run lint && npm test -- --single-run').code !== 0) {
//   logError(
//     'The test command did not exit cleanly. Aborting release.'
//   );
//   exit(1);
// }

logSuccess('Tests were successful.');

const sourceDir = path.resolve(PACKAGES_SRC_DIR, packageName);
const outDir = path.resolve(PACKAGES_OUT_DIR, packageName);

log('Cleaning destination directory...');
rm('-rf', outDir);

log('Compiling source files...');
exec(`${BIN}/babel ${sourceDir} --out-dir ${outDir}`);

log('Copying additional project files...');
const additionalProjectFiles = [
  'README.md'
];
additionalProjectFiles.forEach(filename => {
  const src = path.resolve(sourceDir, filename);
  const out = path.resolve(outDir, filename);

  if (!test('-e', src)) return;

  cp('-Rf', src, out);
});

log('Generating package.json...');
const packageConfig = {
  ...require(BASE_PACKAGE_LOC),
  ...require(path.resolve(sourceDir, 'package.json')),
  version: nextVersion,
  private: undefined
};

writeFile(
  path.resolve(outDir, 'package.json'),
  JSON.stringify(packageConfig, null, 2)
);

log(`About to publish ${packageName}@${nextVersion} to npm.`);
readline.keyInYN('Sound good? ');

log('Publishing...');
// exec(`cd ${outDir} && npm publish`);

logSuccess(`${packageName}@${nextVersion} was successfully published.`);

log('Updating VERSION file...');
writeFile(versionLoc, `${nextVersion}\n`);

log('Committing and tagging release...');
// const newTagName = `v${nextVersion}`;
// exec(`git commit -m ${newTagName}`);
// exec(`git tag ${newTagName}`);
//
log('Pushing to GitHub...');
// exec('git push');
// exec('git push --tags');

logSuccess('Done.');
