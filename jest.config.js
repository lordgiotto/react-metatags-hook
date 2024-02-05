module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: '<rootDir>/jest.env.config.js',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
