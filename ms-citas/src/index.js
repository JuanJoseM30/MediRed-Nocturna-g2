// =====================================================================
// Punto de arranque del microservicio ms-citas
// =====================================================================

const app = require('./app');

const PORT = Number(process.env.PORT) || 3004;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`ms-citas escuchando en http://${HOST}:${PORT}`);
});
