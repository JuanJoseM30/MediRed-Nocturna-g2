// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición (params, body),
// llama al servicio y arma la respuesta (código de estado + JSON).
// =====================================================================
const service = require('../services/historias.service');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

// GET /historias  y  GET /historias?paciente_id=1
async function listar(req, res) {
  const filtros = {};
  if (req.query.paciente_id !== undefined) {
    filtros.paciente_id = Number(req.query.paciente_id);
    if (!Number.isInteger(filtros.paciente_id) || filtros.paciente_id <= 0) {
      throw new HttpError(400, 'paciente_id debe ser un entero positivo');
    }
  }
  const historias = await service.listar(filtros);
  res.status(200).json(historias);
}

// GET /historias/:id
async function obtener(req, res) {
  const historia = await service.obtener(leerId(req));
  res.status(200).json(historia);
}

// POST /historias
async function crear(req, res) {
  const nueva = await service.crear(req.body);
  res.status(201).location(`${req.baseUrl}/${nueva.id}`).json(nueva);
}

// PUT /historias/:id
async function actualizar(req, res) {
  const actualizada = await service.actualizar(leerId(req), req.body);
  res.status(200).json(actualizada);
}

// DELETE /historias/:id
async function eliminar(req, res) {
  await service.eliminar(leerId(req));
  res.status(204).end();                      // 204 No Content: éxito, sin cuerpo
}

module.exports = { listar, obtener, crear, actualizar, eliminar };