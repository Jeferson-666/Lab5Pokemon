export class Servicios {
    static BASE_URL = 'https://pokeapi.co/api/v2';

    static async #BusquedaGeneral(endpoint) {
        try {
            const respuesta = await fetch(`${this.BASE_URL}/${endpoint}`);
            if (!respuesta.ok) {
                throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
            }//if
            return await respuesta.json();
        } catch (error) {
            console.error("Fallo en la conexión con el servidor", error);
            throw error;
        }//try catch
    }//busquedaGeneral

    static async obtenerPokemon(nombre) {
        return await this.#BusquedaGeneral(`pokemon/${nombre.toLowerCase()}`);
    }//obtenerPokemon

    // Corregido: Ahora extrae solo los nombres para facilitar el trabajo de Sugerencias.js
    static async obtenerNombresSugerencias(limite = 150) {
        const data = await this.#BusquedaGeneral(`pokemon?limit=${limite}`);
        return data.results.map(p => p.name); // Retorna un arreglo con solo los nombres de los Pokemon
    }//obtenerNombresSugerencias

   static async guardarPokemon(pokemonJSON) {
       alert("Enviando datos a la base de datos...");
       return "guardado exitoso"; // Simulación de respuesta exitosa
    }//busquedaGeneral

}//fin clase servicios