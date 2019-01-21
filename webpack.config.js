const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'production',
  output: {
    filename: 'complex-pwd.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'complexPasswordCheck',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};