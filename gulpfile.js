var fs = require('fs');
var os = require('os');

var connect = require('gulp-connect');
var gulp = require('gulp');
// var karma = require('karma').server;
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var rename = require('gulp-rename');
var es = require('event-stream');
var del = require('del');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var open = require('gulp-open');

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var glob = require('glob');

var mocha = require('gulp-mocha');
var karma = require('karma').Server;

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n',

  browserPort: 8080,

  demo: {
    dir: './demo',
    script: './demo/demo.js'
  }
};


// Helpers
// -----------------------------------------------------------------------------

function _handleError(err) {
  console.log(err.toString());
  this.emit('end');
};

// Tasks
// -----------------------------------------------------------------------------

gulp.task('connect', function() {
  connect.server({
    root: 'demo',
    port: config.browserPort,
    livereload: true
  });
});

gulp.task('clean', function(cb) {
  del('./build', cb);
});

gulp.task('open', function(){
  gulp.src(__filename)
    .pipe(open({
      uri: 'http://localhost:' + config.browserPort
    }));
});

gulp.task('reload', function() {
  gulp.src(['./demo/*.html'])
      .pipe(connect.reload());
});

gulp.task('watch', function(){
  gulp.watch('./demo/*.html', ['reload']);
  return compile(true);
});

gulp.task('build', ['clean'], compile);
function compile(watch) {
  var bundler = watchify(browserify([
    './dist/pagination_class.js',
    config.demo.script
  ], { debug: true })
    .transform('babelify', { presets: ['es2015'] }));

  function rebundle() {
    bundler.bundle()
      .on('error', _handleError)
      .pipe(source(config.demo.script))
      .pipe(buffer())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./'))
      .pipe(connect.reload());
  }

  if (watch) {
    bundler.on('update', function() {
      var time = new Date();
      time = time.toTimeString().split(' ')[0];
      console.log('['+time+'] '+'-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

// Tests
gulp.task('test', function(done){
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function(){ done() });
});

gulp.task('test:serve', function(done){
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }, function(){ done() });
});

// Default: multiple tasks
gulp.task('default', ['watch', 'connect', 'open']);
