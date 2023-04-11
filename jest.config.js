module.exports = {
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!<rootDir>/node_modules/',
    '!<rootDir>/dist/',
  ],
  coverageDirectory: './coverage',
};
