var gulp = require('gulp'),
    connect = require('gulp-connect'),
    historyApiFallback = require('connect-history-api-fallback'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream;

//Servidor web de desarrollo

gulp.task('server', function() {
    connect.server({
        root: './app',
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true,
        middelware: function(connect, opt) {
            return [historyApiFallback];
        }
    });
});

//Pre-procesa archivos Stylus a CSS y recarga los cambios
/*La libreria nib añade de forma automática las propiedades
CSS para Firefox,Internet Explorer y Chrome*/

gulp.task('css', function() {
    gulp.src('./app/stylesheets/main.styl')
        .pipe(stylus({ use: nib() }))
        .pipe(gulp.dest('./app/stylesheets'))
        .pipe(connect.reload());
})

//Recarga el navegador cuando hay cambios en el HTML

gulp.task('html', function() {
    gulp.src('./app/**/*.html')
        .pipe(connect.reload());
});

//Busca errores en el JS y nos los muestra por pantalla

gulp.task('jshint', function() {
    return gulp.src('./app/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

//Busca en las carpetas de estilos y javascript los archivos que hayamos creado
//para inyectarlos en el index.html

gulp.task('inject', function() {
    var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css']);
    return gulp.src('index.html', { cwd: './app' })
        .pipe(inject(sources))
        .pipe(gulp.dest('./app'));
});

//Inyecta las librerías que instalamos vía bower

gulp.task('wiredep', function() {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/lib'
        }))
        .pipe(gulp.dest('./app'));
});

//Vigila cambios que se produzcan en el código
//y lanza las tareas relacionadas:

gulp.task('watch', function() {
    gulp.watch(['./app/**/*.html'], ['html']);
    gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
    gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['./bower.json'], ['wiredep']);
});



gulp.task('default', ['server', 'inject','wiredep','watch']);
