const fs = require( "fs" ),
  path = require( "path" ),
  skinsDir = path.join( __dirname, "../skins" ),
  folderContents = fs.readdirSync( skinsDir ),
  pngFileNames = folderContents.filter( f => f.endsWith( ".png" ) );

if ( folderContents.length !== pngFileNames.length )
{
  const nonPngFileNames = folderContents.filter( f => !f.endsWith( ".png" ) );
  console.warn( "Warning: found " + nonPngFileNames.length + " non-PNG skins, these will not be loaded! (" + nonPngFileNames.join( "," ) + ")" );
}

fs.writeFileSync( "../txt Skins/skinList.txt", pngFileNames.map( f => f.slice( 0, -4 ) ).join() );
fs.writeFileSync( "../src/txt/skinList.txt", pngFileNames.map( f => f.slice( 0, -4 ) ).join() );
