const gulp = require('gulp');
const concat = require('gulp-concat');

const sources = [
  './public/modules/*.js',
  './public/classes/*.js',
  './public/components/*.js',
  './public/script.js'
];

gulp.task('js', () => gulp.src(sources).pipe(concat('main.min.js')).pipe(gulp.dest('public')));

gulp.task('watch', () => gulp.watch('public/**/*.js', ['js']));

gulp.task('default', ['js']);
