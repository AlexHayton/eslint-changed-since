const cwd = require('cwd');
const ignore = require('ignore');
const fs = require('fs');
const util = require('util');
const Promise = require('bluebird');
const flat = require('array.prototype.flat');

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

// Some files are in the git diff but no longer exist. Filter these out.
async function filterExistingFiles(files) {
  const fileExists = filename => {
    return new Promise(resolve => {
      fs.access(filename, fs.constants.R_OK, err => {
        resolve(err ? undefined : filename);
      });
    });
  };

  const filesAccessed = await Promise.map(files, fileExists);
  return filesAccessed.filter(file => file);
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
