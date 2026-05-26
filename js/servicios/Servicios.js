export class Servicios {
    // URL base de la PokeAPI, usada para consultar informacion publica de Pokemon.
    static BASE_URL = 'https://pokeapi.co/api/v2';

    // Ruta de la API propia del proyecto, encargada de trabajar con la base de datos.
    static API_PROPIA_URL = 'SW/api_rest.php';

    // Metodo privado reutilizable para hacer consultas GET a la PokeAPI.
    static async #BusquedaGeneral(endpoint) {
        try {
            // Se construye la URL completa usando el endpoint recibido.
            const respuesta = await fetch(`${this.BASE_URL}/${endpoint}`);

            // Si la API responde con error, se detiene el flujo y se lanza una excepcion.
            if (!respuesta.ok) {
                throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
            }

            // Se convierte la respuesta de texto JSON a un objeto JavaScript.
            return await respuesta.json();
        } catch (error) {
            // Se muestra el error en consola y se vuelve a lanzar para que lo maneje quien llamo el metodo.
            console.error('Fallo en la conexion con el servidor', error);
            throw error;
        }
    }

    // Busca un Pokemon por nombre en la PokeAPI.
    static async obtenerPokemon(nombre) {
        return await this.#BusquedaGeneral(`pokemon/${nombre.toLowerCase()}`);
    }

    // Obtiene una lista de nombres de Pokemon para usarlos como sugerencias en el datalist.
    static async obtenerNombresSugerencias(limite = 150) {
        const data = await this.#BusquedaGeneral(`pokemon?limit=${limite}`);
        return data.results.map(p => p.name); // Retorna un arreglo con solo los nombres de los Pokemon
    }//obtenerNombresSugerencias

    static async guardarPokemon(pokemonJSON) {
        const formData = new FormData();
        formData.append('pokemon', JSON.stringify(pokemonJSON));

        return await fetch('js/servicios/GuardarPokemon.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                return this.parsearRespuesta(data);
            })
            .catch(error => {//x001
                console.error('Error al guardar Pokémons (x001):', error);
                throw error;
            });
    }

    // Guarda en la base de datos el Pokemon que ya fue convertido al formato esperado por la API propia.
    static async guardarPokemon(pokemonJSON) {
        const respuesta = await this.probarApiPropia('POST', pokemonJSON);
        return respuesta.respuesta?.mensaje || 'Solicitud enviada';
    }

    static parsearRespuesta(texto) {
        try {
            return texto ? JSON.parse(texto) : {};
        } catch (error) {
            const inicioJSON = texto.lastIndexOf('{');

            if (inicioJSON !== -1) {
                try {
                    return JSON.parse(texto.substring(inicioJSON));
                } catch (errorJSON) {
                    return { respuesta: texto };
                }
            }

            return { respuesta: texto };
        }
    }//Este metodo sirve para limpiar la respuesta JSON de la API por que EasyPhp devuele warnings de una propiedad del archivo .ini(always_populate_raw_post_data) junto con el JSON 

    // Este metodo existe porque algunas versiones antiguas de PHP/EasyPHP pueden enviar warnings HTML
    // antes del JSON real. En ese caso se intenta extraer el ultimo objeto JSON para que la interfaz
    // pueda leer respuestas como {"mensaje":"Pokemon creado con exito"} sin cambiar el php.ini.

    // Metodo general para probar la API propia con GET, POST, PUT o DELETE.
    static async probarApiPropia(metodo, datos = null, nombre = '') {
        let url = this.API_PROPIA_URL;

        // Para GET y DELETE el nombre se envia como parametro en la URL.
        if ((metodo === 'GET' || metodo === 'DELETE') && nombre) {
            url += `?nombre=${encodeURIComponent(nombre)}`;
        }

        // Opciones basicas del fetch: metodo HTTP y tipo de contenido JSON.
        const opciones = {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Para POST y PUT los datos se envian en el cuerpo de la solicitud.
        if (datos && (metodo === 'POST' || metodo === 'PUT')) {
            opciones.body = JSON.stringify(datos);
        }

        // Se ejecuta la solicitud contra la API propia.
        const respuesta = await fetch(url, opciones);

        // Primero se lee como texto para evitar errores si la API devuelve algo que no sea JSON valido.
        const texto = await respuesta.text();
        const contenido = this.parsearRespuesta(texto);

        // Si la respuesta HTTP no fue exitosa, se devuelve el estado y el contenido del error.
        if (!respuesta.ok) {
            return {
                estado: respuesta.status,
                ok: false,
                respuesta: contenido
            };
        }

        // Respuesta normalizada para que la interfaz pueda mostrar siempre el estado y el contenido.
        return {
            estado: respuesta.status,
            ok: true,
            respuesta: contenido
        };
    }
}

}//fin clase servicios
