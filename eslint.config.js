import eslintPluginPrettier from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';


export default [
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
        },
        plugins: {
            prettier: eslintPluginPrettier,
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
			'no-console': 'warn',
            'no-unused-vars': 'off',
        },
    },
];
