// firebase-config.js
// Configuración cliente de Firebase. Se inicializa una sola vez y exporta los objetos globales
// Comentado y documentado para facilitar entendimiento.

( function ()
{
    // Asegúrate de reemplazar con tu propia configuración si es necesario
    const firebaseConfig = {
        apiKey: "AIzaSyDD8r2aLSknqbHkH-APz2mPj5skp8mcnws",
        authDomain: "sub-por-sub-bb.firebaseapp.com",
        databaseURL: "https://sub-por-sub-bb-default-rtdb.firebaseio.com",
        projectId: "sub-por-sub-bb",
        storageBucket: "sub-por-sub-bb.appspot.com",
        messagingSenderId: "121777825313",
        appId: "1:121777825313:web:ed0e512ca52105bd04e560"
    };

    // Inicializar Firebase solo si no está inicializado
    try
    {
        if ( !firebase.apps.length )
        {
            firebase.initializeApp( firebaseConfig );
            console.info( 'firebase-config: Firebase inicializado' );
        } else
        {
            console.info( 'firebase-config: Firebase ya inicializado' );
        }
    } catch ( e )
    {
        console.error( 'firebase-config: Error inicializando Firebase', e );
    }

    // Exponer referencias globales para compatibilidad con el código existente
    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.database();
    window.firebaseFs = firebase.firestore();
} )();
