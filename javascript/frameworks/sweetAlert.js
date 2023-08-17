

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

        const tarjetaId = this.getTarjetaId(seccionId); // Obtener un ID único para la tarjeta
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'card';
        nuevaTarjeta.innerHTML = `
            <h5 class="card-header">Título de la carta</h5>
            <div class="card-body">
                <h5 class="card-title">Título del contenido</h5>
                <p class="card-text">Contenido del párrafo</p>
                <a href="#" class="btn btn-primary">Editar</a>
            </div>
        `;

        nuevaTarjeta.dataset.id = tarjetaId; // Asignar el ID a la tarjeta
        tarjetasContainer.appendChild(nuevaTarjeta);
        this.saveTarjetas(seccionId);
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
            titulo: tarjeta.querySelector('.card-title').textContent,
            contenido: tarjeta.querySelector('.card-text').textContent
        }));

        localStorage.setItem(`seccion-${seccionIdNum}-tarjetas`, JSON.stringify(tarjetasData));
    }

    loadTarjetas = (seccionId) => {
        const seccionDiv = document.querySelector(`[data-id="${seccionId}"]`);
        if (seccionDiv) {
            const tarjetasData = JSON.parse(localStorage.getItem(`seccion-${seccionId}-tarjetas`)) || [];
            const tarjetasContainer = seccionDiv.querySelector('.tarjetas-container');
    
            if (tarjetasContainer) {
                tarjetasContainer.innerHTML = ''; // Limpiar contenido anterior
    
                for (const tarjetaData of tarjetasData) {
                    const nuevaTarjeta = document.createElement('div');
                    nuevaTarjeta.className = 'card';
                    nuevaTarjeta.innerHTML = `
                        <h5 class="card-header">${tarjetaData.titulo}</h5>
                        <div class="card-body">
                            <h5 class="card-title">${tarjetaData.titulo}</h5>
                            <p class="card-text">${tarjetaData.contenido}</p>
                            <a href="#" class="btn btn-primary">Editar</a>
                        </div>
                    `;
    
                    tarjetasContainer.appendChild(nuevaTarjeta);
                }
            } else {
                const nuevoTarjetasContainer = document.createElement('div');
                nuevoTarjetasContainer.className = 'tarjetas-container';
    
                for (const tarjetaData of tarjetasData) {
                    const nuevaTarjeta = document.createElement('div');
                    nuevaTarjeta.className = 'card';
                    nuevaTarjeta.innerHTML = `
                        <h5 class="card-header">${tarjetaData.titulo}</h5>
                        <div class="card-body">
                            <h5 class="card-title">${tarjetaData.titulo}</h5>
                            <p class="card-text">${tarjetaData.contenido}</p>
                            <a href="#" class="btn btn-primary">Editar</a>
                        </div>
                    `;
    
                    nuevoTarjetasContainer.appendChild(nuevaTarjeta);
                }
    
                seccionDiv.insertBefore(nuevoTarjetasContainer, seccionDiv.querySelector('.btn-container'));
            }
        }
    }
    

    editarTarjeta = (event) => {
        const tarjetaDiv = event.target.closest('.card');
        if (tarjetaDiv) {
            const tituloContenido = tarjetaDiv.querySelector('.card-title');
            const parrafoContenido = tarjetaDiv.querySelector('.card-text');

            Swal.fire({
                title: 'Editar Tarjeta',
                html: `
                    <input id="inputTitulo" class="swal2-input" value="${tituloContenido.textContent}" placeholder="Título del contenido">
                    <input id="inputParrafo" class="swal2-input" value="${parrafoContenido.textContent}" placeholder="Contenido del párrafo">
                `,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const nuevoTitulo = document.getElementById('inputTitulo').value;
                    const nuevoParrafo = document.getElementById('inputParrafo').value;

                    tituloContenido.textContent = nuevoTitulo;
                    parrafoContenido.textContent = nuevoParrafo;
                }
            });
        }
    }
}

export default SweetAlert;
