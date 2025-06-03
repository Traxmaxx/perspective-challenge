import tseslint from 'typescript-eslint';

export default tseslint.config(
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    },
    {
        ignores: [`node_modules/**`, `coverage/**`],
    },
);
