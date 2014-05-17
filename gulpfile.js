var gulp = require('gulp');

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var streamify = require("gulp-streamify");
var exec = require("gulp-exec");


gulp.task("scripts", function(){
    //gulp.src("dev/app/js/classes/FumePush.js")
    browserify("./dev/app/js/classes/FumePush.js")
        .bundle({standalone: "FumePush"})
        .pipe(source("FumePushClient.min.js"))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest("production"))
        .pipe(gulp.dest("dev/app/libs"));


    gulp.src("dev/server/classes/SocketServer.js")
        .pipe(uglify())
        .pipe(concat("FumePushServer.min.js"))
        .pipe(gulp.dest("production"));
});

gulp.task("docs", function(){
    // requires yuidocjs installed globally
    gulp.src("dev/app/js/classes/*.js")
        .pipe(exec("yuidoc . -o ./docs -t ./node_modules/yuidoc-bootstrap-theme -H ./node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"));
})


gulp.task("watch", function(){
    gulp.watch("dev/app/js/classes/*.js", ["scripts", "docs"]);
    gulp.watch("dev/server/classes/*.js", ["scripts"]);
});

gulp.task('default', ["scripts", "watch", "docs"]);