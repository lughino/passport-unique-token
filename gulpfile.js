var jshint = require('gulp-jshint');
var gulp   = require('gulp');

var jshintOptions = {
    camelcase : true,
    curly : true,
    eqeqeq : true,
    forin : true,
    newcap : true,
    nonbsp : true,
    unused : "vars",
    eqnull : true,
    node : true,
    devel : true,
    expr : true
};

gulp.task('lint', function() {
    return gulp.src(['./lib/*.js', './tests/**/*.test.js'])
        .pipe(jshint(jshintOptions))
        .pipe(jshint.reporter('default'));
});