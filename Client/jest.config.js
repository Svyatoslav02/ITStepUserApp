module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'services/savedPlacesStorage.js',
    'services/cityService.js',
    'services/usePlace.js',
    'utils/placeActions.js',
    'utils/dayPlanDistance.js',
    'pages/components/StateViews.js',
  ],
  coverageReporters: ['text', 'lcov'],
};
