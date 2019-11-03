const appRoot = require('app-root-path');
const { spawn } = require('child_process');
const chalk = require('chalk');

async function runESLint(options, files) {
  const eslint = spawn(`${appRoot}/node_modules/.bin/eslint`, [...options, ...files], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  eslint.on('error', error => {
    console.error(chalk.red('Failed to start child process.'), error);
  });
}

module.exports = {
  runESLint,
};
