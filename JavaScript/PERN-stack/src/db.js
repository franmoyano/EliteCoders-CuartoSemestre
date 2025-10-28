import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres1",
  port: 5432,           
  database: "mi_db_pern",
});

// Evento: confirma conexión
pool.on("connect", () => {
  console.log("Conectado a la base de datos PostgreSQL");
});
  
// Evento: manejo de errores
pool.on("error", (err) => {
  console.error("Error en la conexión a la base de datos:", err.message);
});