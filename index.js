const http = require("http");

const productos = [
  { id: 1, nombre: "Producto A", precio: 25000 },
  { id: 2, nombre: "Producto B", precio: 40000 },
];

const servidor = http.createServer((req, res) => {

  if (req.url === "/") {

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end("<h1>Inicio</h1>");

  } else if (req.url === "/api/productos") {

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(productos));

  }
  
  else if (req.url === "/api/productos:id") {

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(productos));

  }else if (req.url === "/api/productos:nombre") {

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(productos));

}

  else {

    res.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end("<h1>404 - No encontrado</h1>");
  }

});

const PORT = 3000;

servidor.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});