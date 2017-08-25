import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import coveralls from 'gulp-coveralls';
import jasmineNode from 'gulp-jasmine-node';
import istanbul from 'gulp-istanbul';
import injectModules from 'gulp-inject-modules';
import exit from 'gulp-exit';

process.env.NODE_ENV = 'test';

const jasmineNodeOpts = {
  timeout: 120000,
  includeStackTrace: false,
  color: true
};

gulp.task('nodemon', () => {
  nodemon({
    script: 'build/server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['server']
  });
});

gulp.task('dev', () => gulp.src('server/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-2']
  }))
  .pipe(gulp.dest('build')));

gulp.task('production', () => gulp.src('server/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-2']
  }))
  .pipe(gulp.dest('build')));

gulp.task('test', () => {
  gulp.src('server/test/controllers/*.js')
    .pipe(babel())
    .pipe(jasmineNode(jasmineNodeOpts))
    .pipe(exit());
});

gulp.task('coverage', (cb) => {
  gulp.src('./build/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('server/test/**/*.js')
        .pipe(babel())
        .pipe(injectModules())
        .pipe(jasmineNode())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 30 } }))
        .on('end', cb)
        .pipe(exit());
    });
});
gulp.task('coveralls', () => gulp.src('./coverage/lcov')
    .pipe(coveralls())
);

gulp.task('default', ['dev'], () => {
  gulp.watch('server/**/*.js', ['dev']);
});
