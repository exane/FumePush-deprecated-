var gulp = require('gulp');

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var include = require("gulp-include");


gulp.task("scripts", function(){
    gulp.src("dev/app/js/classes/FumePush.js")
        .pipe(include())
        .pipe(uglify())
        .pipe(concat("FumePushClient.min.js"))
        .pipe(gulp.dest("production"));

    gulp.src("dev/server/classes/SocketServer.js")
        .pipe(include())
        .pipe(uglify())
        .pipe(concat("FumePushServer.min.js"))
        .pipe(gulp.dest("production"));
});

gulp.task("watch", function(){
    gulp.watch("dev/app/js/classes/*.js", ["scripts"]);
    gulp.watch("dev/server/classes/*.js", ["scripts"]);
});

gulp.task('default', ["scripts", "watch"]);