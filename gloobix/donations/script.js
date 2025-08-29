// Donaciones.js

class Donaciones {
    constructor() {
        this.donaciones = [];
    }

    agregarDonación(donacion) {
        this.donaciones.push(donacion);
    }

    eliminarDonación(donacion) {
        const index = this.donaciones.indexOf(donacion);
        if (index !== -1) {
            this.donaciones.splice(index, 1);
        }
    }

    mostrarDonaciones() {
        console.log(this.donaciones);
    }
}

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
