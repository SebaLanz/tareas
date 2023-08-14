import SweetAlert from './frameworks/sweetAlert.js';

const objSweet = new SweetAlert();

document.addEventListener("DOMContentLoaded", function() {
    // Obtener referencia al botón por su ID
    const btnSeccion = document.getElementById("btn_seccion");

    // Agregar un evento de clic al botón
    btnSeccion.addEventListener("click", function() {
        // Imprimir en la consola cada vez que se presiona el botón      
        objSweet.crearSeccion();
    });

});
