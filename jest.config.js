module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};
