#!/usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const { listFilesChangedSince } = require('./git');
const { filterIgnoredFiles, filterExistingFiles, filterIncludedFiles } = require('./files');
const { runESLint } = require('./eslint');

function getESLintOptions() {
  const eslintOptionStart = process.argv.indexOf('--');
  if (eslintOptionStart === -1) {
    return [];
  }
  const eslintOptions = process.argv.slice(eslintOptionStart + 1);
  return eslintOptions;
}

async function run({ refName, ext }) {
  const eslintOptions = getESLintOptions();
  const files = await listFilesChangedSince(refName);
  const extensionsToInclude = ext.split(',');
  const includedFiles = filterIncludedFiles(extensionsToInclude, files);
  const existingFiles = await filterExistingFiles(includedFiles);
  const filteredFiles = await filterIgnoredFiles(existingFiles);
  console.log(chalk.green(`${filteredFiles.length} files changed since ${refName}`));
  if (filteredFiles.length > 0) {
    runESLint(eslintOptions, filteredFiles);
  }
}

// eslint-disable-next-line no-unused-expressions
yargs
  .scriptName('eslint-changed-since')
  .usage('$0 <cmd> [refName] [--ext .js,.ts] -- [..eslintOptions]')
  .command(
    '$0 [refName]',
    'Run eslint for files changed since a certain point',
    yargs => {
      yargs
        .positional('refName', {
          type: 'string',
          default: 'HEAD',
          describe: 'the ref to compare against',
        })
        .options({
          ext: {
            describe: 'extensions to include',
            default: '.js',
          },
        });
    },
    run,
  )
  .help().argv;
