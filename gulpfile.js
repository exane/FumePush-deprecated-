var gulp = require('gulp');

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var streamify = require("gulp-streamify");
var yuidoc = require("gulp-yuidoc");


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

gulp.task("doc", function(){
    gulp.src("dev/app/js/classes/*.js")
        .pipe(yuidoc.parser())
        .pipe(yuidoc.generator())
        .pipe(gulp.dest("./doc"));
})


gulp.task("watch", function(){
    gulp.watch("dev/app/js/classes/*.js", ["scripts", "doc"]);
    gulp.watch("dev/server/classes/*.js", ["scripts"]);
});

gulp.task('default', ["scripts", "watch", "doc"]);