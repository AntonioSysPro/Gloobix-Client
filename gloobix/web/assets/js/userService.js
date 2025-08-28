// userService.js
// Servicio cliente para manejar operaciones de usuario (monedas, XP, perfil)
// Utiliza Firestore (compat) para persistencia y Realtime DB para compatibilidad con el código existente.

const UserService = ( function ()
{
    const fs = () => window.firebaseFs;
    const db = () => window.firebaseDb;
    const auth = () => window.firebaseAuth;

    // Contrato (inputs/outputs):
    // - getProfile(uid) -> Promise<profileObject>
    // - getStats(uid) -> Promise<statsObject>
    // - addCoins(uid, amount) -> Promise<newStats>
    // - spendCoins(uid, amount) -> Promise<newStats> o rechaza si fondos insuficientes
    // - addXP(uid, amount) -> Promise<newStats> (ajusta nivel automáticamente)

    // Manejo de nivel simple: level = floor(xp / 1000) + 1

    function ensurePlayerDoc ( uid )
    {
        const docRef = fs().collection( 'players' ).doc( uid );
        return docRef.get().then( ( doc ) =>
        {
            if ( !doc.exists )
            {
                return docRef.set( {
                    coins: 0,
                    xp: 0,
                    level: 1,
                    stats: {
                        highScore: 0,
                        totalMassGained: 0,
                        gamesPlayed: 0,
                        playersEaten: 0,
                        foodEaten: 0,
                        timePlayed: 0,
                        wins: 0
                    },
                    createdAt: new Date()
                } ).then( () => docRef );
            }
            return docRef;
        } );
    }

    async function getProfile ( uid )
    {
        const ref = await ensurePlayerDoc( uid );
        const snap = await ref.get();
        return snap.exists ? snap.data() : null;
    }

    async function getStats ( uid )
    {
        const profile = await getProfile( uid );
        return profile ? { coins: profile.coins || 0, xp: profile.xp || 0, level: profile.level || 1 } : null;
    }

    async function addCoins ( uid, amount )
    {
        if ( amount <= 0 ) return getStats( uid );
        const ref = fs().collection( 'players' ).doc( uid );
        // Usar transaction para evitar carrera
        return fs().runTransaction( async ( t ) =>
        {
            const doc = await t.get( ref );
            if ( !doc.exists )
            {
                t.set( ref, { coins: amount } );
                return { coins: amount };
            }
            const data = doc.data();
            const newCoins = ( data.coins || 0 ) + amount;
            t.update( ref, { coins: newCoins } );
            return { coins: newCoins };
        } ).then( ( res ) => res ).catch( ( e ) => { throw e; } );
    }

    async function spendCoins ( uid, amount )
    {
        if ( amount <= 0 ) return getStats( uid );
        const ref = fs().collection( 'players' ).doc( uid );
        return fs().runTransaction( async ( t ) =>
        {
            const doc = await t.get( ref );
            if ( !doc.exists ) throw new Error( 'Player not found' );
            const data = doc.data();
            const current = data.coins || 0;
            if ( current < amount ) throw new Error( 'Insufficient funds' );
            const newCoins = current - amount;
            t.update( ref, { coins: newCoins } );
            return { coins: newCoins };
        } );
    }

    async function addXP ( uid, amount )
    {
        if ( amount <= 0 ) return getStats( uid );
        const ref = fs().collection( 'players' ).doc( uid );
        return fs().runTransaction( async ( t ) =>
        {
            const doc = await t.get( ref );
            if ( !doc.exists )
            {
                t.set( ref, { xp: amount, level: Math.floor( amount / 1000 ) + 1 } );
                return { xp: amount, level: Math.floor( amount / 1000 ) + 1 };
            }
            const data = doc.data();
            const currentXP = data.xp || 0;
            const newXP = currentXP + amount;
            const newLevel = Math.floor( newXP / 1000 ) + 1;
            t.update( ref, { xp: newXP, level: newLevel } );
            return { xp: newXP, level: newLevel };
        } );
    }

    return {
        getProfile,
        getStats,
        addCoins,
        spendCoins,
        addXP
    };
} )();

// Exponer para uso global en el frontend
window.UserService = UserService;
