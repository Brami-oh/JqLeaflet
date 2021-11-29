// var gulp = require('gulp');

// var tsProject = ts.createProject('tsconfig.json');

// gulp.task('html', function() {
//     return gulp.src('src/*.html')
//         .pipe(gulp.dest('dist'));
// });

// // gulp.task('default', gulp.series("html"), function() {
// gulp.task('default', function() {
//     return gulp.src('src/**/*.ts')
//         .pipe(sourcemaps.init()) // This means sourcemaps will be generated
//         .pipe(browserify().plugin(tsify).bundle())
//         .pipe(source('JqLeaflet.js'))
//         .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
//         .pipe(gulp.dest("dist"));
// });

"use strict";

const browserify = require("browserify"),
    buffer = require("vinyl-buffer"),
    gulp = require("gulp"),
    path = require("path"),
    source = require("vinyl-source-stream"),
    util = require("gulp-util"),
    watchify = require("watchify");

var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsify = require("tsify");

var src = {
        js: "src/JqLeaflet.ts",
        html: "src/*.html"
    },
    dest = {
        vbkjfjs: "dist/",
        outFile: "JqLeaflet.js"
    };

let bundler;

function bundles(profile) {
    if (bundler === undefined) {
        if (profile === "watch") {
            bundler = watchify(browserify(src.js));
        } else {
            bundler = browserify(src.js);
        }
    }
    bundle();
}

function bundle() {
    let start = new Date().getTime(),
        _ = bundler
        .bundle()
        .on("error", util.log.bind(util, "Browserify Error"))
        .pipe(source("JqLeaflet.js"))
        .pipe(buffer())
        .pipe(gulp.dest(dest.js)),
        time = new Date().getTime() - start;
    util.log("[browserify] rebundle took ", util.colors.cyan(`${time} ms`), util.colors.grey(`(${src.js})`));
    return _;
}
gulp.task("js", bundles.bind(null));
gulp.task("watch", function() {
    bundles("watch");
    bundler.on("update", bundle.bind(null));
});

gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(gulp.dest('dist'));
});

gulp.task('main', function() {
    return gulp.src(src.js, { read: false })
        //.pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(browserify().plugin(tsify).bundle())
        .pipe(source(dest.outFile))
        //.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest(dest.js));
});

gulp.task("default", gulp.series(["html", "main"]));