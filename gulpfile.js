var gulp = require('gulp');

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var streamify = require("gulp-streamify");
var exec = require("child_process").exec;


gulp.task("scripts", function(){
    gulp.src("./dev/app/js/classes/FumePush.js")
    .pipe(concat("FumePushClient.js"))
    .pipe(gulp.dest("bin"));

    gulp.src("dev/server/classes/SocketServer.js")
    .pipe(concat("FumePushServer.js"))
    .pipe(gulp.dest("bin"));

    browserify("./dev/app/js/classes/FumePush.js")
    .bundle({standalone: "FumePush"})
    .pipe(source("FumePushClient.min.js"))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest("bin"))
    .pipe(gulp.dest("dev/app/libs"));


    gulp.src("dev/server/classes/SocketServer.js")
    .pipe(uglify())
    .pipe(concat("FumePushServer.min.js"))
    .pipe(gulp.dest("bin"));
});

gulp.task("docs", function(){
    // requires yuidocjs installed globally
    exec("yuidoc . -o ./docs -t ./node_modules/yuidoc-bootstrap-theme -H ./node_modules/yuidoc-bootstrap-theme/helpers/helpers.js",
    function(err, stdout, stderr){
        if(err)
            console.log(err);

    });
})


gulp.task("watch", function(){
    gulp.watch("dev/app/js/classes/*.js", ["scripts", "docs"]);
    gulp.watch("dev/server/classes/*.js", ["scripts", "docs"]);
});

gulp.task('default', ["scripts", "docs", "watch"]);