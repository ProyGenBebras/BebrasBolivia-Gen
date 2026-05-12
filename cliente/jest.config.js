module.exports = {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [5101, 5107],
        },
      },
    ],
  },
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/pruebas'],
  testMatch: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
};
