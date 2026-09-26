const { test } = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("../servidor");

test("CRUD, búsquedas, validaciones y acceso al frontend", async () => {
  const servidor = app.listen(0);
  await new Promise(resolve => servidor.once("listening", resolve));
  const base = `http://localhost:${servidor.address().port}`;
  async function solicitar(ruta, method = "GET", body) {
    const respuesta = await fetch(base + ruta, { method, headers: { "Content-Type": "application/json", Origin: "null" }, body: body === undefined ? undefined : JSON.stringify(body) });
    assert.equal(respuesta.headers.get("access-control-allow-origin"), "*");
    return { status: respuesta.status, datos: await respuesta.json() };
  }
  try {
    assert.equal((await solicitar("/productos")).datos.length, 3);
    assert.equal((await solicitar("/api/productos")).datos.length, 3);
    assert.equal((await solicitar("/productos?id=1")).datos.nombre, "Producto A");
    assert.equal((await solicitar("/productos?nombre=Producto%20B")).datos.id, 2);
    assert.equal((await solicitar("/productos/1")).status, 200);
    for (const body of [{}, { nombre: " ", precio: 5 }, { nombre: "X", precio: -1 }, { nombre: "X", precio: "5" }]) {
      assert.equal((await solicitar("/productos", "POST", body)).status, 400);
    }
    const creado = await solicitar("/productos", "POST", { nombre: " Prueba ", precio: 0 });
    assert.equal(creado.status, 201);
    assert.equal(creado.datos.nombre, "Prueba");
    const editado = await solicitar(`/productos/${creado.datos.id}`, "PUT", { nombre: "Actualizado", precio: 1250.5 });
    assert.equal(editado.datos.precio, 1250.5);
    assert.equal((await solicitar("/productos/2", "DELETE")).status, 200);
    const segundo = await solicitar("/productos", "POST", { nombre: "Otro", precio: 1 });
    assert.ok(segundo.datos.id > creado.datos.id);
    const todos = (await solicitar("/productos")).datos;
    assert.equal(new Set(todos.map(p => p.id)).size, todos.length);
    for (const method of ["GET", "PUT", "DELETE"]) {
      assert.equal((await solicitar("/productos/999", method, method === "PUT" ? { nombre: "X", precio: 1 } : undefined)).status, 404);
    }
    assert.equal((await solicitar("/productos?nombre=Inexistente")).status, 404);
    assert.equal((await fetch(base + "/productos", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
    const preflight = await fetch(base + "/productos", { method: "OPTIONS", headers: { Origin: "null", "Access-Control-Request-Method": "PUT" } });
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get("access-control-allow-methods"), /PUT/);
    for (const ruta of ["/", "/app.js", "/estilos.css"]) assert.equal((await fetch(base + ruta)).status, 200);
  } finally { await new Promise(resolve => servidor.close(resolve)); }
});
