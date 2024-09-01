import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import eslintConfig from './.eslintrc.json' assert { type: 'json' };
import reactPlugin from 'eslint-plugin-react';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  recommendedConfig: {
    extends: ['eslint:recommended'],
  },
});

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      'import/no-anonymous-default-export': 'off',
      'no-unused-vars': 'off',
      'react/no-children-prop': 'off',
      'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'always' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
