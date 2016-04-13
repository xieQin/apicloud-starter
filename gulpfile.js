'use strict';

var watchify = require('watchify');
var browsersync  = require('browser-sync');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var config = require('./config').browserify;

gulp.task('js', function(callback) {

  browsersync.notify('Compiling JavaScript');

  var bundleQueue = config.bundleConfigs.length;
  var browserifyThis = function(bundleConfig) {
    var bundler = browserify({
      cache: {}, packageCache: {}, fullPaths: false,
      entries: bundleConfig.entries,
      debug: config.debug
    });

    var bundle = function() {

      return bundler
        .bundle()
        .pipe(source(bundleConfig.outputName))
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };

    bundler = watchify(bundler);
    bundler.on('update', bundle);
    bundler.on('log', gutil.log);

    var reportFinished = function() {

      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          callback();
        }
      }
    };

    return bundle();
  };

  config.bundleConfigs.forEach(browserifyThis);
});
