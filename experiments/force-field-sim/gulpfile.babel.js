import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

const SOURCE = 'src/**/*.js';
const DIST = 'dist/';

gulp.task('build', () => {
   browserify({ entries: 'src/app.js', debug: true })
      .transform(babelify)
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(DIST));
});
gulp.task('build:watch', () => {
   gulp.watch(SOURCE, ['build']);
});

gulp.task('default', ['build']);
