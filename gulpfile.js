import { src, dest } from 'gulp';
import * as dartSass from 'sass'; // Se trae la librería Dart Sass para que gulp-sass la use
import gulpSass from 'gulp-sass'; // Gulp-Sass compila Sass usando la librería Dart Sass

const sass = gulpSass( dartSass ); // Se le pasa la librería Dart Sass a gulp-sass

export function css(done){
    //ubica el archivo scss
    src('src/scss/app.scss') // Archivo de entrada que se usa para ubicar los archivos Sass
        //compila el archivo scss
        .pipe( sass() ) // Una vez ubicado el archivo busca el pipe para realizar la tarea
        //Guarda el archivo css en la carpeta build/css
        .pipe( dest('build/css') )


    done()
}