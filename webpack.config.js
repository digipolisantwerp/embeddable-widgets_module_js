/* global __dirname, require, module */

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');

const libraryName = "auiEmbeddableWidgets";

let outputFile;
let mode;

if (env === 'build') {
  mode = 'production';
  outputFile = 'aui-embeddable-widgets.min.js';
} else {
  mode = 'development';
  outputFile = 'aui-embeddable-widgets.js';
}

const config = {
  mode,
  entry: `${__dirname  }/src/index.js`,
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 400000,
  },
};

module.exports = config;
