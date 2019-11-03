#!/usr/bin/env node
const yargs = require('yargs');
const { listFilesChangedSince } = require('./git');
const { runESLint } = require('./eslint');
const chalk = require('chalk');

async function run({ refName, eslintOptions = [] }) {
  const files = await listFilesChangedSince(refName);
  console.log(chalk.green(`${files.length} files changed since ${refName}`));
  runESLint(eslintOptions, files);
}

// eslint-disable-next-line no-unused-expressions
yargs
  .scriptName('eslint-changed-since')
  .usage('$0 <cmd> [refName]')
  .command(
    '$0 [refName] [..eslintOptions]',
    'Run eslint for files changed since a certain point',
    yargs => {
      yargs
        .positional('refName', {
          type: 'string',
          default: 'HEAD',
          describe: 'the ref to compare against',
        })
        .positional('eslintOptions', {
          describe: 'options for ESLint',
        });
    },
    run,
  )
  .help().argv;
