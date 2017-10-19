let gulp = require('gulp');
let replace = require('gulp-replace');
let rimraf = require('rimraf');

gulp.task('ts-scrub:index', () => {
  return gulp.src('./.ts/index.js')
  .pipe(replace('var codemirror = require("codemirror");', ''))
  .pipe(replace('"', '\''))
  .pipe(gulp.dest('.'));
});

gulp.task('ts-scrub:declaration', () => {
  return gulp.src('./.ts/index.d.ts')
  .pipe(gulp.dest('.'));
});

gulp.task('ts-scrub', ['ts-scrub:index', 'ts-scrub:declaration'], (done) => {
  rimraf('./.ts', done);
});
