const ignore = require('ignore');
const appRoot = require('app-root-path');
const fs = require('fs');
const util = require('util');

util.promisify(fs.readFile);

async function readGitIgnore() {
  try {
    const data = await fs.readFile(`${appRoot}/.gitignore`);
    return data.split(/\n/);
  } catch (error) {
    return [];
  }
}

async function readEslintIgnore() {
  try {
    const data = await fs.readFile(`${appRoot}/.eslintignore`);
    return data.split(/\n/);
  } catch (error) {
    return [];
  }
}

function ignoreFiles(files) {
  const filesToIgnore = Promise.all(readGitIgnore, readEslintIgnore).flat();
}

module.exports = {
  ignoreFiles,
};
