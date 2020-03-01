// Criação de variáveis
const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename');

sass.compiler = require('node-sass');

// Caminhos
const paths = {
    dev: {
        dir: "./**/*",
        img: "assets/src/images/**/*",
        js: "assets/src/js/*.js",
        sass: "assets/src/sass/**/*.scss",
    },
    dist: {
        img: "assets/dist/images",
        js: "assets/dist/js",
        css: "assets/dist/css",
    }
}

// Recursos
const assets = {
    css: [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        // "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
        // "node_modules/slick-carousel/slick/slick.css",
        // "node_modules/slick-carousel/slick/slick-theme.css",
        // "node_modules/aos/dist/aos.css"
    ],
    js: [
        "node_modules/jquery/dist/jquery.slim.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.min.js",
        // "node_modules/slick-carousel/slick/slick.min.js",
        // "node_modules/jquery-mask-plugin/dist/jquery.mask.min.js"
    ],
}

// Funções

// Compilar SASS
function compSass() {
    return gulp
        .src(paths.dev.sass)
        .pipe(sass({ outputStyle: 'compressed' }).on("error", sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(paths.dist.css));
}

// Importar CSS dos assets
function vendorCss() {
    return gulp
        .src(assets.css)
        .pipe(gulp.dest(`${paths.dist.css}/vendor`));
}

// Concatenar e minificar JS dos assets
function vendorJs() {
    return gulp
        .src(assets.js)
        .pipe(concat('vendor.js'))
        .pipe(minify())
        .pipe(gulp.dest(`${paths.dist.js}/vendor`))
}

// Concatenar e minificar JS
function minJs() {
    return gulp
        .src(paths.dev.js)
        .pipe(concat('main.js'))
        .pipe(minify())
        .pipe(gulp.dest(paths.dist.js))
}

// Minificar imagens
function minImg() {
    return gulp
        .src(paths.dev.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.img))
}

// Assistir arquivos
function watch() {
    gulp.watch(paths.dev.sass, compSass);
    gulp.watch(paths.dev.img, minImg);
    gulp.watch(paths.dev.js, minJs);
    gulp.watch(paths.dev.sass, gulp.series(sass));
}

// Tarefas

gulp.task("default", gulp.parallel(watch, compSass));
gulp.task("assets", vendorCss);
gulp.task("image", minImg);
gulp.task("js", gulp.series(vendorJs, minJs));
gulp.task("sass", compSass);
