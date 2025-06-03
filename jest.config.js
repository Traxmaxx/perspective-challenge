/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTestEnv.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/src/'],
    transformIgnorePatterns: ['node_modules'],
    transform: {
        '^.+\\.test.(t|j)sx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: './tsconfig.test.json',
                isolatedModules: true,
            },
        ],
    },
};
