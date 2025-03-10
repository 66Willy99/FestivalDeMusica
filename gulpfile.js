// Importa las librerías necesarias
import path from 'path';
import fs from 'fs';

import { glob } from 'glob'; // Librería para buscar archivos en un directorio

// Importa librerias de gulp
import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass'; // Se trae la librería Dart Sass para que gulp-sass la use
import gulpSass from 'gulp-sass'; // Gulp-Sass compila Sass usando la librería Dart Sass

const sass = gulpSass( dartSass ); // Se le pasa la librería Dart Sass a gulp-sass

import terser from 'gulp-terser'; // Minifica el archivo JS
import sharp from 'sharp'; // Librería para redimensionar imágenes

export function js(done){
    src('src/js/app.js')
        .pipe( terser() )
        .pipe( dest('build/js') )
    done()
}

export function css(done){
    //ubica el archivo scss
    src('src/scss/app.scss', {sourcemaps: true}) // Archivo de entrada que se usa para ubicar los archivos Sass y tambien crear el sourcemap
        //compila el archivo scss
        .pipe( sass({
            style: 'compressed', // Estilo de salida del archivo CSS
        }).on('error', sass.logError) ) // Una vez ubicado el archivo busca el pipe para realizar la tarea y en caso de haber un error lo muestra en consola
        //Guarda el archivo css en la carpeta build/css
        .pipe( dest('build/css', {sourcemaps: '.'}) ) // Una vez compilado el archivo lo guarda en la carpeta build/css junto con el sourcemap
    done()
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}


export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

export function html(done){
    src('index.html')
        .pipe( dest('build') )
    done()
}

export function dev(){// no se necesita el done por que no se esta ejecutando una tarea asincrona
    watch( 'src/scss/**/*.scss', css ) // Se le pasa la tarea css para que se ejecute cuando se detecten cambios en los archivos Sass
    watch( 'src/js/**/*.js', js )
    watch( 'src/img/**/*.{png,jpg}', imagenes )
}

export default series( imagenes, crop, js, css, dev) // Se ejecutan las tareas js, css y dev en serie
export const build = series(imagenes, crop, js, css, html); // Se ejecutan las tareas js, css y dev en serie