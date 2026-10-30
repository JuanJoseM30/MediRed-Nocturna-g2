// =====================================================================
// Configuración de Express para ms-citas
// =====================================================================

const express = require('express');
const citasRoutes = require('./routes/citas.routes');

const app = express();

app.use(express.json());

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ servicio: 'ms-citas', estado: 'ok' });
});

// Rutas del recurso
app.use('/citas', citasRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message, detalles: err.detalles });
});

module.exports = app;
