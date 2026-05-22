import { Servicios } from './servicios/Servicios.js';
import { Pokemon } from './modelos/Pokemon.js';
import { iniciarEventosBusqueda } from './eventos/eventosBusqueda.js';
import { iniciarEventoGuardado } from './eventos/eventoGuardado.js';
import { Renderizar } from './ui/Renderizar.js';

// Referencias a los elementos principales del HTML.
const btnBuscar = document.getElementById('btnBuscar');
const btnGuardar = document.getElementById('btnGuardar');
const inputNombrePokemon = document.getElementById('pokemonName');
const sectionInfoPokemon = document.getElementById('infoPokemon');
const botonesVista = document.querySelectorAll('.opcion-header');
const vistas = document.querySelectorAll('.vista');

// Variable para guardar temporalmente el Pokemon encontrado para poder enviarlo luego a la base de datos.
let pokemonActual = null;

// Busca un Pokemon en la PokeAPI usando el nombre ingresado.
async function buscarPokemon(nombre) {
    // Muestra un indicador de carga mientras se espera la respuesta de la API.
    sectionInfoPokemon.innerHTML = '<div class="spinner"></div>';
    sectionInfoPokemon.className = 'info-pokemon';

    try {
        // Se obtienen los datos desde la PokeAPI y se convierten al modelo Pokemon del proyecto.
        const datos = await Servicios.obtenerPokemon(nombre);
        pokemonActual = Pokemon.datosAPokemon(datos);

        // Se muestra la informacion del Pokemon encontrado en pantalla.
        mostrarInfoPokemon(pokemonActual);
    } catch (error) {
        // Si ocurre un error, se limpia el Pokemon actual y se muestra un mensaje al usuario.
        pokemonActual = null;
        sectionInfoPokemon.innerHTML = '<p>Ocurrio un error o el Pokemon no existe.</p>';
        sectionInfoPokemon.style.backgroundColor = 'white';
        console.log('Error al buscar Pokemon:', error);
    }
}

// Guarda en la base de datos el ultimo Pokemon consultado.
async function guardarPokemon() {
    // No se puede guardar si primero no se busco un Pokemon.
    if (!pokemonActual) {
        alert('Primero debes buscar un Pokemon.');
        return;
    }

    try {
        // Se envia a la API propia solo la informacion necesaria para registrar el Pokemon.
        const resultado = await Servicios.guardarPokemon(pokemonActual.convertirAJSON());
        alert(resultado);
    } catch (error) {
        alert('Error al guardar el Pokemon.');
        console.log('Error al guardar Pokemon:', error);
    }
}

// Renderiza la tarjeta visual del Pokemon dentro de la seccion de informacion.
function mostrarInfoPokemon(pokemon) {
    sectionInfoPokemon.style.backgroundColor = 'white';
    sectionInfoPokemon.innerHTML = Renderizar.crearTarjeta(pokemon);
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

// Se conectan los eventos separados para buscar y guardar Pokemon.
iniciarEventosBusqueda(btnBuscar, inputNombrePokemon, buscarPokemon, sectionInfoPokemon);
iniciarEventoGuardado(btnGuardar, guardarPokemon);
