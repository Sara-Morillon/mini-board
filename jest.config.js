const path = require('path')
require('dotenv').config({ path: path.join(__dirname, 'config', '.env.test') })

const common = {
  preset: 'ts-jest',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: { '@/(.*)': '<rootDir>/src/$1' },
}

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'dom',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
      testMatch: ['<rootDir>/tests/**/*.test.tsx'],
    },
    {
      ...common,
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
    },
  ],
}
