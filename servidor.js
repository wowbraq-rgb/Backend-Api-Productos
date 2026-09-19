const express = require("express"); 

const  app = express();

const  productos = [
  { id: 1, nombre: "Producto A", precio: 25000 },
  { id: 2, nombre: "Producto B", precio: 40000 },
  { id: 3, nombre: "Producto C", precio: 15000 },
];

app.get("/productos", (req, res) => {
  res.json(productos);
});

app.get("/productos/:id/:nombre", (req, res) => {
   
const  idRequest = Number(req.params.id);
const  nombreRequest = req.params.nombre;
   
const  producto = productos.find((p) => (p.id === idRequest && p.nombre === nombreRequest));

   
if  (producto ) {
    res.json(producto);
  }  
else  {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
