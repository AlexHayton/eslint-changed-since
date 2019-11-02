const NodeGit = require('nodegit');

NodeGit.Repository.open(pathToRepo).then(function(repo) {
  // Inside of this function we have an open repo
});
