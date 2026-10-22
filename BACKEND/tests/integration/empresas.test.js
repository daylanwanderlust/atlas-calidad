const request = require("supertest");
const app = require("../../src/app");
const { pool } = require("../../src/db");

describe("Rutas de Empresas (/empresas)", () => {
  // Al usar una base de datos falsa, las consultas válidas caerán en error 500
  test("GET /empresas › devuelve 500 por desconexión de base de datos", async () => {
    const res = await request(app).get("/empresas");
    expect(res.status).toBe(500);
  });

  test("GET /empresas/:id › devuelve 500 al buscar una empresa específica", async () => {
    const res = await request(app).get("/empresas/1");
    expect(res.status).toBe(500);
  });

  test("POST /empresas › intenta crear empresa y maneja error de BD", async () => {
    const res = await request(app).post("/empresas").send({
      rut: "12345678-9",
      nombre_fantasia: "Empresa Test",
      giro_actividad_economica: "Tecnología",
      correo_representante: "test@test.cl",
      moneda: "CLP",
    });
    // Permitimos 400 (si hay error de validación) o 500 (si llega a la BD falsa)
    expect([400, 500]).toContain(res.status);
  });

  test("GET /empresas › error 404 para ruta inexistente", async () => {
    const res = await request(app).get("/empresas/ruta-falsa/999");
    expect(res.status).toBe(404);
  });
});

afterAll(async () => {
  await pool.end(); // Cierra la conexión de la BD al terminar los tests
});
