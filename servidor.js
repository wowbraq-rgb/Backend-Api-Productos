const express = require("express");
const path = require("path");
const app = express();

// Permite consumir la API al abrir frontend/index.html directamente.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());

let productos = [
  { id: 1, nombre: "Producto A", precio: 25000 },
  { id: 2, nombre: "Producto B", precio: 40000 },
  { id: 3, nombre: "Producto C", precio: 15000 },
];
let siguienteId = 4;

function validarProducto(req, res, next) {
  const { nombre, precio } = req.body || {};
  if (typeof nombre !== "string" || !nombre.trim() ||
      typeof precio !== "number" || !Number.isFinite(precio) || precio < 0) {
    return res.status(400).json({ error: "El nombre es obligatorio y el precio debe ser un número mayor o igual a cero." });
  }
  next();
}

const api = express.Router();
api.get("/", (req, res) => {
  const { id, nombre } = req.query;
  if (id === undefined && nombre === undefined) return res.json(productos);
  const producto = productos.find(p => p.id === Number(id) || p.nombre === nombre);
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});
api.get("/:id", (req, res) => {
  const producto = productos.find(p => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});
api.post("/", validarProducto, (req, res) => {
  const producto = { id: siguienteId++, nombre: req.body.nombre.trim(), precio: req.body.precio };
  productos.push(producto);
  res.status(201).json(producto);
});
api.put("/:id", validarProducto, (req, res) => {
  const producto = productos.find(p => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  producto.nombre = req.body.nombre.trim();
  producto.precio = req.body.precio;
  res.json(producto);
});
api.delete("/:id", (req, res) => {
  const indice = productos.findIndex(p => p.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ error: "Producto no encontrado" });
  productos.splice(indice, 1);
  res.json({ mensaje: "Producto eliminado" });
});
app.use("/productos", api);
app.use("/api/productos", api);
app.use(express.static(path.join(__dirname, "frontend")));
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") return res.status(400).json({ error: "JSON inválido" });
  res.status(error.status || 500).json({ error: "No fue posible procesar la petición" });
});

function iniciarServidor() {
  const puerto = process.env.PORT || 3000;
  return app.listen(puerto, () => console.log(`Servidor en http://localhost:${puerto}`));
}
if (require.main === module) iniciarServidor();
module.exports = { app, iniciarServidor };
