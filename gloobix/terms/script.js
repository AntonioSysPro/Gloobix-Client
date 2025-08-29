// Recupera la información de los nombres de las personas que contribuyeron
const backendNames = [ "pepe", "migel", "juan" ];

backendNames.forEach( ( name ) =>
{
    document.getElementById( "name" ).textContent += name + ", ";
} );

console.log( "Finalmente añadimos a", backendNames.length, "personas al final del mensaje" );
