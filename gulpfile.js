var gulp   = require('gulp')

var less       = require('gulp-less')
var browserify = require('gulp-browserify')
var autoprefixer = require('gulp-autoprefixer')
var babel = require("gulp-babel")
var nunjucksRender = require('gulp-nunjucks-render')

var paths = {
  scripts: [],
  watchBase : 'src/',
  destBase : 'public/',
  cssDest : "./public/css"
};

gulp.task('less', function(){
  return gulp.src(paths.watchBase + 'style.less')
  .pipe(less())
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(gulp.dest(paths.cssDest));
});

gulp.task('nunjucks', function() {
  return gulp.src(paths.watchBase + '/locations/*.+(html|nunjucks)')
    .pipe(nunjucksRender({
      path: [paths.watchBase]
    }))
    .pipe(gulp.dest(paths.destBase))
})

gulp.task('js', function(){
  return gulp.src(paths.watchBase + 'site.js')
  .pipe(babel())
  .pipe(browserify({
    insertGlobals : true,
    transform : 'debowerify'
  }))
  .pipe(gulp.dest(paths.destBase + 'js'))
});


gulp.task('build',['less', 'js'])

gulp.task('watch', function(){
  gulp.watch(paths.watchBase + '*.less', ['less']);
  gulp.watch(paths.watchBase + '**/*.html', ['nunjucks']);
  gulp.watch([paths.watchBase + '*.js'], ['js']);
});



