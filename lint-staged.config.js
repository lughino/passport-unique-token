module.exports = {
  'src/**/*.(ts|tsx)': ['prettier --write', 'npm run lint', 'npm t -- --findRelatedTests'],
};
