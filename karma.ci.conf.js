// NOTE force environment
process.env.NODE_ENV = 'test';

var webpack = require('webpack');
var path = require('path');
var webpackConfig = require('./webpack.config.js');


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
    reporters: ['progress', 'coverage'],
    singleRun: true,
    junitReporter: {
      outputDir: '',
      outputFile: undefined,
      suite: '',
      useBrowserName: true
    },
    // more info: https://github.com/karma-runner/karma-coverage
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      file: 'coverage.html'
    },
    webpack: webpackConfig
  });
};
