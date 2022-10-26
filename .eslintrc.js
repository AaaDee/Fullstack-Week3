module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'browser': true,
    'jest': true
  },
  'extends': [
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:cypress/recommended'],
  'parserOptions': {
    'ecmaVersion': 2020,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'react/prop-types': 'off'
  }
}
