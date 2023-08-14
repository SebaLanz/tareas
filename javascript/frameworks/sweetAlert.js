class SweetAlert {
    crearSeccion = () => {
        Swal.fire({
            title: 'Creación de Sección',
            text: "Escribe el nombre de la columna",
            input: 'text',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Crear Sección',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const seccionNombre = result.value;
                if (seccionNombre) {
                    const nuevoH3 = document.createElement('h3');
                    nuevoH3.textContent = seccionNombre;
    
                    const btnAgregar = document.createElement('button');
                    btnAgregar.textContent = 'Agregar Tarjeta';
                    btnAgregar.classList.add('btn_agregar'); // Agregar clase al botón agregar
                    btnAgregar.addEventListener('click', this.agregarTarjeta);
    
                    const btnBorrar = document.createElement('button');
                    btnBorrar.textContent = 'Borrar Sección';
                    btnBorrar.classList.add('btn_borrar'); // Agregar clase al botón borrar
                    btnBorrar.addEventListener('click', this.borrarSeccion);
    
                    const nuevoDiv = document.createElement('div');
                    nuevoDiv.className = 'div_seccion';
                    nuevoDiv.appendChild(nuevoH3);
    
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'btn-container';
                    btnContainer.appendChild(btnAgregar);
                    btnContainer.appendChild(btnBorrar);
                    
                    nuevoDiv.appendChild(btnContainer);
    
                    const contenedor = document.getElementById('body');
                    contenedor.appendChild(nuevoDiv);
    
                    // Guardar el nuevo div en el localStorage
                    this.guardarDivEnLocalStorage(nuevoDiv);
                    
                    const mensaje = `Ya puede crear tarjetas en la sección <b>${seccionNombre}</b>`;
                    Swal.fire(
                        'Sección Creada',
                        mensaje
                    )
                } else {
                    Swal.fire(
                        'Error',
                        'Debes ingresar un nombre de sección válido',
                        'error'
                    )
                }
            }
        });
    }
    guardarDivEnLocalStorage(div) {
        const divsGuardados = JSON.parse(localStorage.getItem('divs')) || [];
        divsGuardados.push(div.outerHTML);
        localStorage.setItem('divs', JSON.stringify(divsGuardados));
    }

    cargarDivs() {
        const divsGuardados = JSON.parse(localStorage.getItem('divs')) || [];
        const contenedor = document.getElementById('body');
        divsGuardados.forEach((divHTML) => {
            const div = document.createElement('div');
            div.innerHTML = divHTML;
            contenedor.appendChild(div);
        });
    }
    
    agregarTarjeta = () => {
        // Implementa la lógica para agregar una tarjeta a la sección
    }
    
    borrarSeccion = (event) => {
        const seccion = event.target.parentNode;
        seccion.parentNode.removeChild(seccion);
    }
}


export default SweetAlert;