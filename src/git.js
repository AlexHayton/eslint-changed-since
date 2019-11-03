const { Repository, Diff } = require('nodegit');

const gitPromise = Repository.open('./');

async function getTreeForRef(refName) {
  const repo = await gitPromise;
  // const reference = await repo.getReference(refName);
  const commit = await repo.getBranchCommit(refName);
  const tree = await commit.getTree();
  return tree;
}

async function listFilesChangedSince(refName) {
  const repo = await gitPromise;
  const tree = await getTreeForRef(refName);
  const diff = await Diff.treeToWorkdirWithIndex(repo, tree, {
    flags: Diff.OPTION.INCLUDE_UNTRACKED,
  });
  const patches = await diff.patches();
  const files = patches.map(patch => patch.newFile().path());
  return files;
}

module.exports = {
  listFilesChangedSince,
};
