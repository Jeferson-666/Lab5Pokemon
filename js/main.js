
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
    //Se pone el spinner de carga mientras responde la API
    sectionInfoPokemon.innerHTML = `<div class="spinner"></div>`;
    sectionInfoPokemon.className = 'info-pokemon';
    console.log("Buscando Pokémon:", nombre);
    try {
        const datos = await Servicios.obtenerPokemon(nombre);
        pokemonActual = Pokemon.datosAPokemon(datos);
        alert("Pokémon encontrado: \nnombre: " + pokemonActual.nombre + ". \ntipo: " + pokemonActual.tipo + ". \nhabilidad: " + pokemonActual.habilidad + ". \nprimer movimiento: " + pokemonActual.primer_movimiento);
        mostrarInfoPokemon(pokemonActual);
    } catch (error) {
        pokemonActual = null;
        sectionInfoPokemon.innerHTML = '<p>Ocurrió un error o el Pokémon no existe.</p>';
        sectionInfoPokemon.style.backgroundColor = 'white';
        console.log("Error al buscar Pokémon:", error);
    }
}

async function guardarPokemon() {
    if (!pokemonActual) {
        alert('Primero debes buscar un Pokémon.');
        return;
    }
    try {
        const resultado = await Servicios.guardarPokemon(pokemonActual.convertirAJSON());
        alert(resultado);
    }catch (error) {
        alert('Error al guardar el Pokémon.');
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

