export class Pokemon {

    constructor(nombre, tipo, habilidad, primer_movimiento, id, altura, peso, tipos = []) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.habilidad = habilidad;
        this.primer_movimiento = primer_movimiento;
        this.id = id;
        this.altura = altura;
        this.peso = peso;
        this.tipos = tipos;
    }

    static datosAPokemon(datos) {
        const tipo = datos.types[0].type.name;
        const tipos = datos.types.map(tipoPokemon => tipoPokemon.type.name);

        let habilidad = 'No disponible';
        if (datos.abilities.length > 0) {
            habilidad = datos.abilities[0].ability.name;
        }

        let primer_movimiento = 'No disponible';
        if (datos.moves.length > 0) {
            primer_movimiento = datos.moves[0].move.name;
        }

        return new Pokemon(
            datos.name,
            tipo,
            habilidad,
            primer_movimiento,
            datos.id,
            datos.height,
            datos.weight,
            tipos
        );
    }

    convertirAJSON() {
        return {
            nombre: this.nombre,
            tipo: this.tipo,
            habilidad: this.habilidad,
            primer_movimiento: this.primer_movimiento,
        };
    }
}
