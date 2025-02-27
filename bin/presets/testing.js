export const testing = {
  'frontend-testing': {
    name: 'Frontend Testing Stack',
    packages: [
      'jest',
      '@testing-library/react',
      '@testing-library/jest-dom',
      'cypress',
      'playwright',
      'vitest',
      'storybook',
      '@storybook/react',
    ],
  },
  'backend-testing': {
    name: 'Backend Testing Stack',
    packages: ['mocha', 'chai', 'sinon', 'supertest', 'testcontainers', 'faker', 'istanbul'],
  },
};
