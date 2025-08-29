// No se utiliza JavaScript en esta página de agradecimientos.

// Si necesitas agregar un efecto o interactivo, puedes utilizar el siguiente código:
document.addEventListener("DOMContentLoaded", function() {
    const contenido = document.querySelector(".contenido");
    const apartados = [
        { texto: "Backend: El equipo que se encargó de crear el juego" },
        { texto: "Frontend: El equipo que se encargó de diseñar la interfaz del juego" },
        { texto: "Demás: El equipo que se encargó de realizar los efectos visuales y sonidos del juego" }
    ];

    apartados.forEach(function(apartado) {
        const div = document.createElement("div");
        div.classList.add("apartado-backend", "apartado-frontend", "apartado-demás");
        const p = document.createElement("p");
        p.textContent = apartado.texto;
        div.appendChild(p);
        contenido.appendChild(div);
    });
});
