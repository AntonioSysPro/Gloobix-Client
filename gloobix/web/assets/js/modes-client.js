// Cliente de selección de modos y conexión WebSocket
( function ()
{
  async function fetchModes ()
  {
    // If a remote modes service is configured (for example on Render), prefer it.
    const remote = window.MODES_SERVICE_URL;
    if ( remote )
    {
      try
      {
        const opts = { cache: 'no-cache' };
        // If caller provided a MODE API KEY, attach it as header for protected endpoints
        if ( window.MODES_SERVICE_KEY ) opts.headers = { 'x-mode-api-key': window.MODES_SERVICE_KEY };
        const res = await fetch( remote, opts );
        if ( res.ok ) return await res.json();
        console.warn( 'Remote modes service returned', res.status );
      } catch ( e )
      {
        console.warn( 'Cannot load remote modes, falling back to local', e );
      }
    }
    try
    {
      const res = await fetch( './config/modes.json' );
      if ( !res.ok ) throw new Error( 'no modes' );
      return await res.json();
    } catch ( e )
    {
      console.warn( 'Cannot load modes.json, using defaults', e );
      return [];
    }
  }

  function buildMenu ( modes )
  {
  }

  function selectMode ( mode )
  {
    // Construir URL de WebSocket: preferimos ws(s):// + hostname modificado.
    // Si el modo contiene an URL completa, usarla. Si no, construiremos usando window.location
    let wsUrl = null;
    if ( mode.url )
    {
      wsUrl = mode.url;
    } else
    {
      // Intentar derivar subdominio: <mode-id>.<current-host>
      const host = window.location.hostname;
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      // Si estamos en localhost, usar hintPort
      if ( host.includes( 'localhost' ) || host.includes( '127.0.0.1' ) )
      {
        wsUrl = `${ protocol }://${ host }:${ mode.hintPort }${ mode.wsPath }`;
      } else
      {
        wsUrl = `${ protocol }://${ mode.id }.${ host }${ mode.wsPath }`;
      }
    }

    console.log( 'Connecting to', wsUrl );
    // Prefer using the centralized connection helpers exposed by the main client.
    if ( typeof window.connectToWsUrl === 'function' )
    {
      window.connectToWsUrl( wsUrl );
    }
    else if ( typeof window.setserver === 'function' )
    {
      // setserver historically expects host:port; in case a full ws:// url was provided, strip protocol
      if ( /^wss?:\/\//i.test( wsUrl ) )
      {
        try { const u = new URL( wsUrl ); window.setserver( u.host ); }
        catch ( e ) { window.setserver( wsUrl ); }
      } else window.setserver( wsUrl );
    }
    else
    {
      // Fallback to direct WebSocket
      try { const ws = new WebSocket( wsUrl ); window.currentGameSocket = ws; } catch ( e ) { console.error( 'WS connection failed', e ); }
    }
  }

  async function init ()
  {
    const modes = await fetchModes();
    if ( !modes || modes.length === 0 ) return;

    const selectedModeId = localStorage.getItem('selectedModeId');
    if (selectedModeId) {
      const mode = modes.find(m => m.id === selectedModeId);
      if (mode) {
        selectModeById(selectedModeId);
      } else {
        console.warn(`Stored mode ID ${selectedModeId} is invalid.`);
        buildMenu(modes);
      }
    } else {
      buildMenu(modes);
      // auto select first mode for compatibility
      // selectMode(modes[0]);
    }
  }

  window.addEventListener( 'DOMContentLoaded', init );
  // Exponer para que index.html pueda llamar a selectMode si lo necesita
  window.selectModeById = ( id ) =>
  {
    fetch( './config/modes.json' ).then( r => r.json() ).then( modes =>
    {
      const m = modes.find( x => x.id === id );
      const laUrl = m.url
      console.log(laUrl)
      if ( m ) {
        localStorage.setItem('selectedModeId', id);
        selectMode( m );
        try { window.cleanSelect(); } catch ( e ) { }
        const elementId = 'selectedGamemode' + (modes.findIndex(x => x.id === id) + 1);
        try {
          const mapping = {
            'ffa': 'selectedGamemode1',
            'teams': 'selectedGamemode2',
            'selfeed': 'selectedGamemode3',
            'experimental': 'selectedGamemode4',
            'megasplit': 'selectedGamemode5',
            'ghost': 'selectedGamemode6',
            'minions': 'selectedGamemode7',
            'imvirus': 'selectedGamemode8'
          };
          document.getElementById(mapping[id]).classList.add('selectedGamemode');
        } catch (e) {}
      }
    } ).catch( () => console.warn( 'modes.json no disponible' ) );
  };
} )();