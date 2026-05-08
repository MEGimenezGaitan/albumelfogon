let figuritas = [];
let paginaActual = 1;

const botonMostrar = document.getElementById('mostrarSobres');
const botonReiniciar =
document.getElementById('reiniciarAlbum');

const sobreDiv = document.getElementById('sobre');
const albumDiv = document.getElementById('album');

const repetidasDiv =
document.getElementById('repetidas');

const botonAnterior =
document.getElementById('anterior');

const botonSiguiente =
document.getElementById('siguiente');

const tituloPagina =
document.getElementById('tituloPagina');

// álbum guardado
let album =
JSON.parse(localStorage.getItem('album')) || {};

// cargar figuritas
async function cargarFiguritas() {

    const respuesta =
    await fetch('figuritas.json');

    figuritas =
    await respuesta.json();

    mostrarAlbum();

    mostrarRepetidas();
}

// guardar
function guardarAlbum() {

    localStorage.setItem(
        'album',
        JSON.stringify(album)
    );
}

// probabilidades
function obtenerFiguritaRandom() {

    const numero =
    Math.random() * 100;

    let rarezaElegida;

    if(numero < 70){

        rarezaElegida = 'comun';

    }else if(numero < 90){

        rarezaElegida = 'rara';

    }else if(numero < 98){

        rarezaElegida = 'epica';

    }else{

        rarezaElegida = 'legendaria';
    }

    const posibles =
    figuritas.filter(
        figu =>
        figu.rareza === rarezaElegida
    );

    if(posibles.length === 0){

        return figuritas[
            Math.floor(
                Math.random() *
                figuritas.length
            )
        ];
    }

    return posibles[
        Math.floor(
            Math.random() *
            posibles.length
        )
    ];
}

// imagen blur
function crearImagen(imagen) {

    return `
        <div class="img-container">

            <div
                class="img-fondo"
                style="
                    background-image:
                    url('${imagen}')
                ">
            </div>

            <img src="${imagen}">

        </div>
    `;
}

// ampliar carta
function abrirCarta(imagen) {

    const visor =
    document.getElementById(
        'visorCarta'
    );

    const img =
    document.getElementById(
        'imagenAmpliada'
    );

    img.src = imagen;

    visor.classList.remove('oculto');
}

// mostrar álbum
function mostrarAlbum() {

    albumDiv.innerHTML = '';

    tituloPagina.textContent =
    `Página ${paginaActual}`;

    const figuritasPagina =
    figuritas.filter(
        figu =>
        figu.pagina === paginaActual
    );

    figuritasPagina.forEach(figu => {

        const obtenida =
        album[figu.id];

        albumDiv.innerHTML += `
            <div
                class="
                    carta
                    ${figu.rareza}
                    ${obtenida ? '' : 'bloqueada'}
                "

                ${
                    obtenida
                    ?
                    `
                    onclick="
                        abrirCarta(
                            '${figu.imagen}'
                        )
                    "
                    `
                    :
                    ''
                }
            >

                ${
                    obtenida
                    ?
                    crearImagen(figu.imagen)
                    :
                    `
                    <div class="placeholder">
                        ?
                    </div>
                    `
                }

                <p>
                    #${figu.id}
                </p>

            </div>
        `;
    });
}

// repetidas
function mostrarRepetidas() {

    repetidasDiv.innerHTML = '';

    figuritas.forEach(figu => {

        const cantidad =
        album[figu.id] || 0;

        if(cantidad > 1){

            repetidasDiv.innerHTML += `
                <div
                    class="
                        carta
                        ${figu.rareza}
                    "
                >

                    ${crearImagen(figu.imagen)}

                    <p>
                        x${cantidad - 1}
                    </p>

                </div>
            `;
        }
    });
}

// mostrar sobres
function mostrarSobres() {

    const overlay =
    document.getElementById(
        'overlaySobres'
    );

    const contenedor =
    document.getElementById(
        'contenedorSobres'
    );

    contenedor.innerHTML = '';

    overlay.classList.remove(
        'oculto'
    );

    for(let i = 0; i < 3; i++) {

        const sobre =
        document.createElement('div');

        sobre.classList.add(
            'sobre-cerrado'
        );

        sobre.innerHTML = `
            <img src="images/sobre.png">
        `;

        sobre.addEventListener(
            'click',
            () => {

                overlay.classList.add(
                    'oculto'
                );

                abrirSobre();
            }
        );

        contenedor.appendChild(
            sobre
        );
    }
}

// abrir sobre
function abrirSobre() {

    sobreDiv.innerHTML = '';

    for(let i = 0; i < 3; i++) {

        const random =
        obtenerFiguritaRandom();

        const repetida =
        album[random.id];

        sobreDiv.innerHTML += `
            <div
                class="
                    carta
                    ${random.rareza}
                "
            >

                ${crearImagen(random.imagen)}

                <p>
                    ${random.nombre}
                </p>

                ${
                    repetida
                    ?
                    `
                    <span class="repetida">
                        REPETIDA
                    </span>
                    `
                    :
                    `
                    <span class="nueva">
                        NUEVA
                    </span>
                    `
                }

            </div>
        `;

        // guardar cantidad
        if(album[random.id]){

            album[random.id]++;

        }else{

            album[random.id] = 1;
        }
    }

    guardarAlbum();

    mostrarAlbum();

    mostrarRepetidas();
}

// botón sobres
botonMostrar.addEventListener(
    'click',
    mostrarSobres
);

// iniciar
cargarFiguritas();

// cerrar visor
document
.getElementById('visorCarta')
.addEventListener(
    'click',
    () => {

        document
        .getElementById(
            'visorCarta'
        )
        .classList.add(
            'oculto'
        );
    }
);

// página anterior
botonAnterior.addEventListener(
    'click',
    () => {

        if(paginaActual > 1){

            paginaActual--;

            mostrarAlbum();
        }
    }
);

// página siguiente
botonSiguiente.addEventListener(
    'click',
    () => {

        const maxPagina =
        Math.max(
            ...figuritas.map(
                f => f.pagina
            )
        );

        if(paginaActual < maxPagina){

            paginaActual++;

            mostrarAlbum();
        }
    }
);

botonReiniciar.addEventListener(
    'click',
    () => {

        const confirmar =
        confirm(
            '¿Reiniciar todo el álbum?'
        );

        if(confirmar){

            localStorage.clear();

            location.reload();
        }
    }
);

document
.getElementById('verRepetidas')
.addEventListener('click', () => {

    document
    .getElementById('overlayRepetidas')
    .classList.remove('oculto');
});

document
.getElementById('overlayRepetidas')
.addEventListener('click', () => {

    document
    .getElementById('overlayRepetidas')
    .classList.add('oculto');
});