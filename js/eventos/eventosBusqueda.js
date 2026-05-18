export function iniciarEventosBusqueda(btnBuscar, inputNombrePokemon, buscarPokemon, sectionInfoPokemon){
    btnBuscar.addEventListener('click', () => {
        const nombre = inputNombrePokemon.value.trim().toLowerCase();
        //se valida que los datos no entren vacios 
        if (nombre === '') {
            sectionInfoPokemon.innerHTML = '<p>Escribe el nombre de un Pokémon.</p>';
            sectionInfoPokemon.className = 'info-pokemon';
            return;
        }
        //se usa la funcion de buscarPokemon en caso de que no este vacio
        buscarPokemon(nombre);
    });

    inputNombrePokemon.addEventListener('keypress', (event) => {
        //si se usa el enter se llama al btnBuscar para ejecutar el click lo que activa el evento anterior
        if (event.key === 'Enter') {
            btnBuscar.click();
        }
    });
}