export function iniciarEventoGuardado(btnGuardar, guardarPokemon){
    btnGuardar.addEventListener('click', () => {
        guardarPokemon();
    });
}