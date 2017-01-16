const fs = require('fs');

const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const git = require('gulp-git');
const ngConstant = require('gulp-ng-constant');
const rm = require('gulp-rimraf');

const KarmaServer = require('karma').Server;
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const minimist = require('minimist');

const knownOptions = {
  string: 'buildNumber',
  default: { buildNumber: 'LOCAL' }
};

const options = minimist(process.argv.slice(2), knownOptions);

const versionMajorMinor = require(__dirname + '/package.json').version;
let gitHash = '';

// watch, continuous testing
gulp.task('karma', function(done) {
  const server = new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
  server.start();
});

// single run, ci
gulp.task('karma:ci', function(done) {
  const server = new KarmaServer({
    configFile: __dirname + '/karma.ci.conf.js',
    singleRun: true
  }, done);
  server.start();
});

gulp.task('clean', function() {
  return gulp.src('dist/*').pipe(rm());
});

gulp.task('package', ['clean', 'version'], function(done) {
  webpack(webpackConfig, function(err, stats) {
    if (stats.compilation.errors.length) {
      throw new gutil.PluginError('webpack', stats.compilation.errors.toString());
    }
    if (stats.compilation.warnings.length) {
      gutil.log('[WARNING]', stats.compilation.warnings.toString());
    }
    done();
  });
});

gulp.task('githash', function(done) {
  git.exec({args: 'rev-parse --short HEAD'}, function(err, stdout) {
    gitHash = stdout;
    done();
  });
});

gulp.task('version', ['githash'], function() {
  return ngConstant({
    name: 'version',
    constants: {
      versionNumber: {
        version: versionMajorMinor + options.buildNumber,
        gitHash: gitHash.trim()
      }
    },
    wrap: 'commonjs',
    stream: true
  })
  .pipe(rename({
    basename: 'version-service',
    extname: '.js'
  }))
  .pipe(gulp.dest('./app/services/'));
});

gulp.task('build', ['package']);
