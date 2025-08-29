//(function() {
//"use strict";

if (
  typeof WebSocket === "undefined" ||
  typeof DataView === "undefined" ||
  typeof ArrayBuffer === "undefined" ||
  typeof Uint8Array === "undefined"
)
{
  alert(
    "Your browser does not support required features, please update your browser or get a new one."
  );
  window.stop();
}

function byId ( id )
{
  return document.getElementById( id );
}
function byClass ( clss, parent )
{
  return ( parent || document ).getElementsByClassName( clss );
}

function Sound ( src, volume, maximum )
{
  this.src = src;
  this.volume = typeof volume == "number" ? volume : 0.5;
  this.maximum = typeof maximum == "number" ? maximum : Infinity;
  this.elms = [];
}
Sound.prototype.play = function ( vol )
{
  if ( typeof vol == "number" ) this.volume = vol;
  var toPlay;
  for ( var i = 0; i < this.elms.length; i++ )
  {
    var elm = this.elms[ i ];
    if ( elm.paused )
    {
      toPlay = elm;
      break;
    }
  }
  if ( !toPlay ) toPlay = this.add();
  toPlay.volume = this.volume;
  toPlay.play();
};
Sound.prototype.add = function ()
{
  if ( this.elms.length >= this.maximum )
  {
    return this.elms[ 0 ];
  }
  var elm = new Audio( this.src );
  this.elms.push( elm );
  return elm;
};

var LOAD_START = Date.now();
Array.prototype.remove = function ( a )
{
  var i = this.indexOf( a );
  if ( i !== -1 ) this.splice( i, 1 );
  return i !== -1;
};
Element.prototype.hide = function ()
{
  this.style.display = "none";
  if ( this.style.opacity == 1 ) this.style.opacity = 0;
};
Element.prototype.show = function ( seconds )
{
  this.style.display = "";
  var that = this;
  if ( seconds )
  {
    this.style.transition = "opacity " + seconds + "s ease 0s";
    setTimeout( function ()
    {
      that.style.opacity = 1;
    }, 20 );
  }
};
if ( !Array.prototype.includes )
{
  Array.prototype.includes = function ( val )
  {
    for ( var i = 0; i < this.length; i++ )
    {
      if ( this[ i ] === val ) return true;
    }
    return false;
  };
}
( function ()
{
  var ctxProto = CanvasRenderingContext2D.prototype;
  if ( ctxProto.resetTransform ) return;
  ctxProto.resetTransform = function ()
  {
    this.setTransform( 1, 0, 0, 1, 0, 0 );
  };
} )();

function bytesToHex ( r, g, b )
{
  return "#" + ( ( 1 << 24 ) | ( r << 16 ) | ( g << 8 ) | b ).toString( 16 ).slice( 1 );
}
function colorToBytes ( color )
{
  var c = color.slice( 1 );
  if ( c.length === 3 )
    c = c.split( "" ).map( function ( a )
    {
      return a + a;
    } );
  if ( c.length !== 6 ) throw new Error( "invalid color " + color );
  var v = parseInt( c, 16 );
  return {
    r: ( v >>> 16 ) & 255,
    g: ( v >>> 8 ) & 255,
    b: v & 255,
  };
}
function darkenColor ( color )
{
  var a = colorToBytes( color );
  return bytesToHex( a.r * 0.9, a.g * 0.9, a.b * 0.9 );
}
function cleanupObject ( object )
{
  for ( var i in object ) delete object[ i ];
}
var __buf = new DataView( new ArrayBuffer( 8 ) );
function Writer ( littleEndian )
{
  this._e = littleEndian;
  this.reset();
  return this;
}
Writer.prototype = {
  writer: true,
  reset: function ( littleEndian )
  {
    this._b = [];
    this._o = 0;
  },
  setUint8: function ( a )
  {
    if ( a >= 0 && a < 256 ) this._b.push( a );
    return this;
  },
  setInt8: function ( a )
  {
    if ( a >= -128 && a < 128 ) this._b.push( a );
    return this;
  },
  setUint16: function ( a )
  {
    __buf.setUint16( 0, a, this._e );
    this._move( 2 );
    return this;
  },
  setInt16: function ( a )
  {
    __buf.setInt16( 0, a, this._e );
    this._move( 2 );
    return this;
  },
  setUint32: function ( a )
  {
    __buf.setUint32( 0, a, this._e );
    this._move( 4 );
    return this;
  },
  setInt32: function ( a )
  {
    __buf.setInt32( 0, a, this._e );
    this._move( 4 );
    return this;
  },
  setFloat32: function ( a )
  {
    __buf.setFloat32( 0, a, this._e );
    this._move( 4 );
    return this;
  },
  setFloat64: function ( a )
  {
    __buf.setFloat64( 0, a, this._e );
    this._move( 8 );
    return this;
  },
  _move: function ( b )
  {
    for ( var i = 0; i < b; i++ ) this._b.push( __buf.getUint8( i ) );
  },
  setStringUTF8: function ( s )
  {
    var bytesStr = unescape( encodeURIComponent( s ) );
    for ( var i = 0, l = bytesStr.length; i < l; i++ )
      this._b.push( bytesStr.charCodeAt( i ) );
    this._b.push( 0 );
    return this;
  },
  build: function ()
  {
    return new Uint8Array( this._b );
  },
};
function Reader ( view, offset, littleEndian )
{
  this._e = littleEndian;
  if ( view ) this.repurpose( view, offset );
}
Reader.prototype = {
  reader: true,
  repurpose: function ( view, offset )
  {
    this.view = view;
    this._o = offset || 0;
  },
  getUint8: function ()
  {
    return this.view.getUint8( this._o++, this._e );
  },
  getInt8: function ()
  {
    return this.view.getInt8( this._o++, this._e );
  },
  getUint16: function ()
  {
    return this.view.getUint16( ( this._o += 2 ) - 2, this._e );
  },
  getInt16: function ()
  {
    return this.view.getInt16( ( this._o += 2 ) - 2, this._e );
  },
  getUint32: function ()
  {
    return this.view.getUint32( ( this._o += 4 ) - 4, this._e );
  },
  getInt32: function ()
  {
    return this.view.getInt32( ( this._o += 4 ) - 4, this._e );
  },
  getFloat32: function ()
  {
    return this.view.getFloat32( ( this._o += 4 ) - 4, this._e );
  },
  getFloat64: function ()
  {
    return this.view.getFloat64( ( this._o += 8 ) - 8, this._e );
  },
  getStringUTF8: function ()
  {
    var s = "",
      b;
    while ( ( b = this.view.getUint8( this._o++ ) ) !== 0 )
      s += String.fromCharCode( b );

    return decodeURIComponent( escape( s ) );
  },
};
var log = {
  verbosity: 0,
  error: function ()
  {
    if ( log.verbosity > 0 ) console.error.apply( null, arguments );
  },
  warn: function ()
  {
    if ( log.verbosity > 1 ) console.warn.apply( null, arguments );
  },
  info: function ()
  {
    if ( log.verbosity > 2 ) console.info.apply( null, arguments );
  },
  debug: function ()
  {
    if ( log.verbosity > 3 ) console.debug.apply( null, arguments );
  },
};

const LANG_URL = './assets/lang/';
const lang = {};

var wsUrl = null,
  SKIN_URL = "./assets/skins/",
  YTSKIN_URL = "./assets/youtuberskins/",
  USE_HTTPS = "https:" == window.location.protocol,
  EMPTY_NAME = "Don't kill me!",
  EMPTY_SKIN = 'no.png'
QUADTREE_MAX_POINTS = 15,
  CELL_POINTS_MIN = 5,
  CELL_POINTS_MAX = 80,
  VIRUS_POINTS = 80,
  PI_2 = Math.PI * 2,
  SEND_254 = new Uint8Array( [ 254, 6, 0, 0, 0 ] ),
  SEND_255 = new Uint8Array( [ 255, 1, 0, 0, 0 ] ),
  UINT8_CACHE = {
    1: new Uint8Array( [ 1 ] ),
    17: new Uint8Array( [ 17 ] ),
    21: new Uint8Array( [ 21 ] ),
    18: new Uint8Array( [ 18 ] ),
    19: new Uint8Array( [ 19 ] ),
    22: new Uint8Array( [ 22 ] ),
    23: new Uint8Array( [ 23 ] ),
    24: new Uint8Array( [ 24 ] ),
    25: new Uint8Array( [ 25 ] ),
    254: new Uint8Array( [ 254 ] ),
  },
  KEY_TO_CODE = {
    " ": UINT8_CACHE[ 17 ],
    w: UINT8_CACHE[ 21 ],
    q: UINT8_CACHE[ 18 ],
    e: UINT8_CACHE[ 22 ],
    r: UINT8_CACHE[ 23 ],
    t: UINT8_CACHE[ 24 ],
    p: UINT8_CACHE[ 25 ],
  },
  IE_KEYS = {
    spacebar: " ",
    esc: "escape",
  };

function loadLanguage ( langCode )
{
  fetch( `${ LANG_URL }${ langCode }.json` )
    .then( response => response.json() )
    .then( translations =>
    {
      Object.assign( lang, translations );
      applyTranslations();
    } )
    .catch( error => Logger.error( 'Error loading language file:', error ) );
}

function wsCleanup ()
{
  if ( !ws ) return;
  log.debug( "ws cleanup trigger" );
  ws.onopen = null;
  ws.onmessage = null;
  ws.close();
  ws = null;
}
function wsInit ( url )
{
  if ( ws )
  {
    log.debug( "ws init on existing conn" );
    wsCleanup();
  }
  byId( "connecting" ).show( 0.5 );
  showESCOverlay();
  // Accept either a full websocket URL (ws:// or wss://) or a host:port string.
  let finalUrl = url;
  if ( typeof finalUrl === 'string' && !/^wss?:\/\//i.test( finalUrl ) )
  {
    finalUrl = "ws" + ( USE_HTTPS ? "s" : "" ) + "://" + ( wsUrl = url );
  } else
  {
    // if a full URL was provided, store it as wsUrl as-is
    wsUrl = finalUrl;
  }
  ws = new WebSocket( finalUrl );
  ws.binaryType = "arraybuffer";
  ws.onopen = wsOpen;
  ws.onmessage = wsMessage;
  ws.onerror = wsError;
  ws.onclose = wsClose;
}

// Alias to allow other scripts to request a direct websocket URL connection
window.connectToWsUrl = function ( url )
{
  try { wsInit( url ); }
  catch ( e ) { log.error( 'connectToWsUrl failed', e ); }
};
function wsOpen ()
{
  disconnectDelay = 1;
  byId( "connecting" ).hide();
  wsSend( SEND_254 );
  wsSend( SEND_255 );
  showESCOverlay();
}
function wsError ( error )
{
  log.warn( error );
}
function wsClose ( e )
{
  log.debug( "ws disconnected " + e.code + " '" + e.reason + "'" );
  wsCleanup();
  gameReset();
  setTimeout( function ()
  {
    if ( ws && ws.readyState === 1 ) return;
    wsInit( wsUrl );
  }, ( disconnectDelay *= 2 ) );
}
function wsSend ( data )
{
  if ( !ws ) return;
  if ( ws.readyState !== 1 ) return;
  if ( data.build ) ws.send( data.build() );
  else ws.send( data );
}
function wsMessage ( data )
{
  syncUpdStamp = Date.now();
  var reader = new Reader( new DataView( data.data ), 0, true );
  var packetId = reader.getUint8();
  switch ( packetId )
  {
    case 0x10: // update nodes
      var killer,
        killed,
        id,
        node,
        x,
        y,
        s,
        flags,
        cell,
        updColor,
        updName,
        updSkin,
        count,
        color,
        name,
        skin;

      // consume records
      count = reader.getUint16();
      for ( var i = 0; i < count; i++ )
      {
        killer = reader.getUint32();
        killed = reader.getUint32();
        if (
          !cells.byId.hasOwnProperty( killer ) ||
          !cells.byId.hasOwnProperty( killed )
        )
          continue;
        if ( settings.playSounds && cells.mine.includes( killer ) )
        {
          ( cells.byId[ killed ].s < 20 ? foodSound : eatSound ).play(
            parseFloat( 1 )
          );
        }
        cells.byId[ killed ].destroy( killer );
      }

      // update records
      while ( true )
      {
        id = reader.getUint32();
        if ( id === 0 ) break;

        x = reader.getInt32();
        y = reader.getInt32();
        s = reader.getUint16();

        flags = reader.getUint8();
        updColor = !!( flags & 0x02 );
        updSkin = !!( flags & 0x04 );
        updName = !!( flags & 0x08 );
        color = updColor
          ? bytesToHex( reader.getUint8(), reader.getUint8(), reader.getUint8() )
          : null;
        skin = updSkin ? reader.getStringUTF8() : null;
        name = updName ? reader.getStringUTF8() : null;

        if ( cells.byId.hasOwnProperty( id ) )
        {
          cell = cells.byId[ id ];
          cell.update( syncUpdStamp );
          cell.updated = syncUpdStamp;
          cell.ox = cell.x;
          cell.oy = cell.y;
          cell.os = cell.s;
          cell.nx = x;
          cell.ny = y;
          cell.ns = s;
          cell.viewRange = Math.ceil( cell.ns * 20 * camera.userZoom * 2 );
          if ( color ) cell.setColor( color );
          if ( name ) cell.setName( name );
          if ( skin ) cell.setSkin( skin );
        } else
        {
          cell = new Cell( id, x, y, s, name, color, skin, flags );
          cells.byId[ id ] = cell;
          cells.list.push( cell );
        }
      }
      // dissapear records
      count = reader.getUint16();
      for ( i = 0; i < count; i++ )
      {
        killed = reader.getUint32();
        if ( cells.byId.hasOwnProperty( killed ) && !cells.byId[ killed ].destroyed )
          cells.byId[ killed ].destroy( null );
      }
      break;
    case 0x11: // update pos
      camera.target.x = reader.getFloat32();
      camera.target.y = reader.getFloat32();
      camera.target.scale = reader.getFloat32();
      camera.target.scale *= camera.viewportScale;
      camera.target.scale *= camera.userZoom;
      break;
    case 0x12: // clear all
      for ( var i in cells.byId ) cells.byId[ i ].destroy( null );
    case 0x14: // clear my cells
      cells.mine = [];
      break;
    case 0x15: // draw line
      log.warn( "got packet 0x15 (draw line) which is unsupported" );
      break;
    case 0x20: // new cell
      cells.mine.push( reader.getUint32() );
      break;
    case 0x30: // text list
      leaderboard.items = [];
      leaderboard.type = "text";

      var count = reader.getUint32();
      for ( i = 0; i < count; ++i )
        leaderboard.items.push( reader.getStringUTF8() );
      drawLeaderboard();
      break;
    case 0x31: // ffa list
      leaderboard.items = [];
      leaderboard.type = "ffa";

      var count = reader.getUint32();
      for ( i = 0; i < count; ++i )
      {
        var isMe = !!reader.getUint32();
        var name = reader.getStringUTF8();
        leaderboard.items.push( {
          me: isMe,
          name: Cell.prototype.parseName( name ).name || EMPTY_NAME,
        } );
      }
      drawLeaderboard();
      break;
    case 0x32: // pie chart
      leaderboard.items = [];
      leaderboard.type = "pie";

      var count = reader.getUint32();
      for ( i = 0; i < count; ++i ) leaderboard.items.push( reader.getFloat32() );
      drawLeaderboard();
      break;
    case 0x40: // set border
      border.left = reader.getFloat64();
      border.top = reader.getFloat64();
      border.right = reader.getFloat64();
      border.bottom = reader.getFloat64();
      border.width = border.right - border.left;
      border.height = border.bottom - border.top;
      border.centerX = ( border.left + border.right ) / 2;
      border.centerY = ( border.top + border.bottom ) / 2;
      if ( data.data.byteLength === 33 ) break;
      if ( !mapCenterSet )
      {
        mapCenterSet = true;
        camera.x = camera.target.x = border.centerX;
        camera.y = camera.target.y = border.centerY;
        camera.scale = camera.target.scale = 1;
      }
      reader.getUint32(); // game type
      if ( stats.pingLoopId ) break;
      stats.pingLoopId = setInterval( () =>
      {
        wsSend( UINT8_CACHE[ 254 ] );
        stats.pingLoopStamp = Date.now();
      }, 1000 );
      break;
    case 0x63: // chat message
      var flags = reader.getUint8();
      var color = bytesToHex(
        reader.getUint8(),
        reader.getUint8(),
        reader.getUint8()
      );

      var name = reader.getStringUTF8();
      name = Cell.prototype.parseName( name ).name || EMPTY_NAME;
      var message = reader.getStringUTF8();

      var server = !!( flags & 0x80 ),
        admin = !!( flags & 0x40 ),
        mod = !!( flags & 0x20 );

      if ( server && name !== "SERVER" ) name = "[SERVER] " + name;
      if ( admin ) name = "[ADMIN] " + name;
      if ( mod ) name = "[MOD] " + name;
      var wait = Math.max( 3000, 1000 + message.length * 150 );
      chat.waitUntil =
        syncUpdStamp - chat.waitUntil > 1000
          ? syncUpdStamp + wait
          : chat.waitUntil + wait;
      chat.messages.push( {
        server: server,
        admin: admin,
        mod: mod,
        color: color,
        name: name,
        message: message,
        time: syncUpdStamp,
      } );
      if ( settings.showChat ) drawChat();
      break;
    case 0xfe: // server stat
      stats.info = JSON.parse( reader.getStringUTF8() );
      stats.latency = syncUpdStamp - stats.pingLoopStamp;
      //drawStats();
      break;
    default:
      // invalid packet
      wsCleanup();
      break;
  }
}
function sendMouseMove ( x, y )
{
  var writer = new Writer( true );
  writer.setUint8( 0x10 );
  writer.setUint32( x );
  writer.setUint32( y );
  writer._b.push( 0, 0, 0, 0 );
  wsSend( writer );
}
function sendPlay ( name )
{
  var writer = new Writer( true );
  writer.setUint8( 0x00 );
  writer.setStringUTF8( name );
  wsSend( writer );
}
function sendChat ( text )
{
  var writer = new Writer();
  writer.setUint8( 0x63 );
  writer.setUint8( 0 );
  writer.setStringUTF8( text );
  wsSend( writer );
}

function gameReset ()
{
  cacheCleanup();
  cleanupObject( cells );
  cleanupObject( border );
  cleanupObject( leaderboard );
  cleanupObject( chat );
  cleanupObject( stats );
  chat.messages = [];
  leaderboard.items = [];
  cells.mine = [];
  cells.byId = {};
  cells.list = [];
  camera.x = camera.y = camera.target.x = camera.target.y = 0;
  camera.scale = camera.target.scale = 1;
  mapCenterSet = false;
}

var cells = Object.create( {
  mine: [],
  byId: {},
  list: [],
} );
var border = Object.create( {
  left: -2000,
  right: 2000,
  top: -2000,
  bottom: 2000,
  width: 4000,
  height: 4000,
  centerX: -1,
  centerY: -1,
} );
var leaderboard = Object.create( {
  type: NaN,
  items: null,
  canvas: document.createElement( "canvas" ),
  teams: [ "#F33", "#3F3", "#33F" ],
} );
var chat = Object.create( {
  messages: [],
  waitUntil: 0,
  canvas: document.createElement( "canvas" ),
  visible: false,
} );
var stats = Object.create( {
  fps: 0,
  latency: NaN,
  supports: null,
  info: null,
  pingLoopId: NaN,
  pingLoopStamp: null,
  canvas: document.createElement( "canvas" ),
  visible: false,
  score: NaN,
  maxScore: 0,
} );

var ws = null;
var wsUrl = null;
var disconnectDelay = 1;

var syncUpdStamp = Date.now();
var syncAppStamp = Date.now();

var mainCanvas = null;
var mainCtx = null;
var soundsVolume;
var knownSkins = {};
var ytknownSkins = {};
var loadedSkins = {};
var loadedytSkins = {};
var escOverlayShown = false;
var isTyping = false;
var chatBox = null;
var mapCenterSet = false;
var minionControlled = false;
var camera = {
  x: 0,
  y: 0,
  target: {
    x: 0,
    y: 0,
    scale: 1,
  },
  viewportScale: 1,
  userZoom: 0.8,
  sizeScale: 1,
  scale: 1,
};
var mouseX = NaN;
var mouseY = NaN;
var skinList = [];
var youtuberskinList = [];
var macroCooldown = 0 / 7;
var macroCooldown2 = 0 / 7;
var macroCooldown2 = 40;
var macroCooldown3 = 50;
var macroCooldown4 = 40;
var macroCooldown5 = 50;
var macroIntervalID;
var macroIntervalEJECT;
var quadtree;

var settings = {
  nick: "",
  skin: "",
  gamemode: "",
  showFPS: true,
  showPing: true,
  showSkins: true,
  showNames: true,
  askBeforeLeaving: true,
  showLeaderboard: true,
  darkTheme: false,
  showColor: true,
  showMass: true,
  showShortMass: true,
  _showChat: true,
  get showChat ()
  {
    return this._showChat;
  },
  set showChat ( a )
  {
    var chat = byId( "chat_textbox" );
    a ? chat.show() : chat.hide();
    this._showChat = a;
  },
  showMinimap: true,
  showMinimapSectors: true,
  showMinimapNickname: true,
  showPosition: false,
  showBorder: true,
  showMapBorder: true,
  showGrid: true,
  playSounds: true,
  soundsVolume: 1,
  moreZoom: false,
  fillSkin: true,
  backgroundSectors: false,
  jellyPhysics: true,
  animationDelay: 165,
  drawNamesDistance: 20000,
};
var pressed = {
  " ": false,
  w: false,
  e: false,
  r: false,
  t: false,
  p: false,
  q: false,
  escape: false,
};

var eatSound = new Sound( "./assets/sound/eat.mp3", 0.5, 10 );
var foodSound = new Sound( "./assets/sound/food.mp3", 0.5, 10 );


// Cargar skins normales
request( "./assets/txt-Skins/skinList.txt", function ( data )
{
  if ( !data )
  {
    console.error( "No se pudo cargar ./assets/txt-Skins/skinList.txt o está vacío" );
    return;
  }

  var skins = data.toUpperCase().split( "," );
  var sortedSkins = [];

  // Ordena las skins alfabéticamente
  for ( var i = 0; i < skins.length; i++ )
  {
    if ( !sortedSkins.includes( skins[ i ].toUpperCase() ) )
    {
      sortedSkins.push( skins[ i ].toUpperCase() );
    }
  }

  knownSkins = {};
  var stamp = Date.now();
  for ( var i = 0; i < sortedSkins.length; i++ )
  {
    knownSkins[ sortedSkins[ i ] ] = stamp;
  }
  if ( typeof buildGallery === 'function' )
  {
    buildGallery();
  }
} );



// Cargar skins de youtubers
request(
  "./assets/txt-Skins/youtuberskinList.txt",
  function ( data )
  {
    if ( !data )
    {
      console.error( "No se pudo cargar ./assets/txt Skins/youtuberskinList.txt o está vacío" );
      return;
    }
    var skins = data.split( "," );
    var stamp = Date.now();
    for ( var i = 0; i < skins.length; i++ )
    {
      skins[ i ] = skins[ i ].toUpperCase(); // Convertir a mayúsculas
    }
    skins.sort(); // Ordenar alfabéticamente
  }
);





function hideESCOverlay ()
{
  escOverlayShown = false;
  byId( "overlays" ).hide();
}
function showESCOverlay ()
{
  escOverlayShown = true;
  byId( "overlays" ).show( 0.5 );
}

function toCamera ( ctx )
{
  ctx.translate( mainCanvas.width / 2, mainCanvas.height / 2 );
  scaleForth( ctx );
  ctx.translate( -camera.x, -camera.y );
}
function scaleForth ( ctx )
{
  ctx.scale( camera.scale, camera.scale );
}
function scaleBack ( ctx )
{
  ctx.scale( 1 / camera.scale, 1 / camera.scale );
}
function fromCamera ( ctx )
{
  ctx.translate( camera.x, camera.y );
  scaleBack( ctx );
  ctx.translate( -mainCanvas.width / 2, -mainCanvas.height / 2 );
}

function initSetting ( id, elm )
{
  function simpleAssignListen ( id, elm, prop )
  {
    if ( settings[ id ] !== "" ) elm[ prop ] = settings[ id ];
    elm.addEventListener( "change", function ()
    {
      requestAnimationFrame( function ()
      {
        settings[ id ] = elm[ prop ];
      } );
    } );
  }
  switch ( elm.tagName.toLowerCase() )
  {
    case "input":
      switch ( elm.type.toLowerCase() )
      {
        case "range":
        case "text":
          simpleAssignListen( id, elm, "value" );
          break;
        case "checkbox":
          simpleAssignListen( id, elm, "checked" );
          break;
      }
      break;
    case "select":
      simpleAssignListen( id, elm, "value" );
      break;
  }
}
function loadSettings ()
{
  var text = localStorage.getItem( "settings" );
  var obj = text ? JSON.parse( text ) : settings;
  for ( var prop in settings )
  {
    var elm = byId( prop.charAt( 0 ) === "_" ? prop.slice( 1 ) : prop );
    if ( elm )
    {
      if ( obj.hasOwnProperty( prop ) ) settings[ prop ] = obj[ prop ];
      initSetting( prop, elm );
    } else
      log.info(
        "setting " + prop + " not loaded because there is no element for it."
      );
  }
}
function storeSettings ()
{
  localStorage.setItem( "settings", JSON.stringify( settings ) );
}

function request ( url, callback, method, type )
{
  if ( !method ) method = "GET";
  if ( !type ) type = "text";
  var req = new XMLHttpRequest();
  req.onload = function ()
  {
    callback( this.response );
  };
  req.onerror = function ()
  {
    console.error( '[request] Error al cargar', url );
  };
  req.open( method, url );
  req.responseType = type;
  req.send();
}

function buildGallery ()
{
  var c = "";
  var sortedKeys = Object.keys( knownSkins ).sort();
  for ( var i = 0; i < sortedKeys.length; i++ )
  {
    var name = sortedKeys[ i ];
    c += '<li class="skin" onclick="changeSkin(\'' + name + "')\">";
    c += '<img class="circular" src="assets/skins/' + name + '.png">';
    c += '<h4 class="skinName">' + name + "</h4>";
    c += "</li>";
  }
  var galleryBodyEl = byId( "gallery-body" );
  if ( galleryBodyEl )
  {
    galleryBodyEl.innerHTML = '<ul id="skinsUL">' + c + "</ul>";
  } else
  {
    // Si el contenedor no existe aún, reintentar después de DOMContentLoaded
    document.addEventListener( 'DOMContentLoaded', function onReady ()
    {
      document.removeEventListener( 'DOMContentLoaded', onReady );
      var el = byId( 'gallery-body' );
      if ( el ) el.innerHTML = '<ul id="skinsUL">' + c + "</ul>";
    } );
  }
  if ( sortedKeys.length === 0 )
  {
    console.warn( '[buildGallery] No hay skins para mostrar en la galería.' );
  }
}

function showYoutuberSkins ()
{
  var c = "";
  var sortedKeys = Object.keys( ytknownSkins ).sort();
  for ( var i = 0; i < sortedKeys.length; i++ )
  {
    var name = sortedKeys[ i ];
    c += `<li class="skin" onclick="changeSkin('${ name }')">`;
    c += `<img class="circular" src="/assets/skins/${ name }.png">`;
    c += `<h4 class="skinName">${ name }</h4>`;
    c += '</li>';
  }
  byId( "gallery-yt-body" ).innerHTML = '<ul id="skinsUL">' + c + "</ul>";
}

function buildSettingsWindow ()
{
  // byId("settings-window").innerHTML = '<label class="control control-checkbox">Show skins<input id="showSkins" type="checkbox" /><div class="control_indicator"></div></label>';
}

function drawChat ()
{
  if ( chat.messages.length === 0 && settings.showChat )
    return ( chat.visible = false );
  chat.visible = true;
  var canvas = chat.canvas;
  var ctx = canvas.getContext( "2d" );
  var latestMessages = chat.messages.slice( -15 );
  var lines = [];
  for ( var i = 0, len = latestMessages.length; i < len; i++ )
    lines.push( [
      {
        text: latestMessages[ i ].name,
        color: latestMessages[ i ].color,
      },
      {
        text: " " + latestMessages[ i ].message,
        color: settings.darkTheme ? "#FFF" : "#000",
      },
    ] );
  var width = 0;
  var height = 500;
  for ( var i = 0; i < len; i++ )
  {
    var thisLineWidth = 0;
    var complexes = lines[ i ];
    for ( var j = 0; j < complexes.length; j++ )
    {
      ctx.font = "26px Ubuntu";
      complexes[ j ].width = ctx.measureText( complexes[ j ].text ).width;
      thisLineWidth += complexes[ j ].width;
    }
    width = Math.max( thisLineWidth, width );
  }
  canvas.width = width;
  canvas.height = height;
  for ( var i = 0; i < len; i++ )
  {
    width = 0;
    var complexes = lines[ i ];
    for ( var j = 0; j < complexes.length; j++ )
    {
      ctx.font = "26px Ubuntu";
      ctx.fillStyle = complexes[ j ].color;
      ctx.fillText( complexes[ j ].text, width, 20 * ( 1 + i ) );
      width += complexes[ j ].width;
    }
  }
}

/*function drawStats ()
{
  if ( !stats.info ) return ( stats.visible = false );
  stats.visible = true;
  const rows = [
    `${ stats.info.name } (${ stats.info.mode })`,
    // `${ stats.info.playersTotal } / ${ stats.info.playersLimit } ${ 'players' }`,
    //`${ stats.info.playersAlive } ${ 'playing' }`,
    //`${ stats.info.playersSpect } ${ 'spectating' }`,
  ];

  var canvas = stats.canvas;
  var ctx = canvas.getContext( "2d" );
  ctx.font = "18px Ubuntu";
  var width = 10;
  for ( var i = 0; i < rows.length; i++ )
    width = Math.max( width, 2 + ctx.measureText( rows[ i ] ).width + 2 );
  canvas.width = width;
  canvas.height = rows.length * ( 14 + 2 );
  ctx.font = "18px Ubuntu";
  ctx.fillStyle = settings.darkTheme ? "#AAA" : "#555";
  ctx.textBaseline = "top";
  for ( var i = 0; i < rows.length; i++ )
    ctx.fillText( rows[ i ], 4, -1 + i * ( 14 + 2 ) );
  ctx.textBaseline = "bottom";
  for ( var i = 0; i < rows.length; i++ )
    ctx.fillText( rows[ i ], 2, -1 + i * ( 14 + 2 ) );
}
*/

function drawPosition ()
{
  if ( border.centerX !== 0 || border.centerY !== 0 || !settings.showPosition )
    return;
  var width = 200 * ( border.width / border.height );
  var height = 40 * ( border.height / border.width );

  var beginX = mainCanvas.width / camera.viewportScale - width;
  var beginY = mainCanvas.height / camera.viewportScale - height;

  if ( settings.showMinimap )
  {
    mainCtx.font = "15px Ubuntu";
    beginX += width / 2 - 1;
    beginY = beginY - ( 194 * border.height ) / border.width;
    mainCtx.textAlign = "right";
    mainCtx.fillStyle = settings.darkTheme ? "#AAA" : "#555";
    mainCtx.fillText(
      "X: " + ~~camera.x + ", Y: " + ~~camera.y,
      beginX + width / 2,
      beginY + height / 2
    );
  } else
  {
    mainCtx.fillStyle = "#000";
    mainCtx.globalAlpha = 0.4;
    mainCtx.fillRect( beginX, beginY, width, height );
    mainCtx.globalAlpha = 1;
    drawRaw(
      mainCtx,
      beginX + width / 2,
      beginY + height / 2,
      "X: " + ~~camera.x + ", Y: " + ~~camera.y
    );
  }
}

function prettyPrintTime ( seconds )
{
  seconds = ~~seconds;
  var minutes = ~~( seconds / 60 );
  if ( minutes < 1 ) return "<1 min";
  var hours = ~~( minutes / 60 );
  if ( hours < 1 ) return minutes + "min";
  var days = ~~( hours / 24 );
  if ( days < 1 ) return hours + "h";
  return days + "d";
}

function drawLeaderboard ()
{
  if ( leaderboard.type === NaN ) return ( leaderboard.visible = false );
  if ( !settings.showLeaderboard || leaderboard.items.length === 0 )
    return ( leaderboard.visible = false );
  leaderboard.visible = true;
  var canvas = leaderboard.canvas;
  var ctx = canvas.getContext( "2d" );
  var len = leaderboard.items.length;

  canvas.width = 200;
  canvas.height = leaderboard.type !== "pie" ? 60 + 24 * len : 240;

  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#000";
  ctx.fillRect( 0, 0, 200, canvas.height );

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#FFF";
  ctx.font = "30px Ubuntu";
  ctx.fillText(
    "Leaderboard",
    100 - ctx.measureText( "Leaderboard" ).width / 2,
    40
  );

  if ( leaderboard.type === "pie" )
  {
    var last = 0;
    for ( var i = 0; i < len; i++ )
    {
      ctx.fillStyle = leaderboard.teams[ i ];
      ctx.beginPath();
      ctx.moveTo( 100, 140 );
      ctx.arc( 100, 140, 80, last, ( last += leaderboard.items[ i ] * PI_2 ), false );
      ctx.closePath();
      ctx.fill();
    }
  } else
  {
    var text,
      isMe = false,
      w,
      start;
    ctx.font = "20px Ubuntu";
    for ( var i = 0; i < len; i++ )
    {
      if ( leaderboard.type === "text" ) text = leaderboard.items[ i ];
      else ( text = leaderboard.items[ i ].name ), ( isMe = leaderboard.items[ i ].me );

      ctx.fillStyle = isMe ? "rgba(147, 236, 106, 1)" : "#FFF";
      if ( leaderboard.type === "ffa" ) text = i + 1 + ". " + text;
      var start = ( w = ctx.measureText( text ).width ) > 200 ? 2 : 100 - w * 0.5;
      ctx.fillText( text, start, 70 + 24 * i );
    }
  }
}
function drawGrid ()
{
  mainCtx.save();
  mainCtx.lineWidth = 1;
  mainCtx.strokeStyle = settings.darkTheme ? "#c0c9cd" : "#0e0f0e";
  mainCtx.globalAlpha = 0.2;
  var step = 50,
    i,
    cW = mainCanvas.width / camera.scale,
    cH = mainCanvas.height / camera.scale,
    startLeft = ( -camera.x + cW / 2 ) % step,
    startTop = ( -camera.y + cH / 2 ) % step;

  scaleForth( mainCtx );
  mainCtx.beginPath();
  for ( i = startLeft; i < cW; i += step )
  {
    mainCtx.moveTo( i, 0 );
    mainCtx.lineTo( i, cH );
  }
  for ( i = startTop; i < cH; i += step )
  {
    mainCtx.moveTo( 0, i );
    mainCtx.lineTo( cW, i );
  }
  mainCtx.stroke();
  mainCtx.restore();
}
function drawBackgroundSectors ()
{
  if ( border === undefined || border.width === undefined ) return;
  mainCtx.save();

  var sectorCount = 5;
  var sectorNames = [ "ABCDE", "12345" ];
  var w = border.width / sectorCount;
  var h = border.height / sectorCount;

  toCamera( mainCtx );
  mainCtx.fillStyle = settings.darkTheme ? "#666" : "#DDD";
  mainCtx.textBaseline = "middle";
  mainCtx.textAlign = "center";
  mainCtx.font = ( ( w / 3 ) | 0 ) + "px Ubuntu";

  for ( var y = 0; y < sectorCount; ++y )
  {
    for ( var x = 0; x < sectorCount; ++x )
    {
      var str = sectorNames[ 0 ][ x ] + sectorNames[ 1 ][ y ];
      var dx = ( x + 0.5 ) * w + border.left;
      var dy = ( y + 0.5 ) * h + border.top;
      mainCtx.fillText( str, dx, dy );
    }
  }
  mainCtx.restore();
}
function drawMinimap ()
{
  if ( border.centerX !== 0 || border.centerY !== 0 || !settings.showMinimap )
    return;
  mainCtx.save();
  mainCtx.resetTransform();
  var targetSize = 200;
  var borderAR = border.width / border.height; // aspect ratio
  var width = targetSize * borderAR * camera.viewportScale;
  var height = ( targetSize / borderAR ) * camera.viewportScale;
  var beginX = mainCanvas.width - width;
  var beginY = mainCanvas.height - height;

  mainCtx.fillStyle = "#000";
  mainCtx.globalAlpha = 0.4;
  mainCtx.fillRect( beginX, beginY, width, height );
  mainCtx.globalAlpha = 1;

  var sectorCount = 5;
  var sectorNames = [ "ABCDE", "12345" ];
  var sectorWidth = width / sectorCount;
  var sectorHeight = height / sectorCount;
  var sectorNameSize = Math.min( sectorWidth, sectorHeight ) / 3;

  mainCtx.fillStyle = settings.darkTheme ? "#666" : "#DDD";
  mainCtx.textBaseline = "middle";
  mainCtx.textAlign = "center";
  mainCtx.font = sectorNameSize + "px Ubuntu";

  if ( settings.showMinimapSectors )
  {
    for ( var i = 0; i < sectorCount; i++ )
    {
      var x = ( i + 0.5 ) * sectorWidth;
      for ( var j = 0; j < sectorCount; j++ )
      {
        var y = ( j + 0.5 ) * sectorHeight;
        mainCtx.fillText(
          sectorNames[ 0 ][ i ] + sectorNames[ 1 ][ j ],
          beginX + x,
          beginY + y
        );
      }
    }
  }

  var xScaler = width / border.width;
  var yScaler = height / border.height;
  var halfWidth = border.width / 2;
  var halfHeight = border.height / 2;
  var myPosX = beginX + ( camera.x + halfWidth ) * xScaler;
  var myPosY = beginY + ( camera.y + halfHeight ) * yScaler;

  var xIndex = ( ( myPosX - beginX ) / sectorWidth ) | 0;
  var yIndex = ( ( myPosY - beginY ) / sectorHeight ) | 0;
  var lightX = beginX + xIndex * sectorWidth;
  var lightY = beginY + yIndex * sectorHeight;
  mainCtx.fillStyle = "yellow";
  mainCtx.globalAlpha = 0.3;
  mainCtx.fillRect( lightX, lightY, sectorWidth, sectorHeight );
  mainCtx.globalAlpha = 1;

  mainCtx.beginPath();
  if ( cells.mine.length )
  {
    for ( var i = 0; i < cells.mine.length; i++ )
    {
      var cell = cells.byId[ cells.mine[ i ] ];
      if ( cell )
      {
        mainCtx.fillStyle = cell.color; // repeat assignment of same color is OK
        var x = beginX + ( cell.x + halfWidth ) * xScaler;
        var y = beginY + ( cell.y + halfHeight ) * yScaler;
        var r = ( Math.max( cell.s, 200 ) * ( xScaler + yScaler ) ) / 2;
        mainCtx.moveTo( x + r, y );
        mainCtx.arc( x, y, r, 0, PI_2 );
      }
    }
  } else
  {
    mainCtx.fillStyle = "#FAA";
    mainCtx.arc( myPosX, myPosY, 5, 0, PI_2 );
  }
  mainCtx.fill();

  // draw name above user's pos if they have a cell on the screen
  var cell = null;
  for ( var i = 0, l = cells.mine.length; i < l; i++ )
    if ( cells.byId.hasOwnProperty( cells.mine[ i ] ) )
    {
      cell = cells.byId[ cells.mine[ i ] ];
      break;
    }
  if ( cell !== null )
  {
    mainCtx.fillStyle = settings.darkTheme ? "#DDD" : "#222";
    var textSize = sectorNameSize;
    mainCtx.font = textSize + "px Ubuntu";

    if ( settings.showMinimapNickname )
    {
      mainCtx.fillText(
        cell.name || EMPTY_NAME,
        myPosX,
        myPosY - 7 - textSize / 2
      );
    }
  }

  mainCtx.restore();
}

/**
 * Dibuja el fondo de la pantalla.
 */
function drawFondo ()
{
  if ( typeof window._fondoImagenLoaded !== 'boolean' )
  {
    window._fondoImagenLoaded = false;
  }

  try
  {
    if ( !window._fondoImagen )
    {
      const rutaImagen = 'https://gloobix-io.onrender.com/web/assets/skins/no.png';
      window._fondoImagen = new Image();
      window._fondoImagen.src = rutaImagen;

      window._fondoImagen.addEventListener( 'load', () =>
      {
        window._fondoImagenLoaded = true;
      } );

      if ( window._fondoImagen.readyState === window._fondoImagen.LOAD )
      {
        drawFondo(); // Se llama a la función para que se repita el proceso
      }
    } else
    {
      mainCtx.drawImage( window._fondoImagen, 0, 0, mainCanvas.width, mainCanvas.height );
    }
  } catch ( e )
  {
    console.error( `Error al dibujar o cargar el fondo: ${ e.message }` );
  }
}



function drawBorders ()
{
  if ( !settings.showBorder ) return;
  mainCtx.strokeStyle = "#0000ff";
  mainCtx.lineWidth = 10;
  mainCtx.lineCap = "round";
  mainCtx.lineJoin = "round";
  mainCtx.beginPath();
  mainCtx.moveTo( border.left, border.top );
  mainCtx.lineTo( border.right, border.top );
  mainCtx.lineTo( border.right, border.bottom );
  mainCtx.lineTo( border.left, border.bottom );
  mainCtx.closePath();
  if ( settings.showMapBorder )
    mainCtx.stroke();
}
function askleavi ()
{
  if ( settings.askBeforeLeaving )
  {
    alert( "¿Seguro que quieres salir?" )
  };
}


function drawGame ()
{
  stats.fps += ( 1000 / Math.max( Date.now() - syncAppStamp, 1 ) - stats.fps ) / 10;
  syncAppStamp = Date.now();

  var drawList = cells.list.slice( 0 ).sort( cellSort );
  for ( var i = 0, l = drawList.length; i < l; i++ )
    drawList[ i ].update( syncAppStamp );
  cameraUpdate();
  if ( settings.jellyPhysics )
  {
    updateQuadtree();
    for ( var i = 0, l = drawList.length; i < l; ++i )
    {
      var cell = drawList[ i ];
      cell.updateNumPoints();
      cell.movePoints();
    }
  }

  mainCtx.save();

  drawFondo();

  mainCtx.fillStyle = settings.darkTheme ? "#000" : "#f0faff";
  mainCtx.fillRect( 0, 0, mainCanvas.width, mainCanvas.height );
  if ( settings.showGrid ) drawGrid();
  if ( settings.backgroundSectors ) drawBackgroundSectors();

  toCamera( mainCtx );
  drawBorders();

  // Identificar la célula más grande del jugador
  var biggestMineCellId = null;
  var biggestMineCellSize = -1;
  for ( var i = 0; i < cells.mine.length; i++ )
  {
    var cell = cells.byId[ cells.mine[ i ] ];
    if ( cell && cell.s > biggestMineCellSize )
    {
      biggestMineCellSize = cell.s;
      biggestMineCellId = cell.id;
    }
  }

  // Dibujar todas las células, pero solo la más grande muestra nombre/masa
  for ( var i = 0, l = drawList.length; i < l; i++ )
  {
    drawList[ i ].draw( mainCtx, biggestMineCellId );
  }

  fromCamera( mainCtx );
  quadtree = null;
  mainCtx.scale( camera.viewportScale, camera.viewportScale );

  var height = 20;
  mainCtx.fillStyle = settings.darkTheme ? "#f0faff" : "#000";
  mainCtx.textBaseline = "top";
  if ( !isNaN( stats.score ) )
  {
    mainCtx.font = "30px Ubuntu";
    mainCtx.fillText( "Score: " + stats.score, 20, height );
    height += 30;
  } mainCtx.font = '30px Ubuntu';
  const sping = settings.showPing ? ( isNaN( stats.latency ) ? '' : ` ${ 'ping:' }${ stats.latency }` ) : "";
  const gameStatsText = settings.showFPS ? `${ 'fps:' } ${ ~~stats.fps }` + sping : sping;

  if ( !stats.info ? stats.visible = false : stats.visible = true )
  {
    const modeStat = `Gamemode: (${ stats.info.mode })`;
    const totalPlaStats = `${ 'players:' } ${ ~~stats.info.playersTotal } / ${ stats.info.playersLimit }`;
    const PlayingStat = `${ 'playing:' } ${ ~~stats.info.playersAlive }`;
    const spectatinStat = `${ 'spectating:' } ${ ~~stats.info.playersSpect }`;
    if ( gameStatsText )
    {
      mainCtx.fillText( gameStatsText, 20, height );
      height += 24;
    }

    mainCtx.fillText( modeStat, 20, height );
    height += 26;

    mainCtx.fillText( totalPlaStats, 20, height );
    height += 28;

    mainCtx.fillText( PlayingStat, 20, height );
    height += 30;

    mainCtx.fillText( spectatinStat, 20, height );
    height += 32;
  }


  if ( stats.visible ) mainCtx.drawImage( stats.canvas, 2, height );
  if ( leaderboard.visible )
    mainCtx.drawImage(
      leaderboard.canvas,
      mainCanvas.width / camera.viewportScale - 10 - leaderboard.canvas.width,
      10
    );
  if ( settings.showChat && ( chat.visible || isTyping ) )
  {
    // mainCtx.globalAlpha = isTyping ? 1 : Math.max(1000 - syncAppStamp + chat.waitUntil, 0) / 1000;
    mainCtx.textBaseline = "bottom";
    mainCtx.drawImage(
      chat.canvas,
      3 / camera.viewportScale,
      // 5 / camera.viewportScale,      - old value
      chat.canvas.height / camera.viewportScale - chat.canvas.height
      //(mainCanvas.height - 10) / camera.viewportScale - chat.canvas.height - old value
    );
    mainCtx.globalAlpha = 1;
  }
  drawMinimap();
  drawPosition();

  mainCtx.restore();

  if ( minionControlled )
  {
    mainCtx.save();
    mainCtx.font = "12px Ubuntu";
    mainCtx.textAlign = "center";
    mainCtx.textBaseline = "normal";
    mainCtx.fillStyle = "#eea236";
    var text = "You are controlling a minion, press Q to switch back.";
    mainCtx.fillText( text, mainCanvas.width / 2, 5 );
    mainCtx.restore();
  }

  cacheCleanup();
  window.requestAnimationFrame( drawGame );
}

function cellSort ( a, b )
{
  return a.s === b.s ? a.id - b.id : a.s - b.s;
}

function cameraUpdate ()
{
  var myCells = [];
  for ( var i = 0; i < cells.mine.length; i++ )
    if ( cells.byId.hasOwnProperty( cells.mine[ i ] ) )
      myCells.push( cells.byId[ cells.mine[ i ] ] );
  if ( myCells.length > 0 )
  {
    var x = 0,
      y = 0,
      s = 0,
      score = 0;
    for ( var i = 0, l = myCells.length; i < l; i++ )
    {
      var cell = myCells[ i ];
      score += ~~( ( cell.ns * cell.ns ) / 100 );
      x += cell.x;
      y += cell.y;
      s += cell.s;
    }
    camera.target.x = x / l;
    camera.target.y = y / l;
    camera.sizeScale = Math.pow( Math.min( 64 / s, 1 ), 0.4 );
    camera.target.scale = camera.sizeScale;
    camera.target.scale *= camera.viewportScale * camera.userZoom;
    camera.x = ( camera.target.x + camera.x ) / 2;
    camera.y = ( camera.target.y + camera.y ) / 2;
    stats.score = score;
    stats.maxScore = Math.max( stats.maxScore, score );
  } else
  {
    stats.score = NaN;
    stats.maxScore = 0;
    camera.x += ( camera.target.x - camera.x ) / 20;
    camera.y += ( camera.target.y - camera.y ) / 20;
  }
  camera.scale += ( camera.target.scale - camera.scale ) / 9;
}
function sqDist ( a, b )
{
  return ( a.x - b.x ) * ( a.x - b.x ) + ( a.y - b.y ) * ( a.y - b.y );
}
function updateQuadtree ()
{
  var w = 1920 / camera.sizeScale;
  var h = 1080 / camera.sizeScale;
  var x = camera.x - w / 2;
  var y = camera.y - h / 2;
  quadtree = new PointQuadTree( x, y, w, h, QUADTREE_MAX_POINTS );
  for ( var i = 0; i < cells.list.length; ++i )
  {
    var cell = cells.list[ i ];
    for ( var n = 0; n < cell.points.length; ++n )
    {
      quadtree.insert( cell.points[ n ] );
    }
  }
}

function Cell ( id, x, y, s, name, color, skin, flags )
{
  this.id = id;
  this.x = this.nx = this.ox = x;
  this.y = this.ny = this.oy = y;
  this.s = this.ns = this.os = s;
  this.setColor( color );
  this.setName( name );
  this.setSkin( skin );
  this.jagged = flags & 0x01 || flags & 0x10;
  this.ejected = !!( flags & 0x20 );
  this.born = syncUpdStamp;
  this.points = [];
  this.pointsVel = [];
}
Cell.prototype = {
  destroyed: false,
  id: 0,
  diedBy: 0,
  ox: 0,
  x: 0,
  nx: 0,
  oy: 0,
  y: 0,
  ny: 0,
  os: 0,
  s: 0,
  ns: 0,
  viewRange: 0,
  nameSize: 0,
  drawNameSize: 0,
  color: "#FFF",
  sColor: "#E5E5E5",
  skin: null,
  jagged: false,
  born: null,
  updated: null,
  dead: null, // timestamps
  destroy: function ( killerId )
  {
    delete cells.byId[ this.id ];
    if ( cells.mine.remove( this.id ) && cells.mine.length === 0 ) showESCOverlay();
    this.destroyed = true;
    this.dead = syncUpdStamp;
    if ( killerId && !this.diedBy )
    {
      this.diedBy = killerId;
      this.updated = syncUpdStamp;
    }
  },
  update: function ( relativeTime )
  {
    var dt = ( relativeTime - this.updated ) / settings.animationDelay;
    dt = Math.max( Math.min( dt, 1 ), 0 );
    if ( this.destroyed && Date.now() > this.dead + 200 ) cells.list.remove( this );
    else if ( this.diedBy && cells.byId.hasOwnProperty( this.diedBy ) )
    {
      this.nx = cells.byId[ this.diedBy ].x;
      this.ny = cells.byId[ this.diedBy ].y;
    }
    this.x = this.ox + ( this.nx - this.ox ) * dt;
    this.y = this.oy + ( this.ny - this.oy ) * dt;
    this.s = this.os + ( this.ns - this.os ) * dt;
    this.nameSize = ~~( ~~Math.max( ~~( 0.3 * this.ns ), 24 ) / 3 ) * 5;
    this.drawNameSize = ~~( ~~Math.max( ~~( 0.3 * this.s ), 24 ) / 3 ) * 5;
  },
  updateNumPoints: function ()
  {
    var numPoints = ( this.s * camera.scale ) | 0;
    numPoints = Math.max( numPoints, CELL_POINTS_MIN );
    numPoints = Math.min( numPoints, CELL_POINTS_MAX );
    if ( this.jagged ) numPoints = VIRUS_POINTS;
    while ( this.points.length > numPoints )
    {
      var i = ( Math.random() * this.points.length ) | 0;
      this.points.splice( i, 1 );
      this.pointsVel.splice( i, 1 );
    }
    if ( this.points.length == 0 && numPoints != 0 )
    {
      this.points.push( {
        x: this.x,
        y: this.y,
        rl: this.s,
        parent: this,
      } );
      this.pointsVel.push( Math.random() - 0.5 );
    }
    while ( this.points.length < numPoints )
    {
      var i = ( Math.random() * this.points.length ) | 0;
      var point = this.points[ i ];
      var vel = this.pointsVel[ i ];
      this.points.splice( i, 0, {
        x: point.x,
        y: point.y,
        rl: point.rl,
        parent: this,
      } );
      this.pointsVel.splice( i, 0, vel );
    }
  },
  movePoints: function ()
  {
    var pointsVel = this.pointsVel.slice();
    var len = this.points.length;
    for ( var i = 0; i < len; ++i )
    {
      var prevVel = pointsVel[ ( i - 1 + len ) % len ];
      var nextVel = pointsVel[ ( i + 1 ) % len ];
      var newVel = ( this.pointsVel[ i ] + Math.random() - 0.5 ) * 0.7;
      newVel = Math.max( Math.min( newVel, 10 ), -10 );
      this.pointsVel[ i ] = ( prevVel + nextVel + 8 * newVel ) / 10;
    }
    for ( var i = 0; i < len; ++i )
    {
      var curP = this.points[ i ];
      var curRl = curP.rl;
      var prevRl = this.points[ ( i - 1 + len ) % len ].rl;
      var nextRl = this.points[ ( i + 1 ) % len ].rl;
      var self = this;
      var affected = quadtree.some(
        {
          x: curP.x - 5,
          y: curP.y - 5,
          w: 10,
          h: 10,
        },
        function ( item )
        {
          return item.parent != self && sqDist( item, curP ) <= 25;
        }
      );
      if (
        !affected &&
        ( curP.x < border.left ||
          curP.y < border.top ||
          curP.x > border.right ||
          curP.y > border.bottom )
      )
      {
        affected = true;
      }
      if ( affected )
      {
        this.pointsVel[ i ] = Math.min( this.pointsVel[ i ], 0 );
        this.pointsVel[ i ] -= 1;
      }
      curRl += this.pointsVel[ i ];
      curRl = Math.max( curRl, 0 );
      curRl = ( 9 * curRl + this.s ) / 10;
      curP.rl = ( prevRl + nextRl + 8 * curRl ) / 10;

      var angle = ( 2 * Math.PI * i ) / len;
      var rl = curP.rl;
      if ( this.jagged && i % 2 == 0 )
      {
        rl += 5;
      }
      curP.x = this.x + Math.cos( angle ) * rl;
      curP.y = this.y + Math.sin( angle ) * rl;
    }
  },
  parseName: function ( value )
  {
    // static method
    value = value || "";
    var nameAndSkin = /^(?:\{([^}]*)\})?([^]*)/.exec( value );
    return {
      name: nameAndSkin[ 2 ].trim(),
      skin: ( nameAndSkin[ 1 ] || "" ).trim() || nameAndSkin[ 2 ],
    };
  },
  setName: function ( name )
  {
    var nameAndSkin = Cell.prototype.parseName( name );
    this.name = nameAndSkin.name;
    this.setSkin( nameAndSkin.skin );
    this.setytSkin( nameAndSkin.skin );
  },
  setSkin: function ( value )
  {
    this.skin =
      ( value && value[ 0 ] === "%" ? value.slice( 1 ) : value ) || this.skin;
    if (
      this.skin === null ||
      !knownSkins.hasOwnProperty( this.skin ) ||
      loadedSkins[ this.skin ]
    )
      return;
    loadedSkins[ this.skin ] = new Image();
    loadedSkins[ this.skin ].src = SKIN_URL + this.skin + ".png";
  },
  setytSkin: function ( value )
  {
    this.skin =
      ( value && value[ 0 ] === "%" ? value.slice( 1 ) : value ) || this.skin;
    if (
      this.skin === null ||
      !ytknownSkins.hasOwnProperty( this.skin ) ||
      loadedytSkins[ this.skin ]
    )
      return;
    loadedytSkins[ this.skin ] = new Image();
    loadedytSkins[ this.skin ].src = YTSKIN_URL + this.skin + ".png";
  },
  setColor: function ( value )
  {
    if ( !value )
    {
      log.warn( "got no color" );
      return;
    }
    this.color = value;
    this.sColor = darkenColor( value );
  },
  draw: function ( ctx, biggestMineCellId )
  {
    ctx.save();
    this.drawShape( ctx );
    this.drawText( ctx, biggestMineCellId );
    ctx.restore();
  },
  drawShape: function ( ctx )
  {
    ctx.fillStyle = settings.showColor ? this.color : Cell.prototype.color;
    ctx.strokeStyle = settings.showColor ? this.sColor : Cell.prototype.sColor;
    ctx.lineWidth = Math.max( ~~( this.s / 0 ), 0 );
    if ( this.s > 20 ) this.s -= ctx.lineWidth / 2;

    let biggestPointValue = 0;

    ctx.beginPath();
    if ( this.jagged ) ctx.lineJoin = "miter";
    if ( settings.jellyPhysics && this.points.length )
    {
      var point = this.points[ 0 ];
      ctx.moveTo( point.x, point.y );
      for ( var i = 0; i < this.points.length; ++i )
      {
        var point = this.points[ i ];
        ctx.lineTo( point.x, point.y );
        if ( this.points[ i ].rl > biggestPointValue )
          biggestPointValue = this.points[ i ].rl;
      }
    } else if ( this.jagged )
    {
      var pointCount = 120;
      var incremental = PI_2 / pointCount;
      ctx.moveTo( this.x, this.y + this.s + 3 );
      for ( var i = 1; i < pointCount; i++ )
      {
        var angle = i * incremental;
        var dist = this.s - 3 + ( i % 2 === 0 ) * 6;
        ctx.lineTo(
          this.x + dist * Math.sin( angle ),
          this.y + dist * Math.cos( angle )
        );
      }
      ctx.lineTo( this.x, this.y + this.s + 3 );
    } else ctx.arc( this.x, this.y, this.s, 0, PI_2, false );
    ctx.closePath();

    if ( this.destroyed )
      ctx.globalAlpha = Math.max( 120 - Date.now() + this.dead, 0 ) / 120;
    else ctx.globalAlpha = Math.min( Date.now() - this.born, 120 ) / 120;

    if ( settings.fillSkin ) ctx.fill();
    if ( settings.showSkins && this.skin )
    {
      var skin = loadedSkins[ this.skin ] || loadedytSkins[ this.skin ];
      if ( skin && skin.complete && skin.width && skin.height )
      {
        ctx.save();
        ctx.clip();
        scaleBack( ctx );
        var sScaled =
          ( settings.jellyPhysics ? biggestPointValue : this.s ) * camera.scale;
        ctx.drawImage(
          skin,
          this.x * camera.scale - sScaled,
          this.y * camera.scale - sScaled,
          ( sScaled *= 2 ),
          sScaled
        );
        scaleForth( ctx );
        ctx.restore();
      }
    } else if ( !settings.fillSkin ) ctx.fill();
    if ( this.s > 20 )
    {
      ctx.stroke();
      this.s += ctx.lineWidth / 2;
    }
  },
  drawText: function ( ctx )
  {
    if ( this.s < 20 || this.jagged ) return;
    var y = this.y;
    let range = settings.drawNamesDistance//document.getElementById( 'drawNamesDistance' ).value || 1; // how far to zoom out from the cell before hiding names and mass
    if ( this.name && settings.showNames && this.viewRange < range )
    {
      drawText(
        ctx,
        false,
        this.x,
        this.y,
        this.nameSize,
        this.drawNameSize,
        this.name
      );
      y += Math.max( this.s / 4.5, this.nameSize / 1.5 );
    }
    if (
      settings.showMass &&
      ( cells.mine.indexOf( this.id ) !== -1 || cells.mine.length === 0 ) &&
      this.viewRange < range
    )
    {
      var mass = ( ~~( ( this.s * this.s ) / 100 ) ).toString();
      drawText(
        ctx,
        true,
        this.x,
        y,
        this.nameSize / 2,
        this.drawNameSize / 2,
        mass
      );
    }
  },
};

function cacheCleanup ()
{
  for ( var i in cachedNames )
  {
    for ( var j in cachedNames[ i ] )
      if ( syncAppStamp - cachedNames[ i ][ j ].accessTime >= 5000 )
        delete cachedNames[ i ][ j ];
    if ( cachedNames[ i ] == {} ) delete cachedNames[ i ];
  }
  for ( var i in cachedMass )
    if ( syncAppStamp - cachedMass[ i ].accessTime >= 5000 ) delete cachedMass[ i ];
}

// 2-var draw-stay cache
var cachedNames = {};
var cachedMass = {};

function drawTextOnto ( canvas, ctx, text, size )
{
  ctx.font = size + "px Ubuntu";
  ctx.lineWidth = Math.max( ~~( size / 10 ), 2 );
  canvas.width = ctx.measureText( text ).width + 2 * ctx.lineWidth;
  canvas.height = 4 * size;
  ctx.font = size + "px Ubuntu";
  ctx.lineWidth = Math.max( ~~( size / 10 ), 2 );
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFF";
  ctx.strokeStyle = "#000";
  ctx.translate( canvas.width / 2, 2 * size );
  ctx.lineWidth !== 1 && ctx.strokeText( text, 0, 0 );
  ctx.fillText( text, 0, 0 );
}
function drawRaw ( ctx, x, y, text, size )
{
  ctx.font = size + "px Ubuntu";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.lineWidth = Math.max( ~~( size / 10 ), 2 );
  ctx.fillStyle = "#FFF";
  ctx.strokeStyle = "#000";
  ctx.lineWidth !== 1 && ctx.strokeText( text, x, y );
  ctx.fillText( text, x, y );
  ctx.restore();
}
function newNameCache ( value, size )
{
  var canvas = document.createElement( "canvas" );
  var ctx = canvas.getContext( "2d" );
  drawTextOnto( canvas, ctx, value, size );

  cachedNames[ value ] = cachedNames[ value ] || {};
  cachedNames[ value ][ size ] = {
    width: canvas.width,
    height: canvas.height,
    canvas: canvas,
    value: value,
    size: size,
    accessTime: syncAppStamp,
  };
  return cachedNames[ value ][ size ];
}
function newMassCache ( size )
{
  var canvases = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
  };
  for ( var value in canvases )
  {
    var canvas = ( canvases[ value ].canvas = document.createElement( "canvas" ) );
    var ctx = canvas.getContext( "2d" );
    drawTextOnto( canvas, ctx, value, size );
    canvases[ value ].canvas = canvas;
    canvases[ value ].width = canvas.width;
    canvases[ value ].height = canvas.height;
  }
  cachedMass[ size ] = {
    canvases: canvases,
    size: size,
    lineWidth: Math.max( ~~( size / 10 ), 2 ),
    accessTime: syncAppStamp,
  };
  return cachedMass[ size ];
}
function toleranceTest ( a, b, tolerance )
{
  return a - tolerance <= b && b <= a + tolerance;
}
function getNameCache ( value, size )
{
  if ( !cachedNames[ value ] ) return newNameCache( value, size );
  var sizes = Object.keys( cachedNames[ value ] );
  for ( var i = 0, l = sizes.length; i < l; i++ )
    if ( toleranceTest( size, sizes[ i ], size / 4 ) )
      return cachedNames[ value ][ sizes[ i ] ];
  return newNameCache( value, size );
}
function getMassCache ( size )
{
  var sizes = Object.keys( cachedMass );
  for ( var i = 0, l = sizes.length; i < l; i++ )
    if ( toleranceTest( size, sizes[ i ], size / 4 ) ) return cachedMass[ sizes[ i ] ];
  return newMassCache( size );
}

function drawText ( ctx, isMass, x, y, size, drawSize, value )
{
  ctx.save();
  if ( size > 500 ) return drawRaw( ctx, x, y, value, drawSize );
  ctx.imageSmoothingQuality = "high";
  if ( isMass )
  {
    var cache = getMassCache( size );
    cache.accessTime = syncAppStamp;
    var canvases = cache.canvases;
    var correctionScale = drawSize / cache.size;

    // calculate width
    var width = 0;
    for ( var i = 0; i < value.length; i++ )
      width += canvases[ value[ i ] ].width - 2 * cache.lineWidth;

    ctx.scale( correctionScale, correctionScale );
    x /= correctionScale;
    y /= correctionScale;
    x -= width / 2;
    for ( var i = 0; i < value.length; i++ )
    {
      var item = canvases[ value[ i ] ];
      ctx.drawImage( item.canvas, x, y - item.height / 2 );
      x += item.width - 2 * cache.lineWidth;
    }
  } else
  {
    var cache = getNameCache( value, size );
    cache.accessTime = syncAppStamp;
    var canvas = cache.canvas;
    var correctionScale = drawSize / cache.size;
    ctx.scale( correctionScale, correctionScale );
    x /= correctionScale;
    y /= correctionScale;
    ctx.drawImage( canvas, x - canvas.width / 2, y - canvas.height / 2 );
  }
  ctx.restore();
}
function handleScroll ( event )
{
  if ( event.target !== mainCanvas ) return;
  camera.userZoom *= event.deltaY > 0 ? 0.8 : 1.2;
  if ( settings.moreZoom )
  { camera.userZoom = Math.max( camera.userZoom, 0.1 ) }
  else
  {
    camera.userZoom = Math.max( camera.userZoom, 0.8 )
  }
  camera.userZoom = Math.min( camera.userZoom, 5 );
}

function init ()
{
  // Función para guardar controles de forma segura
  function saveControls ()
  {
    try
    {
      const controlIds = [
        "feed", "doublesplit", "freeze", "triplesplit", "16split",
        "botFeed", "botSplit", "botFreeze", "botDoubleSplit",
        "botTripleSplit", "bot16x"
      ];

      controlIds.forEach( id =>
      {
        const element = document.getElementById( id );
        if ( element && element.value !== undefined )
        {
          localStorage.setItem( id, element.value );
        }
      } );
    } catch ( e )
    {
      console.warn( "Error saving controls:", e );
    }
  }

  // Configurar intervalo para guardar controles
  let saveInterval;
  function setupSaveInterval ()
  {
    if ( document.readyState === 'complete' )
    {
      saveInterval = setInterval( saveControls, 1000 );
    } else
    {
      requestAnimationFrame( setupSaveInterval );
    }
  }
  setupSaveInterval();
  // Función para cargar controles de forma segura
  function loadControls ()
  {
    try
    {
      const controlMap = {
        'feed': 'feed',
        'doublesplit': 'dS',
        'freeze': 'Fz',
        'triplesplit': 'tS',
        '16split': 'split16',
        'botFeed': 'bF',
        'botFreeze': 'bFz',
        'botSplit': 'bS',
        'botDoubleSplit': 'bD',
        'botTripleSplit': 'bT',
        'bot16x': 'b16'
      };

      Object.keys( controlMap ).forEach( elementId =>
      {
        const element = document.getElementById( elementId );
        if ( element )
        {
          const savedValue = localStorage.getItem( elementId );
          if ( savedValue !== null )
          {
            element.value = savedValue;
          }
        }
      } );
    } catch ( e )
    {
      console.warn( "Error loading controls:", e );
    }
  }

  // Cargar los controles cuando el DOM esté listo
  if ( document.readyState === 'complete' )
  {
    loadControls();
  } else
  {
    document.addEventListener( 'DOMContentLoaded', loadControls );
  };
  let feed = document.getElementById( "feed" ),
    freeze = document.getElementById( "freeze" ),
    double = document.getElementById( "doublesplit" ),
    triple = document.getElementById( "triplesplit" ),
    split16 = document.getElementById( "16split" ),
    botFeed = document.getElementById( "botFeed" ),
    botFreeze = document.getElementById( "botFreeze" ),
    botSplit = document.getElementById( "botSplit" ),
    botDouble = document.getElementById( "botDoubleSplit" ),
    botTriple = document.getElementById( "botTripleSplit" ),
    bot16x = document.getElementById( "bot16x" ),
    keys = [
      feed,
      freeze,
      double,
      triple,
      split16,
      botFeed,
      botSplit,
      botFreeze,
      botDouble,
      botTriple,
      bot16x,
    ],
    keyInput = document.getElementsByClassName( "key" );
  /*const handleMouseInput = ( () =>
  {
    for ( i = 0; i < keys.length; i++ )
    {
      [ ...document.querySelectorAll( ".key" ) ].forEach( ( el ) =>
        el.addEventListener( "contextmenu", ( e ) => e.preventDefault() )
      );
      keys[ i ].addEventListener( "mousedown", ( e ) =>
      {
        e.target.value = "MOUSE" + e.which;
      } );
      keys[ i ].addEventListener( "keydown", ( e ) =>
      {
        e.target.value = String.fromCharCode( e.keyCode );
      } );
    }
  } )();*/
  window.isSpectating = false;
  let EjectDown = false,
    speed = 110,
    botEjectDown = false,
    botFeedSpeed = 85,
    menu = document.getElementById( "overlays" ),
    inMenu = true;
  // Mapeo de acciones a ids de keybinds y valores por defecto
  const keybinds = {
    feed: { key: 'w', label: 'macroFeed-key', button: 'macroFeed-button' },
    doublesplit: { key: 'd', label: 'doubleSplit-key', button: 'doubleSplit-button' },
    triplesplit: { key: 't', label: 'tripleSplit-key', button: 'tripleSplit-button' },
    freeze: { key: 's', label: 'quadSplit-key', button: 'quadSplit-button' },
    '16split': { key: 'm', label: 'maxSplit-key', button: 'maxSplit-button' },
    botFeed: { key: 'e', label: 'minionSplit-key', button: 'minionSplit-button' },
    botSplit: { key: 'r', label: 'minionFeed-key', button: 'minionFeed-button' },
    botFreeze: { key: 't', label: 'minionStop-key', button: 'minionStop-button' },
    botDoubleSplit: { key: 'c', label: 'minionDouble-key', button: 'minionDouble-button' },
    botTripleSplit: { key: 'v', label: 'minionTriple-key', button: 'minionTriple-button' },
    bot16x: { key: 'x', label: 'minionQuad-key', button: 'minionQuad-button' },
    split: { key: ' ', label: 'split-key', button: 'split-button' },
  };

  // Cargar keybinds desde localStorage o usar por defecto
  function loadKeybinds ()
  {
    Object.keys( keybinds ).forEach( action =>
    {
      const saved = localStorage.getItem( 'keybind_' + action );
      if ( saved ) keybinds[ action ].key = saved;
      // Actualizar visual
      const label = document.getElementById( keybinds[ action ].label );
      if ( label ) label.textContent = keybinds[ action ].key === ' ' ? 'Space' : keybinds[ action ].key;
    } );
  }
  // Guardar keybind
  function saveKeybind ( action, key )
  {
    keybinds[ action ].key = key;
    localStorage.setItem( 'keybind_' + action, key );
    const label = document.getElementById( keybinds[ action ].label );
    if ( label ) label.textContent = key === ' ' ? 'Space' : key;
  }
  // Esperar nueva tecla
  function setupKeybindButtons ()
  {
    Object.keys( keybinds ).forEach( action =>
    {
      const btn = document.getElementById( keybinds[ action ].button );
      if ( !btn ) return;
      btn.onclick = function ()
      {
        btn.textContent = 'Press key...';
        function onKey ( e )
        {
          e.preventDefault();
          let key = e.key.length === 1 ? e.key : ( e.key === ' ' ? ' ' : e.key );
          saveKeybind( action, key );
          btn.textContent = 'change';
          window.removeEventListener( 'keydown', onKey, true );
        }
        window.addEventListener( 'keydown', onKey, true );
      };
    } );
  }
  // Obtener el código de tecla para una acción
  function getKeyCode ( action )
  {
    return keybinds[ action ].key.length === 1 ? keybinds[ action ].key.toUpperCase().charCodeAt( 0 ) : 0;
  }
  // Inicializar keybinds
  loadKeybinds();
  setupKeybindButtons();
  const keydown = ( event ) =>
  {
    if ( document.getElementById( "overlays" ) && document.getElementById( "overlays" ).style.display == "none" )
      inMenu = false;
    if ( !isTyping && inMenu == false )
    {
      switch ( event.keyCode )
      {
        case getKeyCode( 'feed' ):
          if ( !EjectDown )
          {
            wsSend( UINT8_CACHE[ 21 ] );
            EjectDown = true;
            setTimeout( eject, speed );
            setTimeout( () => { speed = 10; }, 450 );
          }
          break;
        case getKeyCode( 'split' ):
          if ( event.repeat ) return;
          setTimeout( function () { wsSend( UINT8_CACHE[ 17 ] ); }, macroCooldown2 );
          break;
        case getKeyCode( 'doublesplit' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 17 ] );
            setTimeout( function () { wsSend( UINT8_CACHE[ 17 ] ); }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case getKeyCode( 'freeze' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            X = window.innerWidth / 2;
            Y = window.innerHeight / 2;
            $( "canvas" ).trigger(
              $.Event( "mousemove", { clientX: X, clientY: Y } )
            );
          }, macroCooldown2 );
          break;
        case getKeyCode( 'triplesplit' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 17 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 17 ] );
              setTimeout( function () 
              {
                wsSend( UINT8_CACHE[ 17 ] );

              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case getKeyCode( '16split' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 17 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 17 ] );
              setTimeout( function ()
              {
                wsSend( UINT8_CACHE[ 17 ] );
                setTimeout( function ()
                {
                  wsSend( UINT8_CACHE[ 17 ] );
                  setTimeout( function ()
                  {
                    wsSend( UINT8_CACHE[ 17 ] );
                    setTimeout( function ()
                    {
                      wsSend( UINT8_CACHE[ 17 ] );
                      setTimeout( function ()
                      {
                        wsSend( UINT8_CACHE[ 17 ] );
                        setTimeout( function () 
                        {
                          wsSend( UINT8_CACHE[ 17 ] );

                        }, macroCooldown2 );
                      }, macroCooldown2 );
                    }, macroCooldown2 );
                  }, macroCooldown2 );
                }, macroCooldown2 );
              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case getKeyCode( 'botFeed' ):
          if ( !botEjectDown )
          {
            wsSend( UINT8_CACHE[ 23 ] );
            botEjectDown = true;
            setTimeout( botEject, botFeedSpeed );
            setTimeout( () => { botFeedSpeed = 60; }, 450 );
          }
          break;
        case getKeyCode( 'botSplit' ):
          if ( event.repeat ) return;
          setTimeout( function () { wsSend( UINT8_CACHE[ 22 ] ); }, macroCooldown2 );
          break;
        case getKeyCode( 'botFreeze' ):
          if ( event.repeat ) return;
          setTimeout( function () { wsSend( UINT8_CACHE[ 24 ] ); }, macroCooldown2 );
          break;
        case getKeyCode( 'botDoubleSplit' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
            setTimeout( function () { wsSend( UINT8_CACHE[ 22 ] ); }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case getKeyCode( 'botTripleSplit' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 22 ] );
              setTimeout( function () { wsSend( UINT8_CACHE[ 22 ] ); }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case getKeyCode( 'bot16x' ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 22 ] );
              setTimeout( function ()
              {
                wsSend( UINT8_CACHE[ 22 ] );
                setTimeout( function () { wsSend( UINT8_CACHE[ 22 ] ); }, macroCooldown2 );
              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case 27:
          inMenu = true;
          showESCOverlay();
          window.isSpectating = false;
          break;
        default:
          break;
      }
    }
    if ( event.keyCode == 13 )
    {
      if ( escOverlayShown || !settings.showChat ) return;
      var chatBox = document.getElementById( 'chat_textbox' );
      if ( !chatBox ) return;
      if ( isTyping )
      {
        chatBox.blur();
        var text = chatBox.value;
        if ( text.length > 0 ) sendChat( text );
        chatBox.value = "";
      } else chatBox.focus();
    }
  };
  const keyup = ( event ) =>
  {
    switch ( event.keyCode )
    {
      case getKeyCode( 'feed' ):
        EjectDown = false;
        speed = 100;
        break;
      case getKeyCode( 'botFeed' ):
        botEjectDown = false;
        botFeedSpeed = 85;
        break;
      default:
        break;
    }
  };
  const mousedown = ( event ) =>
  {
    if ( document.getElementById( "overlays" ).style.display == "none" )
      inMenu = false;
    if ( !isTyping && inMenu == false )
    {
      // Calcular los keycodes dinámicamente solo si los elementos existen
      var feedElem = document.getElementById( "feed" );
      var feedChar = ( feedElem && feedElem.value && feedElem.value.length >= 6 ) ? feedElem.value.charCodeAt( 5 ) - 48 : null;
      var doublesplitElem = document.getElementById( "doublesplit" );
      var doublesplitChar = ( doublesplitElem && doublesplitElem.value && doublesplitElem.value.length >= 6 ) ? doublesplitElem.value.charCodeAt( 5 ) - 48 : null;
      var triplesplitElem = document.getElementById( "triplesplit" );
      var triplesplitChar = ( triplesplitElem && triplesplitElem.value && triplesplitElem.value.length >= 6 ) ? triplesplitElem.value.charCodeAt( 5 ) - 48 : null;
      var split16Elem = document.getElementById( "16split" );
      var split16Char = ( split16Elem && split16Elem.value && split16Elem.value.length >= 6 ) ? split16Elem.value.charCodeAt( 5 ) - 48 : null;
      var botFeedElem = document.getElementById( "botFeed" );
      var botFeedChar = ( botFeedElem && botFeedElem.value && botFeedElem.value.length >= 6 ) ? botFeedElem.value.charCodeAt( 5 ) - 48 : null;
      var botSplitElem = document.getElementById( "botSplit" );
      var botSplitChar = ( botSplitElem && botSplitElem.value && botSplitElem.value.length >= 6 ) ? botSplitElem.value.charCodeAt( 5 ) - 48 : null;
      var botDoubleSplitElem = document.getElementById( "botDoubleSplit" );
      var botDoubleSplitChar = ( botDoubleSplitElem && botDoubleSplitElem.value && botDoubleSplitElem.value.length >= 6 ) ? botDoubleSplitElem.value.charCodeAt( 5 ) - 48 : null;
      var botTripleSplitElem = document.getElementById( "botTripleSplit" );
      var botTripleSplitChar = ( botTripleSplitElem && botTripleSplitElem.value && botTripleSplitElem.value.length >= 6 ) ? botTripleSplitElem.value.charCodeAt( 5 ) - 48 : null;
      var bot16xElem = document.getElementById( "bot16x" );
      var bot16xChar = ( bot16xElem && bot16xElem.value && bot16xElem.value.length >= 6 ) ? bot16xElem.value.charCodeAt( 5 ) - 48 : null;

      switch ( event.which )
      {
        case ( feedChar !== null ? feedChar : -1 ):
          if ( !EjectDown )
          {
            wsSend( UINT8_CACHE[ 21 ] );
            EjectDown = true;
            setTimeout( eject, speed );
            setTimeout( () => { EjectDown = false; }, 100 );
          }
          break;
        case ( doublesplitChar !== null ? doublesplitChar : -2 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 17 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 17 ] );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case ( triplesplitChar !== null ? triplesplitChar : -3 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 17 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 17 ] );
              setTimeout( function ()
              {
                wsSend( UINT8_CACHE[ 17 ] );
              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case ( split16Char !== null ? split16Char : -4 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 17 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 17 ] );
              setTimeout( function ()
              {
                wsSend( UINT8_CACHE[ 17 ] );
                setTimeout( function ()
                {
                  wsSend( UINT8_CACHE[ 17 ] );
                }, macroCooldown2 );
              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case ( botFeedChar !== null ? botFeedChar : -5 ):
          if ( !botEjectDown )
          {
            wsSend( UINT8_CACHE[ 23 ] );
            botEjectDown = true;
            setTimeout( botEject, botFeedSpeed );
            setTimeout( () =>
            {
              botFeedSpeed = 60;
            }, 450 );
          }
          break;
        case ( botSplitChar !== null ? botSplitChar : -6 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
          }, macroCooldown2 );
          break;
        case ( botDoubleSplitChar !== null ? botDoubleSplitChar : -7 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 22 ] );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case ( botTripleSplitChar !== null ? botTripleSplitChar : -8 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 22 ] );
              setTimeout( function ()
              {
                wsSend( UINT8_CACHE[ 22 ] );
              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        case ( bot16xChar !== null ? bot16xChar : -9 ):
          if ( event.repeat ) return;
          setTimeout( function ()
          {
            wsSend( UINT8_CACHE[ 22 ] );
            setTimeout( function ()
            {
              wsSend( UINT8_CACHE[ 22 ] );
              setTimeout( function ()
              {
                wsSend( UINT8_CACHE[ 22 ] );
                setTimeout( function ()
                {
                  wsSend( UINT8_CACHE[ 22 ] );
                }, macroCooldown2 );
              }, macroCooldown2 );
            }, macroCooldown2 );
          }, macroCooldown2 );
          break;
        default:
          break;
      }
    }
  };
  const mouseup = ( event ) =>
  {
    var minionFeedElem = document.getElementById( "minionFeed" );
    var minionFeedChar = ( minionFeedElem && minionFeedElem.value && minionFeedElem.value.length >= 6 ) ? minionFeedElem.value.charCodeAt( 5 ) - 48 : null;
    var botFeedElem = document.getElementById( "botFeed" );
    var botFeedChar = ( botFeedElem && botFeedElem.value && botFeedElem.value.length >= 6 ) ? botFeedElem.value.charCodeAt( 5 ) - 48 : null;
    switch ( event.which )
    {
      case ( minionFeedChar !== null ? minionFeedChar : -1 ):
        EjectDown = false;
        speed = 100;
        break;
      case ( botFeedChar !== null ? botFeedChar : -2 ):
        botEject = false;
        botFeedSpeed = 85;
        break;
      default:
        break;
    }
  };
  const eject = () =>
  {
    if ( EjectDown )
    {
      wsSend( UINT8_CACHE[ 21 ] );
      setTimeout( eject, speed );
    }
  };
  const botEject = () =>
  {
    if ( botEjectDown )
    {
      wsSend( UINT8_CACHE[ 23 ] );
      setTimeout( botEject, botFeedSpeed );
    }
  };
  mainCanvas = document.getElementById( "canvas" );
  if ( !mainCanvas )
  {
    console.error( 'No se pudo encontrar el elemento canvas' );
    return;
  }

  mainCtx = mainCanvas.getContext( "2d" );
  if ( !mainCtx )
  {
    console.error( 'No se pudo obtener el contexto 2D del canvas' );
    return;
  }

  // Configurar el tamaño del canvas
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;

  chatBox = byId( "chat_textbox" );
  soundsVolume = byId( "soundsVolume" );
  mainCanvas.focus();

  loadSettings();
  window.addEventListener( "beforeunload", storeSettings );
  window.addEventListener( "beforeunload", askleavi );
  document.addEventListener( "wheel", handleScroll, { passive: true } );
  byId( "playButto" ).addEventListener( "click", function ()
  {
    if ( settings.skin )
    {
      sendPlay( "{" + settings.skin + "}" + settings.nick );
    } else
    {
      sendPlay( settings.nick );
    }
    hideESCOverlay();
  } );

  // --- Botones personalizados ---
  // --- Lógica real simulada/localStorage ---
  // --- Integración con Firebase Auth y Database ---
  let firebaseUser = null;
  let firebaseDb = null;
  let userStats = { coins: 0, xp: 0, level: 1 };
  let statsLoaded = false;

  function updateXPBar ( xp, maxXP, level )
  {
    // Actualizar todos los elementos que puedan compartir estos IDs (por si hay duplicados en el HTML)
    const xpBars = document.querySelectorAll( '#xpProgressBar' );
    const levelSpans = document.querySelectorAll( '#level' );
    const displayLevels = document.querySelectorAll( '#displayLevel' );
    const percent = Math.floor( ( xp / maxXP ) * 100 );
    console.debug( 'main_out.js: updateXPBar called', { xp, maxXP, level, percent, xpBars: xpBars.length, levelSpans: levelSpans.length, displayLevels: displayLevels.length } );
    xpBars.forEach( function ( el ) { try { el.style.width = percent + '%'; } catch ( e ) { } } );
    levelSpans.forEach( function ( el ) { try { el.textContent = level; } catch ( e ) { } } );
    displayLevels.forEach( function ( el ) { try { el.innerHTML = `<b>${ xp } / ${ maxXP }</b> XP&nbsp;(<b>${ percent }</b>%)`; } catch ( e ) { } } );
  }

  function updateUserUI ( user )
  {
    const nameElem = byId( 'gloobixAccountUsername' );
    const avatarElem = byId( 'userAvatar' );
    if ( user && nameElem && avatarElem && user.photoURL )
    {
      nameElem.textContent = user.displayName || user.email || 'Usuario';
      const imavatar = '';
      if ( user.photoURL ) { imavatar = user.photoURL }
      else { './assets/img/favicon.ico' }
      avatarElem.src = imavatar;
      avatarElem.style.display = 'inline';
    } else if ( nameElem && avatarElem )
    {
      nameElem.textContent = '';
      avatarElem.src = './assets/img/favicon.ico';
      avatarElem.style.display = 'none';
    }
  }

  function getCoins ()
  {
    if ( firebaseUser && statsLoaded ) return userStats.coins || 0;
    return parseInt( localStorage.getItem( 'gloobix_coins' ) || '0', 10 );
  }
  function setCoins ( val )
  {
    if ( firebaseUser && firebaseDb )
    {
      firebaseDb.ref( 'players/' + firebaseUser.uid + '/stats/coins' ).set( val );
      userStats.coins = val;
    } else
    {
      localStorage.setItem( 'gloobix_coins', val );
    }
  }
  function addCoins ( val )
  {
    setCoins( getCoins() + val );
  }
  function getXP ()
  {
    if ( firebaseUser && statsLoaded ) return userStats.xp || 0;
    return parseInt( localStorage.getItem( 'gloobix_xp' ) || '0', 10 );
  }
  function setXP ( val )
  {
    if ( firebaseUser && firebaseDb )
    {
      firebaseDb.ref( 'players/' + firebaseUser.uid + '/stats/xp' ).set( val );
      userStats.xp = val;
    } else
    {
      localStorage.setItem( 'gloobix_xp', val );
    }
  }
  function getLevel ()
  {
    if ( firebaseUser && statsLoaded ) return userStats.level || 1;
    return parseInt( localStorage.getItem( 'gloobix_level' ) || '1', 10 );
  }
  function setLevel ( val )
  {
    if ( firebaseUser && firebaseDb )
    {
      firebaseDb.ref( 'players/' + firebaseUser.uid + '/stats/level' ).set( val );
      userStats.level = val;
    } else
    {
      localStorage.setItem( 'gloobix_level', val );
    }
  }

  // Esperar a que Firebase esté listo y que exista una app inicializada
  function waitForFirebaseAuth ( cb )
  {
    try
    {
      if (
        window.firebase &&
        firebase.auth &&
        firebase.database &&
        ( firebase.apps && firebase.apps.length > 0 )
      )
      {
        cb();
        return;
      }
    } catch ( e )
    {
      // fallthrough to retry
    }
    setTimeout( () => waitForFirebaseAuth( cb ), 100 );
  }

  waitForFirebaseAuth( function ()
  {
    firebaseDb = firebase.database();
    firebase.auth().onAuthStateChanged( function ( user )
    {
      firebaseUser = user;
      statsLoaded = false;
      if ( user )
      {
        // No cambiar la visibilidad de botones aquí: auth.js se encarga del UI de sesión.
        // Actualizar información de usuario y cargar estadísticas desde la BD.
        updateUserUI( user );
        firebaseDb.ref( 'players/' + user.uid + '/stats' ).on( 'value', function ( snapshot )
        {
          const stats = snapshot.val() || {};
          console.debug( 'main_out.js: stats snapshot', { snapshot: stats } );
          userStats = {
            coins: stats.coins || 0,
            xp: stats.xp || 0,
            level: stats.level || 1
          };
          statsLoaded = true;
          let xp = userStats.xp;
          let level = userStats.level;
          let maxXP = 1000 * level;
          console.debug( 'main_out.js: computed xp values', { xp, level, maxXP } );
          updateXPBar( xp, maxXP, level );
        } );
      } else
      {
        // Usuario no autenticado: actualizar UI y usar fallback localStorage
        updateUserUI( null );
        let xp = getXP();
        let level = getLevel();
        let maxXP = 1000 * level;
        updateXPBar( xp, maxXP, level );
      }
    } );
  } );

  // Create Party
  const createPartyBtn = byId( "createParty" );
  if ( createPartyBtn )
  {
    createPartyBtn.addEventListener( "click", function ()
    {
      // Generar código de party y mostrarlo
      const code = Math.random().toString( 36 ).substr( 2, 6 ).toUpperCase();
      localStorage.setItem( 'gloobix_party_code', code );
      prompt( "Comparte este código de party:", code );
    } );
  }

  // Join Party
  const joinPartyBtn = byId( "JoinParty" );
  if ( joinPartyBtn )
  {
    joinPartyBtn.addEventListener( "click", function ()
    {
      const code = prompt( "Introduce el código de party:" );
      if ( code )
      {
        localStorage.setItem( 'gloobix_party_joined', code.toUpperCase() );
        alert( "Te has unido a la party " + code.toUpperCase() );
      }
    } );
  }

  // Free Coins
  const freeCoinsBtn = byId( "freeCoinsButton" );
  if ( freeCoinsBtn )
  {
    freeCoinsBtn.addEventListener( "click", function ()
    {
      addCoins( 100 );
      alert( "¡Has reclamado 100 monedas gratis! Total: " + getCoins() );
    } );
  }

  // Game Shop
  const gameShopBtn = byId( "gameshopMenuButton" );
  if ( gameShopBtn )
  {
    gameShopBtn.addEventListener( "click", function ()
    {
      const coins = getCoins();
      alert( "Tienda de juego. Tienes " + coins + " monedas. (Simulación)" );
    } );
  }

  // Skin Shop
  const skinShopBtn = byId( "skinShopButton" );
  if ( skinShopBtn )
  {
    skinShopBtn.addEventListener( "click", function ()
    {
      const coins = getCoins();
      if ( coins >= 50 )
      {
        addCoins( -50 );
        alert( "¡Has comprado una skin por 50 monedas! (Simulación)" );
      } else
      {
        alert( "No tienes suficientes monedas para comprar una skin." );
      }
    } );
  }

  // Pociones
  [ "potion_holder_1", "potion_holder_2", "potion_holder_3" ].forEach( function ( id, idx )
  {
    const btn = byId( id );
    if ( btn )
    {
      btn.addEventListener( "click", function ()
      {
        // Simular efecto de poción: sumar XP
        const xpGained = 200 * ( idx + 1 );
        let xp = getXP() + xpGained;
        let level = getLevel();
        let maxXP = 1000 * level;
        setXP( xp );
        if ( xp >= maxXP )
        {
          level = level + 1;
          setLevel( level );
          xp = xp - maxXP;
          setXP( xp );
          maxXP = 1000 * level;
          alert( `¡Subiste a nivel ${ level }!` );
        } else
        {
          alert( `Poción ${ idx + 1 } usada. Ganaste ${ xpGained } XP.` );
        }
        updateXPBar( xp, maxXP, level );
      } );
    }
  } );

  // Login Google real
  const loginGoogleBtn = byId( "gloobix_account_login_button_google" );
  if ( loginGoogleBtn )
  {
    loginGoogleBtn.addEventListener( "click", function ()
    {
      if ( window.firebase && firebase.auth )
      {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup( provider ).catch( function ( error )
        {
          alert( "Error al iniciar sesión con Google: " + error.message );
        } );
      } else
      {
        alert( "Firebase no está cargado" );
      }
    } );
  }
  // Logout
  const logoutBtn = byId( "gloobixUserLogout" );
  if ( logoutBtn )
  {
    logoutBtn.addEventListener( "click", function ()
    {
      if ( window.firebase && firebase.auth )
      {
        firebase.auth().signOut();
      }
    } );
  }
  window.onkeydown = keydown;
  window.onkeyup = keyup;
  window.onmousedown = mousedown;
  window.onmouseup = mouseup;
  chatBox.onblur = function ()
  {
    isTyping = false;
    drawChat();
  };
  chatBox.onfocus = function ()
  {
    isTyping = true;
    drawChat();
  };
  mainCanvas.onmousemove = function ( event )
  {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };
  setInterval( function ()
  {
    sendMouseMove(
      ( mouseX - mainCanvas.width / 2 ) / camera.scale + camera.x,
      ( mouseY - mainCanvas.height / 2 ) / camera.scale + camera.y
    );
  }, 40 );
  window.onresize = function ()
  {
    var width = ( mainCanvas.width = window.innerWidth );
    var height = ( mainCanvas.height = window.innerHeight );
    camera.viewportScale = Math.max( width / 1920, height / 1080 );
  };
  window.onresize();
  const mobileStuff = byId( 'mobileStuff' );
  const joystick = byId( 'joystick' );
  const joystickHandle = byId( 'joystick-handle' );
  const touchCircle = byId( 'touchCircle' );
  let joystickActive = false;
  let joystickStartX = 0;
  let joystickStartY = 0;
  let handleStartX = 0;
  let handleStartY = 0;

  byId( 'touchpad' ).hide(); // Ocultar el touchpad original

  const touchmove = ( event ) =>
  {
    const touch = event.touches[ 0 ];
    if ( joystickActive )
    {
      const dx = touch.clientX - joystickStartX;
      const dy = touch.clientY - joystickStartY;
      const distance = Math.sqrt( dx * dx + dy * dy );
      const maxDistance = joystick.offsetWidth / 2;

      let newX = handleStartX + dx;
      let newY = handleStartY + dy;

      if ( distance > maxDistance )
      {
        newX = handleStartX + ( dx / distance ) * maxDistance;
        newY = handleStartY + ( dy / distance ) * maxDistance;
      }

      joystickHandle.style.left = `${ newX }px`;
      joystickHandle.style.top = `${ newY }px`;

      const moveX = ( newX - handleStartX ) / maxDistance;
      const moveY = ( newY - handleStartY ) / maxDistance;

      mouseX = innerWidth / 2 + moveX * ( innerWidth / 2 );
      mouseY = innerHeight / 2 + moveY * ( innerHeight / 2 );
    } else
    {
      mouseX = touch.pageX;
      mouseY = touch.pageY;
    }
    const r = innerWidth * .02;
    touchCircle.style.left = mouseX - r + 'px';
    touchCircle.style.top = mouseY - r + 'px';
  };

  joystick.addEventListener( 'touchstart', ( event ) =>
  {
    event.preventDefault();
    joystickActive = true;
    mobileStuff.show();
    const rect = joystick.getBoundingClientRect();
    joystickStartX = rect.left + rect.width / 2;
    joystickStartY = rect.top + rect.height / 2;
    handleStartX = joystickHandle.offsetLeft;
    handleStartY = joystickHandle.offsetTop;
  }, { passive: false } );

  window.addEventListener( 'touchmove', touchmove, { passive: false } );

  window.addEventListener( 'touchend', ( event ) =>
  {
    if ( joystickActive )
    {
      joystickActive = false;
      joystickHandle.style.left = '16px';
      joystickHandle.style.top = '16px';
      mouseX = innerWidth / 2;
      mouseY = innerHeight / 2;
    }
    if ( event.touches.length === 0 )
    {
      touchCircle.hide();
    }
  }, { passive: true } );


  window.addEventListener( 'touchstart', ( event ) =>
  {
    if ( event.target.id == "splitBtn" )
    {
      wsSend( UINT8_CACHE[ 17 ] );
    } else if ( event.target.id == "ejectBtn" )
    {
      wsSend( UINT8_CACHE[ 21 ] );
    } else if ( event.target.id == "splitBotBtn" )
    {
      wsSend( UINT8_CACHE[ 22 ] );
    } else if ( event.target.id == "ejectBotBtn" )
    {
      wsSend( UINT8_CACHE[ 23 ] );
    } else if ( !joystickActive )
    {
      touchmove( event );
    }
    if ( event.touches.length > 0 && event.target !== joystick && event.target !== joystickHandle )
    {
      mobileStuff.show();
      touchCircle.show();
    }
  }, { passive: true } );

  gameReset();
  showESCOverlay();

  if ( window.location.search )
  {
    var div = /ip=([\w\W]+):([0-9]+)/.exec( window.location.search.slice( 1 ) );
    if ( div )
    {
      try
      {
        wsInit( div[ 1 ] + ":" + div[ 2 ] );
      } catch ( e )
      {
        console.error( 'Error al inicializar WebSocket:', e );
        alert( 'Error al conectar al servidor. Por favor, recarga la página.' );
      }
    }
  }

  // Iniciar el bucle de renderizado
  cacheCleanup();
  window.requestAnimationFrame( drawGame );
  log.info( "init done in " + ( Date.now() - LOAD_START ) + "ms" );
}
window.setserver = function ( arg )
{
  if ( wsUrl === arg ) return;
  wsInit( arg );
};
window.spectate = function ( a )
{
  window.isSpectating = true;
  wsSend( UINT8_CACHE[ 1 ] );
  stats.maxScore = 0;
  hideESCOverlay();
};
window.loadXP = function ( a )
{
  UpdateScore();
};
window.changeSkin = function ( a )
{
  byId( "skin" ).value = a;
  settings.skin = a;
  byId( "gallery" ).hide();
  byId( "gallery-yt" ).hide();
  updateCurrentSkinDisplay();
};
window.openSkinsList = function ()
{
  buildGallery();
  byId( "gallery" ).show( 0.5 );
};
window.showYoutuberSkins = function ()
{
  byId( "gallery-yt" ).show( 0.5 );
};
window.showSettings = function ()
{
  if ( byId( "settings-window-body" ).innerHTML == "" ) buildSettingsWindow();
  byId( "settings-window" ).show( 0.5 );
};
window.setDrawNameDistance = function ( a )
{
  settings.drawNamesDistance = a;
  document.getElementById( "namedistance" ).innerHTML = "Queue";
  $( "#drawNamesDistance" ).text( "Draw Names Distance: " + a );
};
window.addEventListener( "DOMContentLoaded", init );

function clloseStarterPack ()
{
  console.log( "cerrado" )
  byId( "starterPakFooter" ).hide( 0.5 );
}

function skincamb ()
{
  const currentSkinImg = document.getElementById( "currentSkin" );
  const currentSkinNameSpan = document.getElementById( "currentSkinName" );

  if ( settings.skin )
  {
    currentSkinImg.src = SKIN_URL + settings.skin + ".png";
    currentSkinNameSpan.textContent = settings.skin;
  } else
  {
    currentSkinImg.src = "";
    currentSkinNameSpan.textContent = "";
  }
}

function updateCurrentSkinDisplay ()
{
  const currentSkinImg = document.getElementById( "currentSkin" );
  const currentSkinNameSpan = document.getElementById( "currentSkinName" );

  if ( settings.skin )
  {
    currentSkinImg.src = SKIN_URL + settings.skin + ".png";
    //currentSkinNameSpan.textContent = settings.skin;
  } else
  {
    currentSkinImg.src = "";
    currentSkinNameSpan.textContent = "";
  }
}
//})();
