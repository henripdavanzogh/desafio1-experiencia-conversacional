module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:jsx-a11y/recommended',
      'prettier',
    ],
    plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
    rules: {},
    settings: {
      react: {
        version: 'detect',
      },
    },
  };