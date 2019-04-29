const gulp = require('gulp');
const replace = require('gulp-replace');
const rimraf = require('rimraf');
const beautify = require('gulp-beautify');
const babel = require('gulp-babel');

gulp.task('ts-scrub:index', () => {
  return gulp.src('./.ts/index.js')
    .pipe(replace('var codemirror = require("codemirror");', ''))
    .pipe(replace('"', '\''))
    .pipe(babel({
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ]
    }))
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('.'));
});

gulp.task('ts-scrub:declaration', () => {
  return gulp.src('./.ts/index.d.ts')
    .pipe(gulp.dest('.'));
});

gulp.task('ts-scrub', gulp.series(['ts-scrub:index', 'ts-scrub:declaration']), (done) => {
  rimraf('./.ts', done);
});
