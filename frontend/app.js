// Dirección del backend. Primero ejecuta: npm start
const API_URL = "http://localhost:3000/productos";

// 1. Buscar los elementos del HTML.
const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const tabla = document.getElementById("productos");
const mensaje = document.getElementById("mensaje");
const guardar = document.getElementById("guardar");
const cancelar = document.getElementById("cancelar");

// null significa que vamos a crear. Un ID significa que vamos a editar.
let idEdicion = null;

// 2. GET: pedir todos los productos al backend.
async function listarProductos() {
  try {
    const respuesta = await fetch(API_URL);
    const productos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = productos.error;
      return;
    }

    mostrarProductos(productos);
  } catch (error) {
    mensaje.textContent = "No se pudo conectar. Revisa que el backend esté encendido.";
  }
}

// 3. Dibujar una fila por producto.
function mostrarProductos(productos) {
  tabla.innerHTML = "";
  document.getElementById("resumen").textContent = productos.length + " producto(s)";

  for (const producto of productos) {
    const fila = tabla.insertRow();
    fila.insertCell().textContent = producto.id;
    fila.insertCell().textContent = producto.nombre;
    fila.insertCell().textContent = "$ " + producto.precio;
    const acciones = fila.insertCell();

    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.className = "secundario";
    botonEditar.onclick = function () {
      editarProducto(producto.id);
    };
    acciones.appendChild(botonEditar);

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "eliminar";
    botonEliminar.onclick = function () {
      eliminarProducto(producto.id);
    };
    acciones.appendChild(botonEliminar);
  }
}

// 4. POST crea un producto. PUT actualiza uno que ya existe.
async function guardarProducto(evento) {
  evento.preventDefault(); // Evita que el formulario recargue la página.

  const producto = {
    nombre: nombre.value.trim(),
    precio: Number(precio.value)
  };

  if (producto.nombre === "" || precio.value === "" || producto.precio < 0) {
    mensaje.textContent = "Escribe un nombre y un precio mayor o igual a cero.";
    return;
  }

  let url = API_URL;
  let metodo = "POST";

  if (idEdicion !== null) {
    url = API_URL + "/" + idEdicion;
    metodo = "PUT";
  }

  guardar.disabled = true;

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto) // Convertir el objeto a texto JSON.
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = datos.error;
      return;
    }

    limpiarFormulario();
    mensaje.textContent = "Producto guardado correctamente.";
    await listarProductos();
  } catch (error) {
    mensaje.textContent = "No se pudo guardar el producto. Revisa el backend.";
  } finally {
    guardar.disabled = false;
  }
}

// 5. GET por ID: cargar el producto en el formulario para editarlo.
async function editarProducto(id) {
  try {
    const respuesta = await fetch(API_URL + "/" + id);
    const producto = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = producto.error;
      return;
    }

    idEdicion = producto.id;
    nombre.value = producto.nombre;
    precio.value = producto.precio;
    guardar.textContent = "Guardar cambios";
    cancelar.hidden = false;
    document.getElementById("titulo-formulario").textContent = "Editar producto";
    nombre.focus();
  } catch (error) {
    mensaje.textContent = "No se pudo consultar el producto. Revisa el backend.";
  }
}

// 6. DELETE: eliminar el producto elegido.
async function eliminarProducto(id) {
  const confirmado = confirm("¿Quieres eliminar el producto " + id + "?");
  if (!confirmado) return;

  try {
    const respuesta = await fetch(API_URL + "/" + id, {
      method: "DELETE"
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = datos.error;
      return;
    }

    if (idEdicion === id) limpiarFormulario();
    mensaje.textContent = "Producto eliminado correctamente.";
    await listarProductos();
  } catch (error) {
    mensaje.textContent = "No se pudo eliminar el producto. Revisa el backend.";
  }
}

// 7. Buscar por ID o por nombre exacto usando parámetros en la URL.
async function buscarProducto(evento) {
  evento.preventDefault();
  const criterio = document.getElementById("criterio").value;
  const consulta = document.getElementById("consulta").value.trim();
  // encodeURIComponent permite enviar nombres con espacios o símbolos.
  const url = API_URL + "?" + criterio + "=" + encodeURIComponent(consulta);

  try {
    const respuesta = await fetch(url);
    const producto = await respuesta.json();

    if (!respuesta.ok) {
      mostrarProductos([]);
      mensaje.textContent = producto.error;
      return;
    }

    mensaje.textContent = "";
    mostrarProductos([producto]); // La tabla recibe una lista.
  } catch (error) {
    mensaje.textContent = "No se pudo buscar el producto. Revisa el backend.";
  }
}

function limpiarFormulario() {
  formulario.reset();
  idEdicion = null;
  guardar.textContent = "Crear producto";
  cancelar.hidden = true;
  document.getElementById("titulo-formulario").textContent = "Nuevo producto";
}

// 8. Conectar los botones y formularios con las funciones.
formulario.addEventListener("submit", guardarProducto);
document.getElementById("busqueda").addEventListener("submit", buscarProducto);
cancelar.addEventListener("click", limpiarFormulario);
document.getElementById("listar").addEventListener("click", function () {
  mensaje.textContent = "";
  listarProductos();
});

// Cargar los productos al abrir la página.
listarProductos();
