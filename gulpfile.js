const gulp = require('gulp');
const htmlMin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
// const imageMin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass'));


const html = () => {
    return gulp.src('./src/*.html')
        .pipe(htmlMin({ collapseWhitespace: true}))
        .pipe(gulp.dest('./dist')
    );
};

const js = () => {
    return gulp.src('./src/JS/**/*.js')
        .pipe(concat('script.js'))
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('./dist/JS'))
};


const css = () => {
    return gulp.src('./src/CSS/**/*.css')
        .pipe(concat('style.css'))
        .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/CSS'))
}


const scss = () => {
    return gulp.src('./src/CSS/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
         .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/CSS'));
}


const fonts = () => {
    return gulp.src('./src/Fonts/**/*.*')
    .pipe(gulp.dest('./dist/Fonts'))
}


const cleanDist = () => {
    return gulp.src('./dist', { read: false }).pipe(clean());
}


const watcher = () => {
    gulp.watch('./src/**/*.html', html).on('all', browserSync.reload);
    gulp.watch('./src/CSS/**/*.{scss, sass, css}', scss).on('all', browserSync.reload);
    gulp.watch('./src/JS/**/*.js', js).on('all', browserSync.reload);
    gulp.watch('./src/Fonts/**/*.*', fonts).on('all', browserSync.reload);

    // gulp.watch('./src/img/**/*.*', image).on('all', browserSync.reload);
};


const server = () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
}

// const image = () => {
//     return gulp.src('./src/img/**/*.*')
//         .pipe(imageMin)
//     .pipe(gulp.dest('./dist/img'))
// }

const image = () => {
    return gulp.src('./src/img/**/*.*')
    .pipe(gulp.dest('./dist/img'))
}

gulp.task('html', html);
gulp.task('js', js);
gulp.task('style', css);
gulp.task('img', image);
gulp.task('browserSync', server);
gulp.task('scss', scss);
gulp.task('fonts', fonts);


// gulp.task('build', gulp.series(cleanDist, html, css, js));

gulp.task('build', gulp.series(
    cleanDist,
    gulp.parallel(html, scss, js, image, fonts)
));


// gulp.task('dev', gulp.parallel(html, css, js, watcher));

gulp.task('dev', gulp.series(
    gulp.parallel(html, scss, js, image,fonts),
    gulp.parallel(server, watcher)
));