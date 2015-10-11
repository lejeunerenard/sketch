var gulp = require('gulp');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('default', function() {
  browserify({ entries: './src/app.js', debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/js/'));
});
