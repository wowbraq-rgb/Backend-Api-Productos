# Backend API Productos

CRUD con Express y frontend en HTML, CSS y JavaScript vanilla, sin compilación.

## Ejecutar

Desde esta carpeta:

```sh
npm install
npm start
```

Abre `frontend/index.html` con doble clic, o visita http://localhost:3000.
El backend debe permanecer encendido en ambos casos. También puedes arrancarlo con
`node servidor.js` o `node index.js`; ambos ejecutan la misma API.

Al abrir el HTML directamente, `frontend/app.js` usa `http://localhost:3000/productos`.
El ejemplo usa esa URL fija para facilitar la clase. Si cambias el puerto del backend,
ajusta API_URL en frontend/app.js.

## API

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | /productos | Lista de todos los productos (array) |
| GET | /productos?id=1 | Un producto por ID |
| GET | /productos?nombre=Producto%20A | Un producto por nombre exacto |
| GET | /productos/:id | Un producto por ID |
| POST | /productos | Crea un producto; devuelve 201 |
| PUT | /productos/:id | Actualiza nombre y precio |
| DELETE | /productos/:id | Elimina un producto |

Estas rutas también funcionan con el prefijo `/api/productos`.
POST y PUT requieren `Content-Type: application/json` y un cuerpo como:

```json
{ "nombre": "Teclado", "precio": 50000 }
```

El nombre no puede estar vacío y el precio debe ser un número mayor o igual a cero.
Los datos inválidos devuelven 400 y los productos inexistentes, 404.
Los IDs se generan automáticamente y no se repiten tras eliminar productos.

El frontend consume las API con `await fetch(API_URL)` y variantes para las
operaciones CRUD. Incluye búsqueda por ID o nombre, edición, confirmación antes de
eliminar y mensajes de error. CORS permite abrir el HTML desde el disco.

Los productos están en memoria: reiniciar el servidor restaura los datos iniciales.

## Verificación

```sh
npm test
```

Las pruebas usan un puerto temporal y comprueban CRUD, búsqueda, validaciones,
IDs únicos, CORS y la entrega de los archivos del frontend. Requieren Node.js 18 o superior.

