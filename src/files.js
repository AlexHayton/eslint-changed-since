const cwd = require('cwd');
const ignore = require('ignore');
const fs = require('fs');
const util = require('util');
const flat = require('array.prototype.flat');

util.promisify(fs.access);
util.promisify(fs.readFile);
const appRoot = cwd();

async function readEslintIgnore() {
  try {
    const data = await fs.readFile(`${appRoot}/.eslintignore`);
    return data.split(/\n/);
  } catch (error) {
    return [];
  }
}

function filterIncludedFiles(extensionsToInclude, files) {
  const normalizedExtensions = extensionsToInclude.map(ext => ext.trim().toLowerCase());
  const includeFile = filename => {
    return normalizedExtensions.some(extension => {
      if (filename.toLowerCase().endsWith(extension)) {
        return true;
      }
      return false;
    });
  };
  return files.filter(includeFile);
}

async function filterExistingFiles(files) {
  const fileExists = async filename => {
    const exists = await fs.access(filename);
    return exists;
  };

  return files.filter(fileExists);
}

async function filterIgnoredFiles(files) {
  const ignoreFilesContents = await readEslintIgnore();
  const filesToIgnore = flat(ignoreFilesContents);
  const filteredFiles = ignore()
    .add(filesToIgnore)
    .filter(files);
  return filteredFiles;
}

module.exports = {
  filterExistingFiles,
  filterIncludedFiles,
  filterIgnoredFiles,
};
