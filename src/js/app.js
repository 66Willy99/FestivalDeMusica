document.addEventListener('DOMContentLoaded', function() {
    navegacionFija();
    crearGaleria();
    restaltarEnlace();
    scrollNav();
})

function navegacionFija(){
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');

    window.addEventListener('scroll', () => {
        if(sobreFestival.getBoundingClientRect().bottom<1){
            header.classList.add('fixed');
        } else{
            header.classList.remove('fixed');
        }
    })
    
}

function crearGaleria(){
    const CANTIDAD_IMAGENES = 16;
    const galeria = document.querySelector('.galeria-imagenes')
    for(let i = 1; i<=CANTIDAD_IMAGENES; i++){
        const imagen = document.createElement('IMG');
        imagen.src = `src/img/gallery/full/${i}.jpg`;
        imagen.alt = 'Imagen galeria';

        //Evemt Handler
        imagen.onclick = function(){
            console.log(`diste click...${i}`);
            mostrarImagen(i);
        }

        galeria.appendChild(imagen);
    }
}

function mostrarImagen(i){
    const imagen = document.createElement('IMG');
    imagen.src = `src/img/gallery/full/${i}.jpg`;
    imagen.alt = 'Imagen galeria';
    
    // Generar Modal
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    modal.onclick = cerrarModal;
    
    // Boton cerrar modal
    const cerrarModalBtn = document.createElement('BUTTON');
    cerrarModalBtn.textContent = 'X';
    cerrarModalBtn.classList.add('cerrar-modal');
    cerrarModalBtn.onclick = cerrarModal;

    modal.appendChild(imagen);
    modal.appendChild(cerrarModalBtn);

    // Agregar al HTML
    const body = document.querySelector('body');
    body.classList.add('no-scroll');
    body.appendChild(modal);

    console.log(modal);
}

function cerrarModal(){
    const modal = document.querySelector('.modal');
    modal.classList.add('fadeOut');
    setTimeout(() => {
        modal?.remove();
        const body = document.querySelector('body');
        body.classList.remove('no-scroll');
    }, 500)
}

function restaltarEnlace(){
    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navegacion-principal a');  
        let act = '';
        sections.forEach( section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)){
                act = section.id;
            }
        })
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#'+act){
                link.classList.add('active');
            }
        })
    })
}

function scrollNav(){
    const links = document.querySelectorAll('.navegacion-principal a');
    links.forEach( link => {
        link.addEventListener('click', e=>{
            e.preventDefault();
            const sectionScroll = e.target.getAttribute('href');
            const section = document.querySelector(sectionScroll);

            section.scrollIntoView({ behavior: 'smooth' })
        })
    })
}