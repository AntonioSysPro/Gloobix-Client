// Valores predeterminados para los controles
window.DEFAULT_CONTROLS = {
    feed: "W",
    doublesplit: "D",
    freeze: "S",
    triplesplit: "T",
    "16split": "Q",
    botFeed: "E",
    botSplit: "R",
    botFreeze: "F",
    botDoubleSplit: "C",
    botTripleSplit: "V",
    bot16x: "B"
};

window.getKeyControl = function ( id )
{
    try
    {
        const element = document.getElementById( id );
        if ( element && element.value )
        {
            return element.value.toUpperCase().charCodeAt( 0 );
        }
        // Si el elemento no existe o no tiene valor, usar el valor predeterminado
        return window.DEFAULT_CONTROLS[ id ].charCodeAt( 0 );
    } catch ( e )
    {
        console.warn( "Error getting key control for", id, e );
        return 0; // Retornar 0 como fallback seguro
    }
}

// Inicializar los controles
document.addEventListener( 'DOMContentLoaded', function ()
{
    try
    {
        // Cargar valores guardados
        Object.keys( window.DEFAULT_CONTROLS ).forEach( id =>
        {
            const value = localStorage.getItem( id );
            const element = document.getElementById( id );
            if ( element )
            {
                element.value = value || window.DEFAULT_CONTROLS[ id ];
            }
        } );

        // Guardar valores periódicamente
        setInterval( () =>
        {
            try
            {
                Object.keys( window.DEFAULT_CONTROLS ).forEach( id =>
                {
                    const element = document.getElementById( id );
                    if ( element )
                    {
                        const value = element.value.toUpperCase();
                        if ( value && value.length === 1 )
                        {
                            localStorage.setItem( id, value );
                        }
                    }
                } );
            } catch ( e )
            {
                console.warn( "Error saving controls:", e );
            }
        }, 1000 );

        // Manejar entrada de teclas
        document.querySelectorAll( '.key' ).forEach( input =>
        {
            input.addEventListener( 'keydown', function ( e )
            {
                e.preventDefault();
                if ( e.key.length === 1 )
                {
                    this.value = e.key.toUpperCase();
                }
            } );
        } );
    } catch ( e )
    {
        console.warn( "Error initializing controls:", e );
    }
} );
