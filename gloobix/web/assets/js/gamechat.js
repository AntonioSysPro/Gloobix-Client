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
        let yOffset = chatZone.y + chatZone.height;

        for ( let i = chatMessages.length - 1; i >= 0; i-- )
        {
            let msg = chatMessages[ i ];
            yOffset -= msg.height + 10;
            msg.y = yOffset; // Update y position for click detection

            // Erase previous text by drawing a semi-transparent rectangle over it
            ctx.fillStyle = "rgba(0, 0, 0, 0.0)"; // Fully transparent
            ctx.fillRect( chatZone.x, yOffset, chatZone.width, msg.height );

            // Draw chat message with transparency
            if ( msg.messageType == "FRIEND" ) ctx.fillStyle = "rgba(255, 255, 0, 0.7)";
            else if ( msg.messageType == "SERVER" ) ctx.fillStyle = "rgba(8, 45, 255, 0.7)";
            else if ( msg.messageType == "ADMIN" ) ctx.fillStyle = "rgba(255, 44, 44, 0.7)";
            else ctx.fillStyle = "rgba(156, 156, 156, 0.7)";
            drawRoundedRect( ctx, chatZone.x, yOffset, chatZone.width - 20, msg.height, 5 );

            // Draw close ("X") button background (red circle)
            let xButtonX = chatZone.x + chatZone.width - 35;
            let xButtonY = yOffset - 5;
            ctx.fillStyle = "rgba(180, 0, 0, 0.8)";
            ctx.beginPath();
            ctx.arc( xButtonX + 8, xButtonY + 8, 8, 0, Math.PI * 2 );
            ctx.fill();

            // Draw "X" text
            ctx.fillStyle = "white";
            ctx.font = "bold 12px Ubuntu";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText( "x", xButtonX + 8, xButtonY + 8 );

            // Draw message text
            ctx.fillStyle = "white";
            ctx.font = "16px Ubuntu";
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";

            let textY = yOffset + 24;
            for ( let line of msg.text )
            {
                ctx.fillText( line, chatZone.x + 10, textY );
                textY += 18;
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