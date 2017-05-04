const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', function(){
  return gulp.src('src/jsx/*.jsx')
    .pipe(babel({
      plugins: ['transform-react-jsx']
    }))
    .pipe(gulp.dest('src/js/'))
  ;
});