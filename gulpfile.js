const gulp         = require('gulp');
const del          = require('del');
const sass         = require('gulp-sass');
const rename       = require('gulp-rename');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const cleanCSS     = require('gulp-clean-css');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();

// --------------------------------------------------------------------
// Task: Copy Fonts
// --------------------------------------------------------------------
gulp.task('copyFonts', function() {
  return gulp.src([
    './bower_components/bootstrap-sass/assets/fonts/bootstrap/**/*.{ttf,woff,woff2,otf,eof,eot,svg}',
    './bower_components/font-awesome/fonts/**/*.{ttf,woff,woff2,otf,eof,eot,svg}'
  ])
  .pipe(gulp.dest('./assets/fonts'));
});


// --------------------------------------------------------------------
// Task: Compile SASS
// --------------------------------------------------------------------
gulp.task('compileStyles', function() {
  return gulp.src('./sass/app.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});


// --------------------------------------------------------------------
// Task: Minify CSS
// --------------------------------------------------------------------
gulp.task('minifyCSS', ['compileStyles', 'copyFonts'], function() {
  return gulp.src('./assets/css/app.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});


// --------------------------------------------------------------------
// Task: Concat Scripts
// --------------------------------------------------------------------
gulp.task('concatScripts', function() {
  return gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'scripts/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js'));
});


// --------------------------------------------------------------------
// Task: Minify JS
// --------------------------------------------------------------------
gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src('./assets/js/app.js')
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('assets/js'));
});


// --------------------------------------------------------------------
// Task: Clean
// --------------------------------------------------------------------
gulp.task('clean', function() {
  del(['assets']);
});


// --------------------------------------------------------------------
// Task: Serve
// --------------------------------------------------------------------
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch('./sass/**/*.{scss, sass}', ['minifyCSS']);
  gulp.watch('./scripts/**/*.js', ['minifyScripts']);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
});


// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------
gulp.task('default', ['clean', 'minifyCSS', 'minifyScripts', 'serve']);
