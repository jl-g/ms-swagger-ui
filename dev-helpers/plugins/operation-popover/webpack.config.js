const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'popover-plugin': [
      './src/index.js'
    ]
  },
  output: {
    filename: 'popover-plugin.min.js',
    library: 'PopoverPlugin',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  externals: (ctx, req, next) => {
    next(null, false)
  },
  module: {
    rules: [{
      test: /\.js/,
      loader: 'babel-loader',
      exclude: [
        /node_modules/
      ]
    }]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })]
}
