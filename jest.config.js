const { TextEncoder } = require('util');

module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: '<rootDir>/jest.env.config.js',
  globals: { TextEncoder: TextEncoder },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
