
import { Servicios } from './servicios/Servicios.js';
import { Pokemon } from './modelos/Pokemon.js'; 7
import { iniciarEventosBusqueda } from './eventos/eventosBusqueda.js';
import { iniciarEventoGuardado } from './eventos/eventoGuardado.js';
import { Renderizar } from './ui/Renderizar.js';

const btnBuscar = document.getElementById('btnBuscar');
const btnGuardar = document.getElementById('btnGuardar');
const inputNombrePokemon = document.getElementById('pokemonName');
const sectionInfoPokemon = document.getElementById('infoPokemon');
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
            sectionInfoPokemon.innerHTML = '</p>'+ pokemonActual.nombre+'</p>' + '<p>Success: ' + resultado.mensaje + '</p>';
            sectionInfoPokemon.style.backgroundColor = 'lightgreen';
        } else {//x003
            sectionInfoPokemon.innerHTML = '</p>'+ pokemonActual.nombre+'</p>' + '<p>Error: ' + (resultado.mensaje || 'Desconocido');
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

//agregamos todos los eventos a partir de esta linea
iniciarEventosBusqueda(btnBuscar, inputNombrePokemon, buscarPokemon, sectionInfoPokemon);
iniciarEventoGuardado(btnGuardar, guardarPokemon);

