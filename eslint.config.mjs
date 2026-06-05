import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      // 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // 'react/react-in-jsx-scope': 'off',
      // 'semi': ['error', 'always', { 'omitLastInOneLineBlock': false }],
      // 'quotes': ['error', 'single'],
      // 'react/prop-types': 'off',
      'react/no-unknown-property': ['error', {
        ignore: [
          'xmlns',
          'viewBox',
          'preserveAspectRatio',
          'xlink:href'
        ]
      }],
    },
  }
]);

export default eslintConfig;
