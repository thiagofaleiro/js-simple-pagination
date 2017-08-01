var fs = require('fs');
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

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
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
    root: [__dirname],
    livereload: true
  });
});

// gulp.task('clean-dist', function(cb) {
//   del([DIST], cb);
// });
//
function clean(cb) {
  del('./build', cb);
};

function open(){
  gulp.src('./demo/index.html')
      .pipe(open('', {url: 'http://localhost:8080/demo/'}));
};

function reload() {
  gulp.src(['./demo/*.html'])
      .pipe(connect.reload());
};

function watchHtml() {
  gulp.watch('./demo/*.html', ['reload']);
};

function compile(watch) {
  var bundler = watchify(browserify([
    './dist/pagination_class.js',
    './demo/demo.js'
  ], { debug: true }).transform('babelify', { presets: ['es2015'] }));

  function rebundle() {
    bundler.bundle()
      .on('error', _handleError)
      .pipe(source('demo.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'))
      .pipe(connect.reload());
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('open', open);
gulp.task('clean', clean);
gulp.task('reload', reload);
gulp.task('watch-html', watchHtml);

gulp.task('build', ['clean'], compile);
gulp.task('watch', ['watch-html'], watch);
gulp.task('default', ['watch', 'connect', 'open']);
