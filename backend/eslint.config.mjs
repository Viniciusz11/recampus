import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'prisma/generated/**'],
  },
  js.configs.recommended,
  {
    // Arquivos de config na raiz (este próprio eslint.config.mjs) rodam em
    // Node fora do projeto TS, então só precisam do global `process`/etc.
    files: ['*.mjs', '*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // Lint com type-checking completo nos arquivos cobertos pelo
    // tsconfig.json (src/, prisma/, prisma.config.ts). Configs .js/.mjs na
    // raiz (este próprio arquivo, por exemplo) usam só as regras acima.
    files: ['src/**/*.ts', 'prisma/**/*.ts', 'prisma.config.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
);
