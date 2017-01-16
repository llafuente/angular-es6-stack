// NOTE force environment
process.env.NODE_ENV = 'test';

const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.config.js');
webpackConfig.watch = true;

module.exports = function(config) {
  config.set({
    browsers: [
      process.env.BROWSER || 'PhantomJS'
    ],
    files: [
      './test/spec/tests.webpack.js'
    ],
    frameworks: ['jasmine'],
    preprocessors: {
      './test/spec/tests.webpack.js': ['webpack', 'sourcemap'],
    },
    reporters: ['progress'],
    singleRun: true,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true,
    }
  });
};
