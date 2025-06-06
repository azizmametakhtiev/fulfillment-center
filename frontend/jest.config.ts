export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/src/tests/**/*.test.tsx', '**/src/tests/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.test.json',
    }],
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!redux-persist)/',
  ],
  moduleNameMapper: {
    '^@/constants(\\.ts)?$': '<rootDir>/src/__mocks__/constants.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/tests/**/*',
    '!src/components/ui/*.{ts,tsx}',
    '!src/features/tasks/**/*.{ts,tsx}',
    '!src/features/stocks/**/*.{ts,tsx}',
    '!src/features/reports/**/*.{ts,tsx}',
    '!src/features/counterparties/**/*.{ts,tsx}',
    '!src/features/users/containers/*.{ts,tsx}',
    '!src/features/users/hooks/*.{ts,tsx}',
    '!src/features/services/containers/*.{ts,tsx}',
    '!src/features/services/hooks/*.{ts,tsx}',
    '!src/features/products/containers/*.{ts,tsx}',
    '!src/features/products/hooks/*.{ts,tsx}',
    '!src/features/products/utils/*.{ts,tsx}',
    '!src/features/services/components/ServiceDetails.tsx',
    '!src/features/services/components/ServiceForm.tsx',
    '!src/features/users/components/RegistrationForm.tsx',
    '!src/features/products/components/ProductDetails.tsx',
    '!src/features/orders/hooks/*.{ts,tsx}',
    '!src/features/orders/utils/orderTypes.ts',
    '!src/features/orders/containers/*.{ts,tsx}',
    '!src/features/invoices/**/*.{ts,tsx}',
    '!src/features/clients/hooks/*.{ts,tsx}',
    '!src/features/clients/containers/*.{ts,tsx}',
    '!src/features/arrivals/**/*.{ts,tsx}',
    '!src/layout/Layout.tsx',
    '!src/hoc/ErrorBoundary.tsx',
    '!src/features/orders/components/OrderForm.tsx',
    '!src/features/orders/components/OrdersDataList.tsx',
    '!src/features/clients/components/ClientDetails.tsx',
    '!src/features/clients/components/ClientsDataList.tsx',
    '!src/components/Tables/*.{ts,tsx}',
    '!src/App.tsx',
    '!src/constants.ts',
    '!src/messages.ts',
    '!src/app/store.ts',
    '!src/components/DataTable/**/*.{ts,tsx}',
    '!src/store/slices/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}

