import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';

gulp.task('cli', function() {
  return gulp
    .src('cli/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(gulp.dest('cli-compiled'));
});

gulp.task('test', () => {
  return gulp
    .src('cli-test/**/*.js')
    .pipe(mocha({reporter: 'nyan', ui: 'tdd'}));
});

gulp.task('default', ['cli', 'test']);
