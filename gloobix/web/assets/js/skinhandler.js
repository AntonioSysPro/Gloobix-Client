
function skinHandler ()
{
    let inputValue = document.getElementById( 'skin' ).value;
    const baseUrl = window.location.origin + './assets/skins/';

    function validateSkin ()
    {
        const skinUrl = baseUrl + inputValue + '.png';
        const img = new Image();
        img.onload = () =>
        {
            document.getElementById( 'skin' ).style.color = '#78FF39';
        };
        img.onerror = () =>
        {
            document.getElementById( 'skin' ).style.color = '#555';
        };
        img.src = skinUrl;
    }

    validateSkin();
}

document.getElementById( "skin" ).addEventListener( "input", function ()
{
    skinHandler();
    console.log( 'ya' )
} );
