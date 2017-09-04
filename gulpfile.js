/* jshint node: true */
/* jshint esversion: 6 */

'use strict';

/* =============================================================================
 CONFIG
 ============================================================================= */

const config = require('./config.json');

/* =============================================================================
 PLUGINS
 ============================================================================= */

const gulp = require('gulp'); // Gulp
const del = require('del'); // Borra archivos
const imagemin = require('gulp-imagemin'); // Optimizar imágenes
const uglify = require('gulp-uglify'); // Minificar JS
const concat = require('gulp-concat'); // Concatena ficheros
const plumber = require('gulp-plumber'); // Evita que gulp para de ejecutarse cuando tiene un error
const browser = require('browser-sync').create(); // Servidor local, refresco automatico del navegador
const panini = require('panini'); // Simple html template engine generator
const prettify = require('gulp-jsbeautifier'); // Ordena el HTML final

const replace = require('gulp-replace'); // Reemplaza strings, etc.
const gulpif = require('gulp-if'); // Condicional if en pipes
const argv = require('yargs').argv; // Pasar variables por consola
const preprocess = require('gulp-preprocess'); // Preprocesar archivos

const htmlmin = require('gulp-htmlmin');

// CSS
const critical = require('critical').stream; // Separa el CSS critico de la web y lo incrusta inline;
const sassToCSS = require('gulp-sass'); // Compilador de Sass
const sourcemaps = require('gulp-sourcemaps'); // Sourcemaps de Sass
const autoprefixer = require('gulp-autoprefixer'); // Autoprefixer para CSS
const cssunit = require('gulp-css-unit'); // Convierte unidades
const postcss = require('gulp-postcss'); // Libreria necesaria para otras cosas
const cssdeclsort = require('css-declaration-sorter'); // Ordena propiedades CSS

const cssnano = require('cssnano'); // Minifica el CSS




/* =============================================================================
 TASKS
 ============================================================================= */

gulp.task('build',
    gulp.series(clean, gulp.parallel(pages, images, copyAssets, vendorScripts, customScripts), commonsSass)
);

gulp.task('clean',
    gulp.series(clean)
);

gulp.task('default',
    gulp.series('build', server, watch, function (done) {
            done();
        }
    ));



gulp.task('critical', function () {
    return gulp.src('dist/**/*.html')
        .pipe(critical({base: 'dist/', inline: true, css: ['dist/assets/css/main.css'], minify: true,}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('critical'));
});

/* =============================================================================
 FUNCTIONS
 ============================================================================= */

// Refresca el navegador
function reloadBrowser(done) {
    browser.reload();
    done();
}


function clean(done) {
    del(config.paths.dist.root + '**/*');
    done();
}

// Compila el HTML
function pages() {
    return gulp.src(config.paths.src.pages + '**/*.{html,hbs,handlebars}')
        .pipe(panini({
            root: config.paths.src.pages,
            layouts: config.paths.src.layouts,
            partials: config.paths.src.partials,
            helpers: config.paths.src.helpers,
            data: config.paths.src.data
        })).pipe(prettify({
            max_preserve_newlines: 0
        }))
        .pipe(gulp.dest(config.paths.dist.root));
}

// Carga las actualizaciones de los templates y los partials del HTML
function resetPages(done) {
    panini.refresh();
    done();
}


// Compila el Sass de los comunes
function commonsSass() {


    return gulp.src(config.paths.src.sass + 'main.scss')


        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sassToCSS()
            .on('error', sassToCSS.logError))
        .pipe(gulpif(argv.production, autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        })))
        .pipe(gulpif(argv.production, cssunit({
            type: 'px-to-rem',
            rootSize: 16
        })))
        .pipe(gulpif(argv.production, postcss([
            cssdeclsort({
                order: 'alphabetically'
            }),
            cssnano({
                discardUnused: {
                    fontFace: false
                }
            })
        ])))
        .pipe(gulpif(!argv.production, sourcemaps.write('.', {sourceRoot: '/'})))
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.dist.css))
        .pipe(browser.reload({stream: true}));
}


// Concatena y minifica los Scripts de vendor
function vendorScripts() {
    return gulp.src(config.paths.src.jsVendor)
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dist.jsVendor));
}

// Concatena y minifica los Scripts de vendor
function customScripts() {
    return gulp.src(config.paths.src.jsCustom)
        .pipe(concat('custom.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dist.jsCustom));
}


// Optimiza las imágenes y las mueve a dist
function images() {
    return gulp.src(config.paths.src.img + '**/*')
        .pipe(gulpif(argv.production, imagemin({
            progressive: true
        })))
        .pipe(gulp.dest(config.paths.dist.img));
}

// Copia todos los assets a dist, menos los que empiezan por !
function copyAssets() {
    return gulp.src(config.paths.src.copyFiles)
        .pipe(gulp.dest(config.paths.dist.assets));
}

// Lanza el servidor con BrowserSync
function server(done) {
    browser.init({
        server: {
            proxy: 'http://proxy.services.gbv:3128',
            baseDir: config.paths.dist.root
        }
    });
    done();
}

// Detecta los cambios en vivo y llama a las funciones
function watch(done) {
    gulp.watch(config.watch.pages).on('all', gulp.series(pages, reloadBrowser));
    gulp.watch(config.watch.layoutsPartials).on('all', gulp.series(resetPages, pages, reloadBrowser));
    gulp.watch(config.watch.sass).on('all', gulp.series(commonsSass));
    gulp.watch(config.watch.img).on('all', gulp.series(images, reloadBrowser));
    gulp.watch(config.watch.assets).on('all', gulp.series(copyAssets, reloadBrowser));
    gulp.watch(config.watch.jsVendor).on('all', gulp.series(vendorScripts, reloadBrowser));
    gulp.watch(config.watch.jsCustom).on('all', gulp.series(customScripts, reloadBrowser));

    done();
}