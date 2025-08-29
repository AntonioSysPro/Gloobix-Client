window.addEventListener( 'DOMContentLoaded', () =>
{
    // Usar la configuración y servicios ya inicializados en `firebase-config.js`
    const auth = window.firebaseAuth || firebase.auth();
    const db = window.firebaseDb || firebase.database();
    const fs = window.firebaseFs || firebase.firestore();
    const provider = new firebase.auth.GoogleAuthProvider();

    // Forzar persistencia local para mantener la sesión al recargar
    if ( auth && auth.setPersistence )
    {
        auth.setPersistence( firebase.auth.Auth.Persistence.LOCAL ).catch( ( err ) =>
        {
            console.warn( 'No se pudo establecer la persistencia de sesión:', err );
        } );
    }

    // Helper: llamar API del servidor con idToken para autenticación
    async function apiPost ( path, body )
    {
        const user = auth.currentUser;
        const headers = { 'Content-Type': 'application/json' };
        if ( user )
        {
            try
            {
                const token = await user.getIdToken();
                headers[ 'Authorization' ] = 'Bearer ' + token;
            } catch ( e )
            {
                console.warn( 'apiPost: no se pudo obtener idToken', e );
            }
        }
        const res = await fetch( path, { method: 'POST', headers, body: JSON.stringify( body || {} ) } );
        if ( !res.ok )
        {
            const text = await res.text();
            throw new Error( `API ${ path } error: ${ res.status } ${ text }` );
        }
        return res.json();
    }

    // Ajustar IDs para coincidir con el HTML existente
    const googleLoginBtn = document.getElementById( 'gloobix_account_login_button_google' ) || document.getElementById( 'google-login' );
    const discordLoginBtn = document.getElementById( 'gloobix_account_login_button' );
    const logoutBtn = document.getElementById( 'gloobixUserLogout' ) || document.getElementById( 'logout-btn' );
    const playerName = document.getElementById( 'gloobixAccountUsername' ) || document.getElementById( 'player-name' );
    const playerAvatar = document.getElementById( 'userAvatar' ) || '../img/favicon.ico';
    const profileBtn = document.getElementById( 'profile-btn' );
    const profilePanel = document.getElementById( 'profile-panel' );
    const userCoinsElem = document.getElementById( 'usercoins_amount' );
    const levelElem = document.getElementById( 'level' );
    const xpProgressBar = document.getElementById( 'xpProgressBar' );

    function formatTime ( ms )
    {
        if ( isNaN( ms ) || ms < 0 )
        {
            return "0s";
        }
        const seconds = Math.floor( ( ms / 1000 ) % 60 );
        const minutes = Math.floor( ( ms / ( 1000 * 60 ) ) % 60 );
        const hours = Math.floor( ( ms / ( 1000 * 60 * 60 ) ) );

        let timeString = "";
        if ( hours > 0 ) timeString += `${ hours }h `;
        if ( minutes > 0 ) timeString += `${ minutes }m `;
        if ( seconds >= 0 ) timeString += `${ seconds }s`;

        return timeString.trim();
    }

    // Funciones públicas para otras partes del cliente
    window.GloobixAuth = {
        async addCoins ( amount )
        {
            const user = auth.currentUser;
            if ( !user ) throw new Error( 'Not authenticated' );
            return apiPost( '/api/user/addCoins', { amount } );
        },
        async spendCoins ( amount )
        {
            const user = auth.currentUser;
            if ( !user ) throw new Error( 'Not authenticated' );
            return apiPost( '/api/user/spendCoins', { amount } );
        },
        async addXP ( amount )
        {
            const user = auth.currentUser;
            if ( !user ) throw new Error( 'Not authenticated' );
            return apiPost( '/api/user/addXP', { amount } );
        }
    };

    if ( profileBtn && profilePanel )
    {
        profileBtn.addEventListener( 'click', () =>
        {
            if ( profilePanel && profilePanel.style.display === 'none' )
            {
                const user = auth.currentUser;
                if ( user )
                {
                    // Usar UserService (cliente) para mostrar perfil rápido, pero las modificaciones sensibles deben usar la API del servidor
                    if ( window.UserService )
                    {
                        window.UserService.getProfile( user.uid ).then( ( data ) =>
                        {
                            if ( !data ) return;
                            const stats = data.stats || {};
                            const role = data.role || 'USER';
                            const xpForNextLevel = ( data.level || 1 ) * 100;
                            const xpPercentage = xpForNextLevel > 0 ? ( ( data.xp || 0 ) / xpForNextLevel ) * 100 : 0;
                            const playerRoleElem = document.getElementById( 'player-role' );
                            if ( playerRoleElem ) playerRoleElem.textContent = role;
                            const statLevelElem = document.getElementById( 'stat-level' );
                            if ( statLevelElem ) statLevelElem.textContent = data.level || 1;
                            const statXpElem = document.getElementById( 'stat-xp' );
                            if ( statXpElem ) statXpElem.textContent = `${ data.xp || 0 } / ${ xpForNextLevel }`;
                            const statXpBarElem = document.getElementById( 'stat-xp-bar' );
                            if ( statXpBarElem ) statXpBarElem.style.width = `${ xpPercentage }%`;
                            const statHighScoreElem = document.getElementById( 'stat-highScore' );
                            if ( statHighScoreElem ) statHighScoreElem.textContent = stats.highScore || 0;
                            const statGamesPlayedElem = document.getElementById( 'stat-gamesPlayed' );
                            if ( statGamesPlayedElem ) statGamesPlayedElem.textContent = stats.gamesPlayed || 0;
                            const statWinsElem = document.getElementById( 'stat-wins' );
                            if ( statWinsElem ) statWinsElem.textContent = stats.wins || 0;
                            const statTotalMassGainedElem = document.getElementById( 'stat-totalMassGained' );
                            if ( statTotalMassGainedElem ) statTotalMassGainedElem.textContent = stats.totalMassGained || 0;
                            const statPlayersEatenElem = document.getElementById( 'stat-playersEaten' );
                            if ( statPlayersEatenElem ) statPlayersEatenElem.textContent = stats.playersEaten || 0;
                            const statFoodEatenElem = document.getElementById( 'stat-foodEaten' );
                            if ( statFoodEatenElem ) statFoodEatenElem.textContent = stats.foodEaten || 0;
                            const statTimePlayedElem = document.getElementById( 'stat-timePlayed' );
                            if ( statTimePlayedElem ) statTimePlayedElem.textContent = formatTime( stats.timePlayed || 0 );
                        } ).catch( ( e ) => console.warn( 'profile load error', e ) );
                    } else
                    {
                        // Fallback: leer Realtime DB
                        const playerRef = db.ref( `players/${ user.uid }` );
                        playerRef.once( 'value' ).then( ( snapshot ) =>
                        {
                            if ( snapshot.exists() )
                            {
                                const data = snapshot.val();
                                const stats = data.stats || {};
                                const role = data.role || 'USER';
                                const xpForNextLevel = ( stats.level || 1 ) * 100;
                                const xpPercentage = xpForNextLevel > 0 ? ( ( stats.xp || 0 ) / xpForNextLevel ) * 100 : 0;
                                const playerRoleElem = document.getElementById( 'player-role' );
                                if ( playerRoleElem ) playerRoleElem.textContent = role;
                                const statLevelElem = document.getElementById( 'stat-level' );
                                if ( statLevelElem ) statLevelElem.textContent = stats.level || 1;
                                const statXpElem = document.getElementById( 'stat-xp' );
                                if ( statXpElem ) statXpElem.textContent = `${ stats.xp || 0 } / ${ xpForNextLevel }`;
                                const statXpBarElem = document.getElementById( 'stat-xp-bar' );
                                if ( statXpBarElem ) statXpBarElem.style.width = `${ xpPercentage }%`;
                                const statHighScoreElem = document.getElementById( 'stat-highScore' );
                                if ( statHighScoreElem ) statHighScoreElem.textContent = stats.highScore || 0;
                                const statGamesPlayedElem = document.getElementById( 'stat-gamesPlayed' );
                                if ( statGamesPlayedElem ) statGamesPlayedElem.textContent = stats.gamesPlayed || 0;
                                const statWinsElem = document.getElementById( 'stat-wins' );
                                if ( statWinsElem ) statWinsElem.textContent = stats.wins || 0;
                                const statTotalMassGainedElem = document.getElementById( 'stat-totalMassGained' );
                                if ( statTotalMassGainedElem ) statTotalMassGainedElem.textContent = stats.totalMassGained || 0;
                                const statPlayersEatenElem = document.getElementById( 'stat-playersEaten' );
                                if ( statPlayersEatenElem ) statPlayersEatenElem.textContent = stats.playersEaten || 0;
                                const statFoodEatenElem = document.getElementById( 'stat-foodEaten' );
                                if ( statFoodEatenElem ) statFoodEatenElem.textContent = stats.foodEaten || 0;
                                const statTimePlayedElem = document.getElementById( 'stat-timePlayed' );
                                if ( statTimePlayedElem ) statTimePlayedElem.textContent = formatTime( stats.timePlayed || 0 );
                            }
                        } );
                    }
                }
                profilePanel.style.display = 'block';
            } else
            {
                profilePanel.style.display = 'none';
            }
        } );

        if ( googleLoginBtn )
        {
            googleLoginBtn.addEventListener( 'click', () =>
            {
                auth.signInWithPopup( provider )
                    .catch( ( error ) =>
                    {
                        console.error( "Error al iniciar sesión con Google:", error );
                    } );
            } );
        }

        // debug: comprobar estado inicial
        console.info( 'auth.js: auth.currentUser al cargar:', auth.currentUser );

        if ( discordLoginBtn )
        {
            // Placeholder: conectar provider de Discord si se agrega en el futuro
            discordLoginBtn.addEventListener( 'click', () =>
            {
                alert( 'Discord login not configured.' );
            } );
        }

        if ( logoutBtn )
        {
            logoutBtn.addEventListener( 'click', () =>
            {
                auth.signOut();
            } );
        }

        auth.onAuthStateChanged( async user =>
        {
            if ( user )
            {
                console.info( 'auth.onAuthStateChanged: logged in', user.uid );
                if ( playerName ) playerName.textContent = user.displayName || '';
                if ( playerAvatar ) { playerAvatar.src = /*user.photoURL ||*/ '../img/favicon.ico'; playerAvatar.style.display = 'inline'; }
                // Ocultar todos los botones de login y mostrar solo logout
                if ( googleLoginBtn ) googleLoginBtn.style.display = 'none';
                if ( discordLoginBtn ) discordLoginBtn.style.display = 'none';
                if ( logoutBtn ) logoutBtn.style.display = 'block';
                console.debug( 'auth.js: UI visibilidad -> google hidden, discord hidden, logout visible' );
                if ( profileBtn ) profileBtn.style.display = 'inline-block';
                // Mostrar el div de logout si existe
                const logoutDiv = document.getElementById( 'logout_div' );
                if ( logoutDiv ) logoutDiv.style.display = 'block';

                // Actualizar UI pública: monedas/level/xp
                if ( userCoinsElem ) userCoinsElem.textContent = '0';
                if ( levelElem ) levelElem.textContent = '1';
                if ( xpProgressBar ) xpProgressBar.style.width = '0%';

                // Guardar o actualizar datos del jugador en Realtime Database
                try
                {
                    const playerRefRt = db.ref( 'players/' + user.uid );
                    playerRefRt.update( {
                        name: user.displayName,
                        avatar: user.photoURL,
                        lastLogin: Date.now(),
                    } );

                    // Inicializar/asegurar doc en Firestore usando UserService
                    if ( window.UserService )
                    {
                        window.UserService.getProfile( user.uid ).catch( ( e ) =>
                        {
                            console.warn( 'auth.js: error asegurando perfil en Firestore', e );
                        } );
                    }
                } catch ( e )
                {
                    console.warn( 'auth.js: error actualizando base de datos', e );
                }

                // Leer estadísticas actuales desde Firestore usando UserService y actualizar la UI del menú
                if ( window.UserService )
                {
                    window.UserService.getStats( user.uid ).then( ( stats ) =>
                    {
                        if ( !stats ) return;
                        const lvl = stats.level || 1;
                        const xp = stats.xp || 0;
                        const xpForNext = lvl * 1000;
                        const pct = xpForNext > 0 ? Math.min( 100, Math.floor( ( xp / xpForNext ) * 100 ) ) : 0;
                        if ( levelElem ) levelElem.textContent = lvl;
                        if ( xpProgressBar ) xpProgressBar.style.width = pct + '%';
                        const displayLevel = document.getElementById( 'displayLevel' );
                        if ( displayLevel ) displayLevel.innerHTML = `<b>${ xp } / ${ xpForNext }</b> XP&nbsp;(<b>${ pct }</b>%)`;
                        if ( userCoinsElem ) userCoinsElem.textContent = ( stats.coins || 0 ).toString();
                        if ( window.updateXPBar && typeof window.updateXPBar === 'function' )
                        {
                            try { window.updateXPBar( xp, xpForNext, lvl ); } catch ( e ) { console.warn( 'auth.js: error calling updateXPBar', e ); }
                        }
                    } ).catch( ( e ) => console.warn( 'UserService.getStats error:', e ) );
                }

                if ( window.loadSettings )
                {
                    window.loadSettings();
                }
            } else
            {
                console.info( 'auth.onAuthStateChanged: no user' );
                if ( playerName ) playerName.textContent = '';
                if ( playerAvatar ) { playerAvatar.src = '../img/favicon.ico'; playerAvatar.style.display = 'none'; }
                // Mostrar botones de login y ocultar logout
                if ( googleLoginBtn ) googleLoginBtn.style.display = 'block';
                if ( discordLoginBtn ) discordLoginBtn.style.display = 'block';
                if ( logoutBtn ) logoutBtn.style.display = 'none';
                console.debug( 'auth.js: UI visibilidad -> google visible, discord visible, logout hidden' );
                if ( profileBtn ) profileBtn.style.display = 'none';
                if ( profilePanel ) profilePanel.style.display = 'none';
                const logoutDiv = document.getElementById( 'logout_div' );
                if ( logoutDiv ) logoutDiv.style.display = 'none';
            }
        } );

        // ...resto del código si necesario ...
    }
} );
