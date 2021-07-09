// eslint-disable-next-line strict, lines-around-directive
'use strict';

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    {
      value: 'perf',
      name: 'perf:     A code change that improves performance',
    },
    {
      value: 'chore',
      name: "chore:    Other changes that don't modify src or test files",
    },
    { value: 'revert', name: 'revert:   Reverts a previous commit' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    {
      value: 'style',
      name: 'style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'test',
      name: 'test:     Adding missing tests or correcting existing ones',
    },
    {
      value: 'build',
      name: 'build:    Changes that affect the build system or external dependencies (example scopes: gulp, webpack, npm)',
    },
    {
      value: 'ci',
      name: 'ci:       Changes to our CI configuration files and scripts (example scopes: Travis, Jenkins, BrowserStack, SauceLabs)',
    },
    { value: 'wip', name: 'wip:      Work in progress' },
  ],
  scopes: [
    { name: 'blocks' },
    { name: 'boot' },
    { name: 'config' },
    { name: 'errors' },
    { name: 'address-service' },
    { name: 'identity' },
    { name: 'member-service' },
    { name: 'promise-queue' },
    { name: 'rest-api-service' },
    { name: 'google-analytics' },
    { name: 'transitions' },
    { name: 'utils' },
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'perf', 'chore'],
};
