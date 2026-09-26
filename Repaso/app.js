const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const lista = document.querySelector("#todo-list");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const texto = input.value.trim();

    if (texto === "") {
        return;
    }

    // Crear el elemento <li>
    const tarea = document.createElement("li");

    tarea.textContent = texto;

    // Crear botón eliminar
    const botonEliminar = document.createElement("button");

    botonEliminar.textContent = "Eliminar";

    // Evento para eliminar
    botonEliminar.addEventListener("click", function() {
        tarea.remove();
    });

    // Agregar botón al li
    tarea.appendChild(botonEliminar);

    // Agregar tarea al ul
    lista.appendChild(tarea);

    // Limpiar input
    input.value = "";
});

async function obtenerTareas() {

    try {

        const respuesta = await fetch(
            "https://jsonplaceholder.typicode.com/todos?_limit=5"
        );

        const datos = await respuesta.json();

        datos.forEach(function(todo) {

            const tarea = document.createElement("li");

            tarea.textContent = todo.title;

            lista.appendChild(tarea);

        });

    } catch (error) {

        console.error(error);

    }

}

obtenerTareas();