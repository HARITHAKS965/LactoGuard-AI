module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  maxWorkers: 1
};
