import path from 'path';
import { exec } from 'shelljs';
import { getPackageNames, PACKAGES_SRC_DIR } from './getPackageNames.js';

const packageNames = getPackageNames();

packageNames.forEach(packageName => {
  const sourceDir = path.resolve(PACKAGES_SRC_DIR, packageName);
  exec(`cd ${sourceDir} && npm install`, { async: true });
});
