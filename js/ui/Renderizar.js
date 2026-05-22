import { TipoColor } from '../modelos/TipoColor.js';

export class Renderizar {

    static traducirTipo(tipo) {
        const traducciones = {
            normal: 'Normal',
            fire: 'Fuego',
            water: 'Agua',
            electric: 'Electrico',
            grass: 'Planta',
            ice: 'Hielo',
            fighting: 'Lucha',
            poison: 'Veneno',
            ground: 'Tierra',
            flying: 'Volador',
            psychic: 'Psiquico',
            bug: 'Bicho',
            rock: 'Roca',
            ghost: 'Fantasma',
            dragon: 'Dragon',
            dark: 'Siniestro',
            steel: 'Acero',
            fairy: 'Hada'
        };

        return traducciones[tipo] || tipo;
    }

    static crearTarjeta(pokemon) {
        const tipos = pokemon.tipos && pokemon.tipos.length > 0 ? pokemon.tipos : [pokemon.tipo || 'normal'];
        const colorPrincipal = TipoColor.obtenerColor(tipos[0]);
        const nombreCapitalizado = pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1);
        const alturaMetros = (pokemon.altura / 10).toFixed(1);
        const pesoKilos = (pokemon.peso / 10).toFixed(1);
        const tiposHTML = tipos.map(tipo => `
            <span class="tipo-badge" style="background-color: ${TipoColor.obtenerColor(tipo)};">
                ${this.traducirTipo(tipo)}
            </span>
        `).join('');

        return `
            <div class="tarjeta-pokemon" style="
                border-top: 8px solid ${colorPrincipal};
                background-color: ${colorPrincipal}15;
            ">
                <h2>${nombreCapitalizado}</h2>
                <div class="datos-pokemon">
                    <div class="dato"><strong>N. Pokedex:</strong> #${pokemon.id}</div>
                    <div class="tipos">${tiposHTML}</div>
                    <div class="dato"><strong>Habilidad:</strong> ${pokemon.habilidad}</div>
                    <div class="dato"><strong>Primer movimiento:</strong> ${pokemon.primer_movimiento}</div>
                    <div class="dato"><strong>Altura:</strong> ${alturaMetros} m</div>
                    <div class="dato"><strong>Peso:</strong> ${pesoKilos} kg</div>
                </div>
            </div>`;
    }

    static crearMiniTarjeta(pokemon) {
        const colorPrincipal = TipoColor.obtenerColor(pokemon.tipo);
        const nombreCapitalizado = pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1);

        return `
            <div class="mini-tarjeta" style="border-left: 5px solid ${colorPrincipal}">
                <div class="mini-info">
                    <p class="mini-nombre">${nombreCapitalizado}</p>
                    <small>${this.traducirTipo(pokemon.tipo)}</small>
                </div>
                <button class="btn-eliminar" data-nombre="${pokemon.nombre}">x</button>
            </div>
        `;
    }
}
