
import { Servicios } from './servicios/Servicios.js';
import { Pokemon } from './modelos/Pokemon.js'; 7
import { iniciarEventosBusqueda } from './eventos/eventosBusqueda.js';
import { iniciarEventoGuardado } from './eventos/eventoGuardado.js';
import { Renderizar } from './ui/Renderizar.js';

const btnBuscar = document.getElementById('btnBuscar');
const btnGuardar = document.getElementById('btnGuardar');
const inputNombrePokemon = document.getElementById('pokemonName');
const sectionInfoPokemon = document.getElementById('infoPokemon');
const botonesVista = document.querySelectorAll('.opcion-header');
const vistas = document.querySelectorAll('.vista');
let pokemonActual = null;
let temporizadorLimpiezaInfo = null;

function limpiarSectionInfoPokemon() {
    if (temporizadorLimpiezaInfo) {
        clearTimeout(temporizadorLimpiezaInfo);
    }
    temporizadorLimpiezaInfo = setTimeout(() => {
        sectionInfoPokemon.innerHTML = 'Información de Pokémon';
        sectionInfoPokemon.style.backgroundColor = 'white';
    }, 2000);
}

async function buscarPokemon(nombre) {

    sectionInfoPokemon.innerHTML = `<div class="spinner"></div>`;
    sectionInfoPokemon.className = 'info-pokemon';

    try {
        const datos = await Servicios.obtenerPokemon(nombre);
        pokemonActual = Pokemon.datosAPokemon(datos);
        mostrarInfoPokemon(pokemonActual);
    } catch (error) {
        pokemonActual = null;
        sectionInfoPokemon.innerHTML = '<p>Ocurrió un error o el Pokémon no existe.</p>';
        sectionInfoPokemon.style.backgroundColor = 'white';
        limpiarSectionInfoPokemon();
    }
}

async function guardarPokemon() {
    if (!pokemonActual) {
        sectionInfoPokemon.innerHTML = '<p>Primero debes buscar un Pokémon.</p>';
        sectionInfoPokemon.style.backgroundColor = 'white';
        return;
    }
    try {
        const resultado = await Servicios.guardarPokemon(pokemonActual.convertirAJSON());
        if (resultado && resultado.success) {
            sectionInfoPokemon.innerHTML = '</p>' + pokemonActual.nombre + '</p>' + '<p>Success: ' + resultado.mensaje + '</p>';
            sectionInfoPokemon.style.backgroundColor = 'lightgreen';
        } else {//x003
            sectionInfoPokemon.innerHTML = '</p>' + pokemonActual.nombre + '</p>' + '<p>Error: ' + (resultado.mensaje || 'Desconocido');
            sectionInfoPokemon.style.backgroundColor = '#ffc0c0'; // lightcoral
        }
    } catch (error) {//x002
        sectionInfoPokemon.innerHTML = '<p>Error al guardar el Pokemon (x002).</p>';
        sectionInfoPokemon.style.backgroundColor = '#ffc0c0'; // lightcoral
        console.error("Error al guardar Pokemon (x002):", error);
    }
    limpiarSectionInfoPokemon();
    pokemonActual = null; // Reiniciamos el Pokémon actual después de intentar guardar
}

function mostrarInfoPokemon(pokemon) {
    sectionInfoPokemon.style.backgroundColor = 'white';
    sectionInfoPokemon.innerHTML = Renderizar.crearTarjeta(pokemon);
    limpiarSectionInfoPokemon();
}

// Cambia entre las vistas del index: consumir PokeAPI o probar la API propia.
function cambiarVista(idVista) {
    vistas.forEach(vista => {
        vista.classList.toggle('activa', vista.id === idVista);
    });

    botonesVista.forEach(boton => {
        boton.classList.toggle('activo', boton.dataset.vista === idVista);
    });
}

// Obtiene el valor limpio de un input usando su id.
function valorInput(id) {
    return document.getElementById(id).value.trim();
}

// Arma un objeto con los datos de los formularios POST o PUT.
function datosFormulario(prefijo) {
    return {
        nombre: valorInput(`${prefijo}Nombre`),
        tipo: valorInput(`${prefijo}Tipo`),
        habilidad: valorInput(`${prefijo}Habilidad`),
        primer_movimiento: valorInput(`${prefijo}Movimiento`)
    };
}

// Muestra en pantalla la respuesta de la API con formato JSON legible.
function pintarResultado(id, datos) {
    document.getElementById(id).textContent = JSON.stringify(datos, null, 2);
}

// Ejecuta una prueba contra la API propia usando el metodo indicado.
async function probarApiPropia(metodo, resultadoId, datos = null, nombre = '') {
    // Mensaje temporal mientras se recibe la respuesta del servidor.
    pintarResultado(resultadoId, 'Cargando...');

    try {
        // Se llama al servicio encargado de comunicarse con api_rest.php.
        const respuesta = await Servicios.probarApiPropia(metodo, datos, nombre);
        pintarResultado(resultadoId, respuesta);
    } catch (error) {
        // Si falla la solicitud completa, se muestra el detalle del error.
        pintarResultado(resultadoId, {
            error: 'No se pudo completar la solicitud',
            detalle: error.message
        });
    }
}

// Eventos para cambiar de vista desde los botones del encabezado.
botonesVista.forEach(boton => {
    boton.addEventListener('click', () => cambiarVista(boton.dataset.vista));
});

// Prueba GET: consulta todos los Pokemon o uno especifico si se escribe un nombre.
document.getElementById('btnGetApi').addEventListener('click', () => {
    probarApiPropia('GET', 'resultadoGet', null, valorInput('getNombre'));
});

// Prueba POST: crea un Pokemon usando los datos escritos en el formulario.
document.getElementById('btnPostApi').addEventListener('click', () => {
    probarApiPropia('POST', 'resultadoPost', datosFormulario('post'));
});

// Prueba PUT: actualiza un Pokemon existente usando su nombre.
document.getElementById('btnPutApi').addEventListener('click', () => {
    probarApiPropia('PUT', 'resultadoPut', datosFormulario('put'));
});

// Prueba DELETE: elimina un Pokemon por nombre.
document.getElementById('btnDeleteApi').addEventListener('click', () => {
    probarApiPropia('DELETE', 'resultadoDelete', null, valorInput('deleteNombre'));
});

//agregamos todos los eventos a partir de esta linea
iniciarEventosBusqueda(btnBuscar, inputNombrePokemon, buscarPokemon, sectionInfoPokemon);
iniciarEventoGuardado(btnGuardar, guardarPokemon);

