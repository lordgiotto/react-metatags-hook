module.exports = {
  '**/*.(t|j)s': 'eslint',
  '*': 'prettier -u --check',
  '**/*': () => 'yarn check:ts',
};
