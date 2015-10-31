import { exec } from 'shelljs';
import fs from 'fs';
import path from 'path';
import readline from 'readline-sync';
import { map, filter, forEach, flow } from 'lodash-fp';
import semver from 'semver';

import basePackage from '../src/basePackage.json';

const PACKAGES_SRC_DIR = './src/packages';
const PACKAGES_OUT_DIR = './lib/packages';

const BIN = './node_modules/.bin';

const getDirectories = srcPath => (
  fs.readdirSync(srcPath).filter(
    file => fs.statSync(path.resolve(srcPath, file)).isDirectory()
  )
);

const getPackageInfo = packageName => (
  require(path.resolve(PACKAGES_SRC_DIR, packageName, 'package.json'))
);

const getNextVersion = (packageName, previousVersion) => {
  let nextVersion = readline.question(
    `Next version of ${packageName} (current version is ${previousVersion}): `
  );

  while (!(
    !nextVersion ||
    (semver.valid(nextVersion) && semver.gt(nextVersion, previousVersion))
  )) {
    nextVersion = readline.question(
      `Must provide a valid version that is greater than ${previousVersion}, `
    + `or leave blank to skip: `
    );
  }

  return nextVersion;
};

const buildPackage = info => {
  const sourceDir = path.resolve(PACKAGES_SRC_DIR, info.name);
  const outDir = path.resolve(PACKAGES_OUT_DIR);
  exec(`${BIN}/babel ${sourceDir} --out-dir ${outDir}/${info.name}`);
};

const buildPackageJson = info => {
  const json = {
    ...basePackage,
    ...info,
    version: info.nextVersion
  };

  delete json.private;
  delete json.nextVersion;

  fs.writeFileSync(
    path.resolve(PACKAGES_OUT_DIR, json.name, 'package.json'),
    JSON.stringify(json, null, 2),
    'utf8'
  );
};

const releasePackage = info => {
  const nextRef = `v${info.nextVersion}`;
  console.log(`${info.name}@${info.nextVersion}`);
};

// Run tests
// exec('npm test -- --single-run');

// Get package names
const packageNames = getDirectories('./src/packages');

// Get package info
console.log('Specify the next version of each package. Leave blank to skip release.');
const packageInfo = flow(
  map(name => {
    const info = getPackageInfo(name);

    return {
      ...info,

      // Prompt user to specify new versions for each package
      nextVersion: getNextVersion(info.name, info.version)
    };
  }),
  filter(info => info.nextVersion)
)(packageNames);

forEach(info => {
  buildPackage(info);
  buildPackageJson(info);
  releasePackage(info);
}, packageInfo);
