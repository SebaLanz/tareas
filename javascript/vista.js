import SweetAlert from './frameworks/sweetAlert.js';

const objSweet = new SweetAlert();

document.addEventListener("DOMContentLoaded", function() {
    objSweet.loadSecciones();

    // Obtener referencia al botón por su ID
    const btnSeccion = document.getElementById("btn_seccion");

    // Agregar un evento de clic al botón
    btnSeccion.addEventListener("click", function() {
        // Imprimir en la consola cada vez que se presiona el botón      
        objSweet.crearSeccion();
    });

    // Agregar tarjeta
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn_agregar')) {
            const seccionId = event.target.closest('.div_seccion').dataset.id;
            objSweet.agregarTarjeta(seccionId);
        }
    });

    // Editar tarjeta
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-primary')) {
            objSweet.editarTarjeta(event);
        }
    });

    // Cargar tarjetas
    const secciones = document.querySelectorAll('.div_seccion');
    secciones.forEach(seccion => {
        const seccionId = seccion.dataset.id;
        objSweet.loadTarjetas(seccionId);
    });

    //eliminar tarjeta.
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn_borrar')) {
            objSweet.borrarSeccion(event);
        } else if (event.target.classList.contains('btn_eliminar_tarjeta')) {
            objSweet.eliminarTarjeta(event);
        }
    });
    
});

