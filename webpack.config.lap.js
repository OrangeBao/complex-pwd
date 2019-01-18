const path = require('path');

module.exports = {
  entry: './index.js',
  devtool: 'inline-source-map',
  mode: 'production',
  output: {
    filename: 'complex-pwd.js',
    path: path.resolve(__dirname, '../src/plugins')
  }
};