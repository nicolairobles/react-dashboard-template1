var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');

var production = process.env.NODE_ENV === 'production';

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-router',
  'underscore'
];

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
    'bower_components/toastr/toastr.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
  return browserify({ entries: 'app/client.js', debug: true })
    .external(dependencies)
    .transform(babelify, {"presets": ["es2015", "react"],
      "plugins": [
        "transform-es2015-destructuring",
        "transform-object-rest-spread"
      ]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
  var bundler = watchify(browserify({ entries: 'app/client.js', debug: true }, watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify, {"presets": ["es2015","react", "stage-2"]});
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('public/js/'));
  }
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('less', function() {
  return gulp.src('app/stylesheets/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest('public/css'));
});

/*
 |--------------------------------------------------------------------------
 | Compile SASS stylesheets.
 |--------------------------------------------------------------------------
 */

// gulp.task('styles', function() {
//   return gulp
//     .src('app/styles/**/*.scss')
//     .pipe(plumber())
//     .pipe(sass())
//     .pipe(autoprefixer())
//     .pipe(gulpif(production, cssmin()))
//     .pipe(gulp.dest('public/css'));
// });

gulp.task('styles', function(){
  var injectAppFiles = gulp.src(['!app/styles/main.scss', 'app/styles/**/*.scss'], {read: false});
 
  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }
 
  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };
 
  return gulp.src('app/styles/main.scss')
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest('public/css'));
});



gulp.task('watch', function() {
  gulp.watch('app/styles/**/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'vendor', 'browserify']);