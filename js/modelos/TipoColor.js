//Historia 2 Jeferson 

//Clase para obtener color según tipo
export class TipoColor {
     //Mapa para los colores , así el código es más escalable y permite un mantenimiento/cambio sencillo
    static colores = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD'
    };//fin de mapa (tipo,color)

//Método para obtener color , usa toLowerCase para evitar incompatibilidad con solicitudes de clases futuras y retorna un color blanco si no concuerda con algún tipo del mapa
    static obtenerColor(tipo) {
        return this.colores[tipo.toLowerCase()] || '#D5D8DC';
    }//Fin de metodo obtener color 

}//Fin de clase para obtener color según tipo