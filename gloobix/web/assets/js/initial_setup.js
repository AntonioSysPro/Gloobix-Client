document.addEventListener( "DOMContentLoaded", function ()
{
    const localstoragepermission = isLocalStorageAvailable();
    if ( !localstoragepermission ) alert( 'Please allow local storage for the game to work properly' );
    setTimeout( function ()
    {
        const initialSetup = localStorage.getItem( "initialsetup" );
        if ( initialSetup !== "true" )
        {
            executeInitialSetup();
        }
        showNewPlayerGiftCode(); // check if we will show gift codes
    }, 1500 );
    // Definición dummy para evitar error de referencia
    function showNewPlayerGiftCode ()
    {
        // Aquí puedes agregar lógica para mostrar el código de regalo si aplica
        // Por ahora solo evita el ReferenceError
    }
    /*document.getElementById( "setup_interactive_renderingengine1" ).addEventListener( "click", function ()
    {
        console.log( "Rendering Engine 1 Selected" );
        document.getElementById( 'optimizedRendering' ).click();
        renderInitialSetupSelector();
    } );*/


} );

function isLocalStorageAvailable ()
{
    try
    {
        localStorage.setItem( "test", "test" );
        localStorage.removeItem( "test" );
        return true;
    } catch ( e )
    {
        return false;
    }
}



function executeInitialSetup ()
{
    //document.getElementById( 'gamemenu_initialconfig' ).classList.remove( 'hidden' );
    try
    {/*
        // console.log("Initial setup function is executed.");
        //const optimizedRenderingValue = document.getElementById( "optimizedRendering" ).checked;
        // console.log(optimizedRenderingValue)
        document.getElementById( "gamemenu_initialconfig" ).style.display = "block";
        setTimeout( function ()
        {
            document.getElementById( "setup_loader" ).style.display = 'none';
            document.getElementById( "setup_interactive" ).style.display = 'block';
            const loaderIcon = document.getElementById( "gamemenu_loader_icon2" );
            loaderIcon.classList.remove( "gamemenu_gloobix_loader" );
            loaderIcon.classList.add( "gamemenu_gloobix_loaded" );
        }, 3500 );
        if ( optimizedRenderingValue == false )
        {
            document.getElementById( "setup_interactive_renderingengine1" ).classList.add( 'renderingEngineSelected' );
            document.getElementById( "setup_interactive_renderingengine1" ).classList.add( 'unselectable' );
            document.getElementById( "setup_interactive_renderingengine1_selected" ).classList.add( 'renderingEngineSelectedIcon' );
            document.getElementById( "setup_interactive_renderingengine2" ).classList.remove( 'unselectable' );
            document.getElementById( "setup_interactive_renderingengine2" ).classList.remove( 'renderingEngineSelected' );
            document.getElementById( "setup_interactive_renderingengine2_selected" ).classList.remove( 'renderingEngineSelectedIcon' );
        } else if ( optimizedRenderingValue == true )
        {
            document.getElementById( "setup_interactive_renderingengine1" ).classList.remove( 'renderingEngineSelected' );
            document.getElementById( "setup_interactive_renderingengine1" ).classList.remove( 'unselectable' );
            document.getElementById( "setup_interactive_renderingengine1_selected" ).classList.remove( 'renderingEngineSelectedIcon' );
            document.getElementById( "setup_interactive_renderingengine2" ).classList.add( 'unselectable' );
            document.getElementById( "setup_interactive_renderingengine2" ).classList.add( 'renderingEngineSelected' );
            document.getElementById( "setup_interactive_renderingengine2_selected" ).classList.add( 'renderingEngineSelectedIcon' );
        }
        // console.log(optimizedRenderingValue);*/
    } catch ( e )
    {
        console.log( e )
    }
}

function renderInitialSetupSelector ()
{
    const optimizedRenderingValue = document.getElementById( "optimizedRendering" ).checked;
    if ( !optimizedRenderingValue )
    {
        document.getElementById( "setup_interactive_renderingengine1" ).classList.add( 'renderingEngineSelected' );
        document.getElementById( "setup_interactive_renderingengine1_selected" ).classList.add( 'renderingEngineSelectedIcon' );
        document.getElementById( "setup_interactive_renderingengine2" ).classList.remove( 'renderingEngineSelected' );
        document.getElementById( "setup_interactive_renderingengine2_selected" ).classList.remove( 'renderingEngineSelectedIcon' );
    } else
    {
        document.getElementById( "setup_interactive_renderingengine1" ).classList.remove( 'renderingEngineSelected' );
        document.getElementById( "setup_interactive_renderingengine1_selected" ).classList.remove( 'renderingEngineSelectedIcon' );
        document.getElementById( "setup_interactive_renderingengine2" ).classList.add( 'renderingEngineSelected' );
        document.getElementById( "setup_interactive_renderingengine2_selected" ).classList.add( 'renderingEngineSelectedIcon' );
    }
}

if ( typeof BlockAdBlock !== typeof undefined )
{
    blockAdBlock = new BlockAdBlock( {
        checkOnLoad: true,
        resetOnEnd: true,
        baitClass: "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ads-right ads-left ads-bottom ads-top ads",
        baitStyle: "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;",
    } );
}
let adBlockDetected = () =>
{
    document.body.innerHTML =
        '<style>html,body{margin:0;padding:0;font-family:sans-serif;font-size:100%}.adblock-wrapper{position:absolute;box-sizing:border-box;height:250px;width:650px;margin:auto;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-family:sans-serif;padding:50px;border-radius:15px}.left{float:left;padding:20px}.adblock-image{display:inline-block;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNDAiIGhlaWdodD0iMzQwIiB2aWV3Qm94PSIwIDAgMTcwIDE3MCI+ICA8bWV0YWRhdGE+PD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz48eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+ICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+ICAgPC9yZGY6UkRGPjwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg-);width:145px;height:107px;background-size:93px 93px;background-repeat:no-repeat;background-position:center}.right a.refresh{display:inline-block;background-color:#800059;padding:10px;cursor:pointer;margin-right:23px;color:white;border-radius:5px;text-decoration:none}.right a.disable{display:inline-block;padding:9px;border:1px solid rgba(256,256,256,.4);border-radius:5px;margin-left:20px;color:white;text-decoration:none}.right a.disable:hover{border:1px solid white}.right p{font-size:0.8em}.close{position:absolute;display:block;cursor:pointer;top:8px;right:6px;font-size:1.2em}#main-wrapper{width:100%;height:100vh;overflow:hidden;background:rgba(0,0,0,.95)!important}.fa{margin-right:15px}@media(max-width:768px){.adblock-wrapper{max-width:417px}}</style><div id="main-wrapper"><div class="adblock-wrapper"id="adblock-wrapper"><div class="left"><div class="adblock-image"></div></div><div class="right"><h3>Attention!Ad blocker Detected!</h3><p>Please disable your adblocking software or whitelist our website. To keep the website alive, we see us forced to disallow adblockers, sorry ;C.</p><a onClick="window.location.reload()"class="refresh"><i class="fa fa-refresh"></i>Refresh</a><a href="https://www.google.co.in/search?q=how+to+disable+adblock"target="_blank"class="disable"><i class="fa fa-power-off"></i>How to Disable</a></div><div class="close"id="myBtn"><i class="fa fa-times"></i></div></div></div><script>document.getElementById("myBtn").addEventListener("click",function(){var close=document.getElementById("adblock-wrapper");var mainWrapper=document.getElementById("main-wrapper");fadeOut(close,1000);fadeOut(mainWrapper,1000)});function fadeOut(elem,speed){if(!elem.style.opacity){elem.style.opacity=1}var outInterval=setInterval(function(){elem.style.opacity-=0.02;if(elem.style.opacity<=0){clearInterval(outInterval)}},speed/50)}"';
};
if ( typeof BlockAdBlock === "undefined" || blockAdBlock == false )
{
    adBlockDetected();
} else
{
    blockAdBlock.onDetected( adBlockDetected );
}

function cleanSelect ( x )
{
    document.getElementById( "selectedGamemode1" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode2" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode3" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode4" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode5" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode6" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode7" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode8" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode9" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode10" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode11" ).classList.remove( 'selectedGamemode' );
    document.getElementById( "selectedGamemode12" ).classList.remove( 'selectedGamemode' );
    if ( x )
    {
        document.getElementById( x ).classList.remove( 'selectedGamemode' );
        if ( window.gloObix.lastgamemode !== null ) document.getElementById( window.gloObix.lastgamemode ).classList.remove( 'selectedGamemode' );
    }
}

function executeEventFunctions ()
{
    console.log( 'No event scheduled' );
}

function toggleFullScreen ()
{
    try
    {
        if ( !document.fullscreenElement )
        {
            if ( document.documentElement.requestFullscreen )
            {
                document.documentElement.requestFullscreen();
            } else if ( document.documentElement.mozRequestFullScreen )
            {
                document.documentElement.mozRequestFullScreen();
            } else if ( document.documentElement.webkitRequestFullscreen )
            {
                document.documentElement.webkitRequestFullscreen();
            } else if ( document.documentElement.msRequestFullscreen )
            {
                document.documentElement.msRequestFullscreen();
            }
        } else
        {
            if ( document.exitFullscreen )
            {
                document.exitFullscreen();
            } else if ( document.mozCancelFullScreen )
            {
                document.mozCancelFullScreen();
            } else if ( document.webkitExitFullscreen )
            {
                document.webkitExitFullscreen();
            } else if ( document.msExitFullscreen )
            {
                document.msExitFullscreen();
            }
        }
    } catch ( e )
    {
        console.warn( "Error toggling fullscreen:", e );
    }
}

function updateCountdown ()
{
    const targetDate = new Date( "2025-09-01T00:00:00" );
    const now = new Date();

    const diff = targetDate - now;

    if ( diff <= 0 )
    {
        document.getElementById( "seasonal_gamemode_countdown" ).textContent = "Season ended.";
        return;
    }

    const days = Math.floor( diff / ( 1000 * 60 * 60 * 24 ) );
    const hours = Math.floor( ( diff / ( 1000 * 60 * 60 ) ) % 24 );

    document.getElementById( "seasonal_gamemode_countdown" ).textContent =
        `⌛${ days }d ${ hours }h`;
}
/*$( document ).ready( function ()
{
    updateCountdown()
    var d = new Date();
    var n = d.getDate();
    var completedAlready = localStorage.getItem( 'questsProgress' );
    if ( !localStorage.getItem( 'questsProgress' ) ) return localStorage.setItem( 'questsProgress', JSON.stringify( [ 0 ] ) );
    completedAlready = JSON.parse( completedAlready );

    for ( var i = 1; i <= n; i++ )
    {
        $( '.day-' + i ).addClass( 'flip' );
    }

    for ( let index = 0, len = completedAlready.length; index < len; ++index )
    {
        const element = completedAlready[ index ];
        // console.log(element)
        $( '.front-' + element ).addClass( 'UnlockedYet' );
        // console.log('.front-' + element)
        $( '.day-' + element ).removeClass( 'flip' );
    }

    for ( var i = n + 1; i <= 24; i++ )
    {
        $( '.front-' + i ).addClass( 'notUnlockedYet' );
    }
} );*/