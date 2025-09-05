function loadChat ()
{
    const canvas = document.getElementById( "canvas" );
    const ctx = canvas.getContext( "2d" );

    const chatZone = { x: 20, y: canvas.height - 450, width: 350, height: 400 };
    let chatMessages = [];
    let messageTimers = new Map(); // Store timers for cleanup

    window.addChatMessage = function ( nickname, text, messageType )
    {
        addChatMessage( nickname, text, messageType );
    }

    function addChatMessage ( nickname, text, messageType )
    {
        const maxWidth = 330; // Adjusted for padding
        const padding = 10;
        const lineHeight = 18;
        text = nickname + ": " + text;
        const words = text.split( " " );
        let lines = [];
        let line = "";

        // Word wrapping
        for ( let word of words )
        {
            let testLine = line + word + " ";
            let testWidth = ctx.measureText( testLine ).width;
            if ( testWidth > maxWidth && line !== "" )
            {
                lines.push( line );
                line = word + " ";
            } else
            {
                line = testLine;
            }
        }
        lines.push( line );

        let boxHeight = padding * 2 + lines.length * lineHeight;

        // Store message
        let msg = {
            text: lines,
            messageType: messageType,
            height: boxHeight,
            x: chatZone.x,
            y: 0 // Will be calculated in drawChat()
        };
        chatMessages.push( msg );

        // Auto-remove after 60s (clearing to avoid memory leaks)
        let timer = setTimeout( () =>
        {
            removeChatMessage( msg );
        }, 60000 );

        messageTimers.set( msg, timer );

        checkOverflow(); // Ensure messages fit
    }

    function removeChatMessage ( msg )
    {
        chatMessages = chatMessages.filter( m => m !== msg );

        // Clear its timer if it exists
        if ( messageTimers.has( msg ) )
        {
            clearTimeout( messageTimers.get( msg ) );
            messageTimers.delete( msg );
        }
    }

    function checkOverflow ()
    {
        let totalHeight = chatMessages.reduce( ( sum, msg ) => sum + msg.height + 10, 0 );

        while ( totalHeight > chatZone.height && chatMessages.length > 0 )
        {
            removeChatMessage( chatMessages[ 0 ] ); // Remove the oldest message
            totalHeight = chatMessages.reduce( ( sum, msg ) => sum + msg.height + 10, 0 );
        }
    }

    function drawChat ()
{
  if ( chat.messages.length === 0 && settings.showChat )
    return ( chat.visible = false );
  chat.visible = true;
  var canvas = chat.canvas;
  var ctx = canvas.getContext( "2d" );
  var latestMessages = chat.messages.slice( -8 );
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

    function drawRoundedRect ( ctx, x, y, width, height, radius )
    {
        ctx.beginPath();
        ctx.moveTo( x + radius, y );
        ctx.lineTo( x + width - radius, y );
        ctx.arcTo( x + width, y, x + width, y + radius, radius );
        ctx.lineTo( x + width, y + height - radius );
        ctx.arcTo( x + width, y + height, x + width - radius, y + height, radius );
        ctx.lineTo( x + radius, y + height );
        ctx.arcTo( x, y + height, x, y + height - radius, radius );
        ctx.lineTo( x, y + radius );
        ctx.arcTo( x, y, x + radius, y, radius );
        ctx.closePath();
        ctx.fill();
    }

    // Click event listener to handle "X" button clicks
    canvas.addEventListener( "click", ( event ) =>
    {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        for ( let msg of chatMessages )
        {
            let xButtonX = chatZone.x + chatZone.width - 35 + 8; // Circle center X
            let xButtonY = msg.y - 5 + 8; // Adjusted Circle center Y

            // Check if click is inside the circle (distance formula)
            let dist = Math.sqrt( ( clickX - xButtonX ) ** 2 + ( clickY - xButtonY ) ** 2 );
            if ( dist <= 8 )
            {
                removeChatMessage( msg );
                break;
            }
        }
    } );


    function updateChat ()
    {
        drawChat();
        requestAnimationFrame( updateChat );
    }

    updateChat(); // Start rendering

    // Example usage: Adding a new message every 5 seconds
    addChatMessage( "SERVER", "Welcome back to GloObix.io!", "SERVER" );
    console.log( `%c GAME CHAT: Game chat loaded.`, 'background: #222; color: #bada55' );

}