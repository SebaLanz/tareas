

class SweetAlert {
    constructor() {
        this.seccionCounter = this.loadSecciones() + 1;
        this.addEventListeners();
    }

    loadSecciones = () => {
        const secciones = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('seccion-')) {
                const seccionData = JSON.parse(localStorage.getItem(key));
                if (seccionData.id) {
                    secciones.push(seccionData);
                }
            }
        }

        const contenedor = document.getElementById('body');
        const existingSecciones = contenedor.querySelectorAll('.div_seccion');

        if (existingSecciones.length === 0) {
            secciones.sort((a, b) => a.id - b.id);

            for (const seccionData of secciones) {
                const nuevoDiv = document.createElement('div');
                nuevoDiv.className = 'div_seccion';
                nuevoDiv.innerHTML = seccionData.contenido;
                nuevoDiv.dataset.id = seccionData.id;

                contenedor.appendChild(nuevoDiv);

                this.loadTarjetas(seccionData.id); // Cargar tarjetas para esta sección
            }
        }

        if (secciones.length > 0) {
            return secciones[secciones.length - 1].id;
        } else {
            return 0;
        }
    }

    addEventListeners = () => {
        document.getElementById('btn_seccion').addEventListener('click', this.crearSeccion);
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn_borrar')) {
                this.borrarSeccion(event);
            }
        });
    }

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
                    btnAgregar.classList.add('btn_agregar');

                    const btnBorrar = document.createElement('button');
                    btnBorrar.textContent = 'Borrar Sección';
                    btnBorrar.classList.add('btn_borrar');

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

                    // Asignar ID numérico autoincremental
                    const seccionId = this.seccionCounter++;
                    nuevoDiv.dataset.id = seccionId;

                    const mensaje = `Ya puede crear tarjetas en la sección <b>${seccionNombre}</b>`;
                    Swal.fire('Sección Creada', mensaje);

                    // Guardar en Local Storage
                    const seccionData = {
                        id: seccionId,
                        nombre: seccionNombre,
                        contenido: nuevoDiv.innerHTML
                    };

                    localStorage.setItem(`seccion-${seccionId}`, JSON.stringify(seccionData));
                } else {
                    Swal.fire('Error', 'Debes ingresar un nombre de sección válido', 'error');
                }
            }
        });
    }

    borrarSeccion = (event) => {
        const seccionDiv = event.target.closest('.div_seccion');
        if (seccionDiv) {
            const seccionId = seccionDiv.dataset.id;
    
            // Eliminar tarjetas del Local Storage
            localStorage.removeItem(`seccion-${seccionId}-tarjetas`);
    
            // Eliminar el contador de tarjetas del Local Storage
            localStorage.removeItem(`seccion-${seccionId}-tarjeta-counter`);
    
            // Eliminar la sección del Local Storage
            localStorage.removeItem(`seccion-${seccionId}`);
    
            // Eliminar la sección del DOM
            seccionDiv.remove();
    
            this.alertaEliminar('Sección Eliminada.');
        }
    }
    
    
    //Editar - Agregar Tarjetas.
   // ...
   agregarTarjeta = (seccionId) => {
    const seccionDiv = document.querySelector(`[data-id="${seccionId}"]`);
    if (seccionDiv) {
        const tarjetasContainer = seccionDiv.querySelector('.tarjetas-container');

        if (!tarjetasContainer) {
            const nuevoTarjetasContainer = document.createElement('div');
            nuevoTarjetasContainer.className = 'tarjetas-container';
            seccionDiv.insertBefore(nuevoTarjetasContainer, seccionDiv.querySelector('.btn-container'));
        }

        // Obtener el contador de tarjetas para la sección actual del Local Storage
        let tarjetaCounter = parseInt(localStorage.getItem(`seccion-${seccionId}-tarjeta-counter`) || '0', 10);

        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'card';

        const nuevoCardHeader = document.createElement('h5');
        nuevoCardHeader.className = 'card-header';
        nuevoCardHeader.textContent = 'Título de la carta';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const nuevoCardText = document.createElement('p');
        nuevoCardText.className = 'card-text';
        nuevoCardText.textContent = 'Contenido del párrafo';

        const editarBtn = document.createElement('a');
        editarBtn.href = '#';
        editarBtn.className = 'btn btn-primary';
        editarBtn.textContent = 'Editar';
        editarBtn.addEventListener('click', this.editarTarjeta);

        const eliminarBtn = document.createElement('a');
        eliminarBtn.href = '#';
        eliminarBtn.className = 'btn btn-danger btn_eliminar_tarjeta';
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.dataset.cardId = `tarjeta-${seccionId}-${tarjetaCounter}`; // Asignar el ID de la tarjeta como atributo de datos
        eliminarBtn.addEventListener('click', (event) => this.eliminarTarjeta(event, seccionId));

        cardBody.appendChild(nuevoCardText);
        cardBody.appendChild(editarBtn);
        cardBody.appendChild(eliminarBtn);

        nuevaTarjeta.appendChild(nuevoCardHeader);
        nuevaTarjeta.appendChild(cardBody);

        const cardId = `tarjeta-${seccionId}-${tarjetaCounter}`;
        nuevaTarjeta.dataset.id = cardId;
        tarjetasContainer.appendChild(nuevaTarjeta);

        // Incrementar el contador de tarjetas
        tarjetaCounter++;
        localStorage.setItem(`seccion-${seccionId}-tarjeta-counter`, tarjetaCounter.toString());

        const tarjetaData = {
            id: cardId,
            titulo: nuevoCardHeader.textContent,
            contenido: nuevoCardText.textContent
        };

        // Crear un JSON individual para cada tarjeta
        localStorage.setItem(cardId, JSON.stringify(tarjetaData));
    }
}

    eliminarTarjeta = (event, seccionId) => {
        const eliminarBtn = event.target.closest('.btn_eliminar_tarjeta');
        if (eliminarBtn) {
            const tarjetaId = eliminarBtn.dataset.cardId; // Obtener el ID de la tarjeta desde el atributo de datos
            if (tarjetaId) {
                // Eliminar la tarjeta del Local Storage
                localStorage.removeItem(tarjetaId);

                // Eliminar la tarjeta del DOM
                const tarjetaDiv = eliminarBtn.closest('.card');
                if (tarjetaDiv) {
                    tarjetaDiv.remove();

                    // Volver a cargar las tarjetas actualizadas desde el Local Storage
                    this.loadTarjetas(seccionId);

                    // Mostrar una alerta de eliminación exitosa
                    this.alertaEliminar('Tarjeta Eliminada.');
                }
            } else {
                console.log('No se pudo obtener el ID de la tarjeta.');
            }
        }
    }
        


    getTarjetaId = (seccionId) => {
        const seccionIdNum = parseInt(seccionId);
        const tarjetasData = JSON.parse(localStorage.getItem(`seccion-${seccionIdNum}-tarjetas`)) || [];

        if (tarjetasData.length === 0) {
            return `tarjeta-${seccionId}-0`; // Si no hay tarjetas, empezar desde el ID 0
        }

        const maxId = tarjetasData.reduce((max, tarjeta) => {
            const tarjetaIdNum = parseInt(tarjeta.id.split('-').pop());
            return Math.max(max, tarjetaIdNum);
        }, -1);

        return `tarjeta-${seccionId}-${maxId + 1}`; // Devolver el siguiente ID disponible
    }

    loadTarjetas = (seccionId) => {
        const seccionDiv = document.querySelector(`[data-id="${seccionId}"]`);
        if (seccionDiv) {
            let tarjetasContainer = seccionDiv.querySelector('.tarjetas-container');
            if (!tarjetasContainer) {
                tarjetasContainer = document.createElement('div');
                tarjetasContainer.className = 'tarjetas-container';
                seccionDiv.insertBefore(tarjetasContainer, seccionDiv.querySelector('.btn-container'));
            }
    
            // Limpiar contenido anterior del contenedor de tarjetas
            tarjetasContainer.innerHTML = '';
    
            // Obtener todas las claves del Local Storage
            const keys = Object.keys(localStorage);
    
            // Filtrar las claves que corresponden a tarjetas y pertenecen a la sección actual
            const tarjetaKeys = keys.filter(key => key.startsWith(`tarjeta-${seccionId}-`));
    
            // Agregar tarjetas desde el Local Storage
            for (const tarjetaKey of tarjetaKeys) {
                const tarjetaData = JSON.parse(localStorage.getItem(tarjetaKey));
                const nuevaTarjeta = document.createElement('div');
                nuevaTarjeta.className = 'card';
                nuevaTarjeta.innerHTML = `
                    <h5 class="card-header">${tarjetaData.titulo}</h5>
                    <div class="card-body">
                        <p class="card-text">${tarjetaData.contenido}</p>
                        <a href="#" class="btn btn-primary">Editar</a>
                        <a href="#" class="btn btn-danger btn_eliminar_tarjeta" data-card-id="${tarjetaData.id}">Eliminar</a>
                    </div>
                `;
    
                tarjetasContainer.appendChild(nuevaTarjeta);
            }
        }
    }
        
    alertaEliminar = (secOtarjeta) => {
        Swal.fire(
            secOtarjeta,
            ``,
            'success'
          )
    }
    
}

export default SweetAlert;
