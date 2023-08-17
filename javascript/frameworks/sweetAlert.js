

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
            localStorage.removeItem(`seccion-${seccionId}`);
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

        const tarjetasData = JSON.parse(localStorage.getItem(`seccion-${seccionId}-tarjetas`)) || [];
        const tarjetaId = this.getTarjetaId(seccionId); // Obtener un ID único para la tarjeta

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

        const eliminarBtn = document.createElement('a'); // Agregamos un botón de eliminar
        eliminarBtn.href = '#';
        eliminarBtn.className = 'btn btn-danger btn_eliminar_tarjeta'; // Asignar clase al botón
        eliminarBtn.textContent = 'Eliminar';

        cardBody.appendChild(nuevoCardText);
        cardBody.appendChild(editarBtn);
        cardBody.appendChild(eliminarBtn); // Agregamos el botón de eliminar a la tarjeta

        nuevaTarjeta.appendChild(nuevoCardHeader);
        nuevaTarjeta.appendChild(cardBody);

        const cardId = `tarjeta-${seccionId}-${tarjetaId}`; // Crear un ID único para la tarjeta
        nuevaTarjeta.dataset.id = cardId; // Asignar el ID a la tarjeta
        tarjetasContainer.appendChild(nuevaTarjeta);
    
        // Guardar en el Local Storage
        tarjetasData.push({
            id: cardId,
            titulo: nuevoCardHeader.textContent,
            contenido: nuevoCardText.textContent
        });
    
        localStorage.setItem(`seccion-${seccionId}-tarjetas`, JSON.stringify(tarjetasData));
    
    }
}


eliminarTarjeta = (event) => {
    const eliminarBtn = event.target.closest('.btn_eliminar_tarjeta');
    if (eliminarBtn) {
        const tarjetaDiv = eliminarBtn.closest('.card');
        if (tarjetaDiv) {
            const seccionDiv = tarjetaDiv.closest('.div_seccion');
            if (seccionDiv) {
                const seccionId = seccionDiv.dataset.id;
                const tarjetaId = tarjetaDiv.dataset.id;

                // Eliminar tarjeta del DOM
                tarjetaDiv.remove();

                // Actualizar Local Storage eliminando la tarjeta específica
                const tarjetasData = JSON.parse(localStorage.getItem(`seccion-${seccionId}-tarjetas`)) || [];
                const tarjetasActualizadas = tarjetasData.filter(tarjeta => tarjeta.id !== tarjetaId);
                localStorage.setItem(`seccion-${seccionId}-tarjetas`, JSON.stringify(tarjetasActualizadas));

                console.log('Local Storage actualizado después de eliminar tarjeta:', localStorage.getItem(`seccion-${seccionId}-tarjetas`));
            }
        }
    }
}





    getTarjetaId = (seccionId) => {
        const seccionIdNum = parseInt(seccionId);
        const tarjetasData = JSON.parse(localStorage.getItem(`seccion-${seccionIdNum}-tarjetas`)) || [];
        return tarjetasData.length + 1; // Devolver el siguiente ID disponible
    }


    saveTarjetas = (seccionId) => {
        const seccionIdNum = parseInt(seccionId);
        const tarjetasContainer = document.querySelector(`[data-id="${seccionId}"] .tarjetas-container`);
        const tarjetas = tarjetasContainer.querySelectorAll('.card');
    
        const tarjetasData = Array.from(tarjetas).map(tarjeta => ({
            titulo: tarjeta.querySelector('.card-header').textContent,
            contenido: tarjeta.querySelector('.card-text').textContent
        }));
    
        localStorage.setItem(`seccion-${seccionIdNum}-tarjetas`, JSON.stringify(tarjetasData));
    }

    loadTarjetas = (seccionId) => {
        const seccionIdNum = parseInt(seccionId);
        const tarjetasData = JSON.parse(localStorage.getItem(`seccion-${seccionIdNum}-tarjetas`)) || [];
    
        const seccionDiv = document.querySelector(`[data-id="${seccionId}"]`);
        if (seccionDiv) {
            let tarjetasContainer = seccionDiv.querySelector('.tarjetas-container');
            console.log('Tarjetas cargadas desde Local Storage:', tarjetasData);
            if (!tarjetasContainer) {
                tarjetasContainer = document.createElement('div');
                tarjetasContainer.className = 'tarjetas-container';
                seccionDiv.insertBefore(tarjetasContainer, seccionDiv.querySelector('.btn-container'));
            }
    
            // Limpiar contenido anterior del contenedor de tarjetas
            tarjetasContainer.innerHTML = '';
    
            // Agregar tarjetas desde el Local Storage
            for (const tarjetaData of tarjetasData) {
                const nuevaTarjeta = document.createElement('div');
                nuevaTarjeta.className = 'card';
                nuevaTarjeta.innerHTML = `
                    <h5 class="card-header">${tarjetaData.titulo}</h5>
                    <div class="card-body">
                        <p class="card-text">${tarjetaData.contenido}</p>
                        <a href="#" class="btn btn-primary">Editar</a>
                        <a href="#" class="btn btn-danger btn_eliminar_tarjeta">Eliminar</a>
                    </div>
                `;
    
                tarjetasContainer.appendChild(nuevaTarjeta);
            }
        }
    }
    
    

    editarTarjeta = (event) => {
        const tarjetaDiv = event.target.closest('.card');
        if (tarjetaDiv) {
            const cardHeader = tarjetaDiv.querySelector('.card-header');
            const cardText = tarjetaDiv.querySelector('.card-text');
    
            Swal.fire({
                title: 'Editar Tarjeta',
                html: `
                    <input id="inputHeader" class="swal2-input" value="${cardHeader.textContent}" placeholder="Título de la carta">
                    <input id="inputText" class="swal2-input" value="${cardText.textContent}" placeholder="Contenido del párrafo">
                `,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const nuevoHeader = document.getElementById('inputHeader').value;
                    const nuevoText = document.getElementById('inputText').value;
    
                    cardHeader.textContent = nuevoHeader;
                    cardText.textContent = nuevoText;
    
                    this.saveTarjetas(tarjetaDiv.closest('.div_seccion').dataset.id);
                }
            });
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
