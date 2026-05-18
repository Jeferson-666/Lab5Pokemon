
import { Servicios } from './servicios/Servicios.js';
import { Pokemon } from './modelos/Pokemon.js';7
import { iniciarEventosBusqueda } from './eventos/eventosBusqueda.js';
import { iniciarEventoGuardado } from './eventos/eventoGuardado.js';
import { Renderizar } from './ui/Renderizar.js';

const btnBuscar = document.getElementById('btnBuscar');
const btnGuardar = document.getElementById('btnGuardar');
const inputNombrePokemon = document.getElementById('pokemonName');
const sectionInfoPokemon = document.getElementById('infoPokemon');
let pokemonActual = null;

async function buscarPokemon(nombre) {

    sectionInfoPokemon.innerHTML = `<div class="spinner"></div>`;
    sectionInfoPokemon.className = 'info-pokemon';

    console.log("Buscando Pokémon:", nombre);
    try {
        const datos = await Servicios.obtenerPokemon(nombre);
        pokemonActual = Pokemon.datosAPokemon(datos);
        mostrarInfoPokemon(pokemonActual);
    } catch (error) {
        pokemonActual = null;
        sectionInfoPokemon.innerHTML = '<p>Ocurrió un error o el Pokémon no existe.</p>';
        sectionInfoPokemon.style.backgroundColor = 'white';
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
        sectionInfoPokemon.innerHTML = '<p>Pokémon guardado exitosamente.</p>';
        sectionInfoPokemon.style.backgroundColor = 'lightgreen';
    }catch (error) {
        sectionInfoPokemon.innerHTML = '<p>Error al guardar el Pokémon.</p>';
        sectionInfoPokemon.style.backgroundColor = 'lightcoral';
        console.log("Error al guardar Pokémon:", error);
    }
}

function mostrarInfoPokemon(pokemon) {
    sectionInfoPokemon.style.backgroundColor = 'white';
    sectionInfoPokemon.innerHTML = Renderizar.crearTarjeta(pokemon);
}

//agregamos todos los eventos a partir de esta linea
iniciarEventosBusqueda(btnBuscar, inputNombrePokemon, buscarPokemon, sectionInfoPokemon);
iniciarEventoGuardado(btnGuardar, guardarPokemon);

