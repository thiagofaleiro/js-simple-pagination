module.exports = function(config) {
  'use strict'
  config.set({

    // Base path, that will be used to resolve files and exclude
    basePath: '',

    // Frameworks to use
    frameworks: ['browserify', 'mocha', 'chai'],

    // List of files / patterns to load in the browser
    files: [
      './node_modules/phantomjs-polyfill-find/find-polyfill.js',
      'dist/*.js',
      'test/*.js'
    ],

    // List of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['mocha', 'coverage'],

    // Enables colors on the reportes outputs
    colors: true,

    // Web server port
    port: 9876,

    // Level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR
    // || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    preprocessors: {
      'dist/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify'],
    },

    // Babel via browserify
    browserify: {
      debug: true,
      configure: function browserify(bundle) {
        bundle.once('prebundle', function prebundle() {
          bundle.transform('babelify', {
            presets: ['es2015'],
            plugins: ['transform-object-rest-spread', 'istanbul']
          });
        });
      }
    },

    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'html', dir: 'coverage', subdir: 'html' },
        { type: 'lcovonly', dir: 'coverage', subdir: 'lcov' }
      ]
    }
  });
};
