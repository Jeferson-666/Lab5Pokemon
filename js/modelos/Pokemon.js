
export class Pokemon {

    constructor(nombre, tipo, habilidad, primer_movimiento) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.habilidad = habilidad;
        this.primer_movimiento = primer_movimiento;
    }

    static datosAPokemon(datos) {
        const tipo = datos.types[0].type.name;

        let habilidad = 'No disponible';
        if (datos.abilities.length > 0) {
            habilidad = datos.abilities[0].ability.name;
        }

        let primer_movimiento = 'No disponible';
        if (datos.moves.length > 0) {
            primer_movimiento = datos.moves[0].move.name;
        }

        return new Pokemon( datos.name, tipo, habilidad, primer_movimiento);
    }

    // Método para convertir un Pokémon en formato JSON 
    convertirAJSON() {
        return {
            nombre: this.nombre,
            tipo: this.tipo,
            habilidad: this.habilidad,
            primer_movimiento: this.primer_movimiento,
        };
    }//Fin de método convertirAJSON 
}//Fin de clase