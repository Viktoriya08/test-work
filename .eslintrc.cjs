module.exports = {
  extends: `htmlacademy/es6`,
  rules: {
    'no-console': 1,
    'no-unused-vars': 'warn',
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
    'space-before-function-paren': ['error', 'never'],
    'semi': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'never']
  },
  root: true,
  globals: {
    Swiper: `readonly`
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: `module`
  },
  env: {
    es6: true,
    browser: true,
    commonjs: true
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: [
        '@typescript-eslint',
      ],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-useless-empty-export': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn'
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: process.env.NODE_ENV === 'console' ? ['./tsconfig.json'] : ['./local/html/tsconfig.json'],
      },
    },
  ],
}
