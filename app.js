let figuritas = [];
let paginaActual = 1;
let cartasPendientes = [];

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

function actualizarProgreso() {

    const total = figuritas.length;

    const obtenidas =
    Object.keys(album).length;

    const porcentaje =
    Math.floor(
        (obtenidas / total) * 100
    );

    document
    .getElementById('textoProgreso')
    .textContent =
    `${obtenidas} / ${total} (${porcentaje}%)`;

    document
    .getElementById('barraProgreso')
    .style.width =
    `${porcentaje}%`;
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

    actualizarProgreso();
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

                abrirAnimacionSobre(sobre);
            }
        );

        contenedor.appendChild(sobre);
    }
}

function abrirAnimacionSobre(sobre) {

    const overlay =
    document.getElementById(
        'overlaySobres'
    );

    // evita múltiples clicks
    document
    .querySelectorAll('.sobre-cerrado')
    .forEach(s => {

        s.style.pointerEvents = 'none';
    });

    // animación
    sobre.classList.add(
        'sobre-abriendo'
    );

    // esperar animación
    setTimeout(() => {

        overlay.classList.add(
            'oculto'
        );

        abrirSobre();

    }, 1200);
}

// flash legendario
function activarFlashLegendario() {

    const flash =
    document.getElementById(
        'flashLegendario'
    );

    flash.classList.remove(
        'flash-activo'
    );

    void flash.offsetWidth;

    flash.classList.add(
        'flash-activo'
    );
}

// abrir sobre
function abrirSobre() {

    sobreDiv.innerHTML = '';

    document
    .getElementById('mensajePegado')
    .classList.remove('oculto');

    cartasPendientes = [];

    let cartasHTML = '';

    for(let i = 0; i < 3; i++) {

        const random =
        obtenerFiguritaRandom();
        
        if(random.rareza === 'legendaria'){

            activarFlashLegendario();
        }

        cartasPendientes.push(random);

        const repetida =
        album[random.id];

        cartasHTML += `
            <div
                class="
                    carta
                    carta-flip
                    ${random.rareza}
                    figura-oculta
                    ${
                        random.rareza === 'rara'
                        ? 'reveal-rara'
                        :
                        random.rareza === 'epica'
                        ? 'reveal-epica'
                        :
                        random.rareza === 'legendaria'
                        ? 'reveal-legendaria'
                        :
                        ''
                    }
                "

                id="carta-${i}"

                style="
                    animation-delay:${i * 0.5}s;
                "

                onclick="
                    pegarFigurita(${i})
                "
            >

                <div class="flip-inner">

                    <!-- PARTE TRASERA -->
                    <div class="flip-back">

                        <img
                            src="images/dorso.png"
                            class="img-dorso"
                        >

                    </div>

                    <!-- PARTE DELANTERA -->
                    <div class="flip-front">

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

                </div>

            </div>
        `;
    }

    sobreDiv.innerHTML = cartasHTML;
}

// pegar figuritas
function pegarFigurita(indice) {

    const carta =
    document.getElementById(
        `carta-${indice}`
    );

    if(!carta) return;

    const figurita =
    cartasPendientes[indice];

    carta.classList.add(
        'pegando'
    );

    setTimeout(() => {

        if(album[figurita.id]){

            album[figurita.id]++;

        }else{

            album[figurita.id] = 1;
        }

        guardarAlbum();

        mostrarAlbum();

        mostrarRepetidas();

        carta.remove();

        setTimeout(() => {

            if(sobreDiv.children.length === 0){

                document
                .getElementById('mensajePegado')
                .classList.add('oculto');
            }

        }, 50);

    }, 700);
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