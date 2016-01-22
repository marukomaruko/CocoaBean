import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('cli', function() {
  gulp.src('cli/**/*.js')
      .pipe(babel({
        presets: ['es2015', 'stage-0']
      }))
      .pipe(gulp.dest('cli-compiled'));
});

gulp.task('default', ['cli']);
