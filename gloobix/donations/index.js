// index.js

import { Donaciones } from './script.js';

const donaciones = new Donaciones();

// Agregar donación
donaciones.agregarDonación({
    nombre: 'Donación 1',
    descripcion: 'Descripción de la donación 1',
    valor: 10.99,
    tipo: 'gloobix.io'
});

// Eliminar donación
donaciones.eliminarDonación({
    nombre: 'Donación 2',
    descripcion: 'Descripción de la donación 2',
    valor: 9.99,
    tipo: 'gloobix.io'
});

donaciones.mostrarDonaciones();
