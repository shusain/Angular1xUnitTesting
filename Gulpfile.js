var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var path = require('path');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');
var less = require('gulp-less');
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var filter = require('gulp-filter');

require('gulp-stats')(gulp);

var gulp = require('gulp');
var Server = require('karma').Server;

var browserSync = require('browser-sync').create();
var templateCache = require('gulp-angular-templatecache');

var mainTasks = [ 'usemin', 'copyimages', 'copyphp', 'templates', 'copyfonts' ];

gulp.task('templates', [ 'clean' ], function() {
  return (gulp
      .src('src/client/**/*.html')
      // .pipe(filter(["**","!src/php/**"]))
      .pipe(
        templateCache('templates.js', {
          standalone: true,
          root: ''
        })
      )
      .pipe(gulp.dest('dist/')) );
});

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server(
    {
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    },
    function(exitCode) {
      done();
      process.exit(exitCode);
    }
  ).start();
});

gulp.task('serve', mainTasks, function() {
  browserSync.init({
    proxy: 'kirov.development'
  });

  var rebuildTasks = mainTasks.concat([ 'reload' ]);

  gulp.watch('src/php/**/*.php', [ 'copyphp' ]);
  gulp.watch('src/client/**/*.less', rebuildTasks);
  gulp.watch('src/client/**/*.html', rebuildTasks);
  gulp.watch('src/client/**/*.js', rebuildTasks);
});

gulp.task('copyphp', [ 'clean' ], function() {
  return gulp.src('src/php/**/*', { base: 'src' }).pipe(gulp.dest('dist/'));
});

gulp.task('reload', [ 'usemin' ], function() {
  browserSync.reload();
});

gulp.task('clean', function() {
  return gulp.src('dist/', { read: false }).pipe(clean());
});

gulp.task('favicons', [ 'clean' ], function() {
  return gulp.src([ 'src/client/favicons/*.*', 'src/client/manifest.json' ], { base: 'src' }).pipe(gulp.dest('dist'));
});

gulp.task('copyimages', [ 'clean' ], function() {
  return gulp.src('src/client/images/**/*', { base: 'src' }).pipe(gulp.dest('dist/'));
});

gulp.task('copyfonts', [ 'clean' ], function() {
  return gulp.src('src/client/styles/fonts/**/*', { base: 'src' }).pipe(gulp.dest('dist/'));
});

gulp.task('baseHrefUpdate', [ 'usemin' ], function() {
  return gulp
    .src([ 'dist/index.html' ])
    .pipe(replace('<base href="/">', '<base href="/staging/kirov/">'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('usemin', [ 'clean' ], function() {
  return gulp
    .src('src/client/*.html')
    .pipe(
      usemin({
        css: [ less(), rev() ],
        html: [ htmlmin({ collapseWhitespace: true }) ],
        js: [ babel({ presets: [ 'env' ] }), ngAnnotate(), uglify().on('error', gutil.log), rev() ],
        inlinejs: [ babel({ presets: [ 'env' ] }), ngAnnotate(), uglify() ],
        dependencyjs: [],
        inlinecss: [ less(), cleanCss(), 'concat' ]
      })
    )
    .pipe(gulp.dest('dist/'));
});

gulp.task('staging', mainTasks.concat('baseHrefUpdate'), function() {
  return gulp.src('dist/**/*', { base: 'dist' }).pipe(gulp.dest('/var/www/staging/kirov/'));
});

gulp.task('production', mainTasks, function() {
  //Leaving the file copying to the gitlab process
});

gulp.task('default', mainTasks);
