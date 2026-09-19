const express = require("express"); 
const  app = express();
app.use(express.json());

let  productos = [
  { id: 1, nombre: "Producto A", precio: 25000 },
  { id: 2, nombre: "Producto B", precio: 40000 },
  { id: 3, nombre: "Producto C", precio: 15000 },
];

function registrarPeticion (req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
   
// sin esto, la petición se atasca 
}

app.use(registrarPeticion);



app.get("/productos", (req, res) => {
   
const  idRequest = Number(req.query.id);
const  nombreRequest = req.query.nombre;
const  producto = productos.find((p) => (p.id === idRequest || p.nombre === nombreRequest));
   
if  (producto ) {
    res.json(producto);
  }  
else  {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.post("/productos", (req, res) => {
  const nuevoProducto = {
    id: productos.length + 1,
    nombre: req.body.nombre,
    precio: req.body.precio,
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put("/productos/:id", (req, res) => {
   
const  id = Number(req.params.id);
   
const  producto = productos
    .find((p) => p.id === id);
   
if  (!producto) {
     
return  res.status(404).json({
      error: "No encontrado" });
  }
  producto.nombre = req.body.nombre;
  producto.precio = req.body.precio;
  res.json(producto);
});

app.delete("/productos/:id",
  (req, res) => {
     
const  id = Number(req.params.id);
    productos = productos.filter(
      (p) => p.id !== id
    );
    res.json({
      mensaje: "Producto eliminado"
    });
  });



app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});