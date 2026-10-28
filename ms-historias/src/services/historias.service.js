// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/historias.repository');
const { validarHistoria, construirHistoria } = require('../models/historia');
const HttpError = require('../utils/http-error');

async function listar() {
  return repo.findAll();
}

async function obtener(id) {
  const historia = await repo.findById(id);
  if (!historia) throw new HttpError(404, `No existe la historia con id ${id}`);
  return historia;
}

async function crear(datos) {
  const errores = validarHistoria(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const historia = construirHistoria(datos);

  // Regla de negocio: una atención no puede registrarse con fecha futura
  // (la historia clínica registra consultas que ya ocurrieron).
  const hoy = new Date().toISOString().slice(0, 10);
  if (historia.fecha > hoy) {
    throw new HttpError(400, 'Datos inválidos', ['fecha no puede ser posterior a hoy']);
  }

  return repo.create(historia);
}

module.exports = { listar, obtener, crear };