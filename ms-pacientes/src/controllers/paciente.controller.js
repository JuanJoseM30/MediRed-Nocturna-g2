// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición (params, body),
// llama al servicio y arma la respuesta (código de estado + JSON).
// =====================================================================
const pacienteService = require('../services/paciente.service');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

// GET /pacientes
async function listar(req, res) {
  const filtros = { eps: req.query.eps };
  if (req.query.ids) {
    const idsArray = String(req.query.ids).split(',').map(Number);
    // Si alguno de los elementos no es un número válido (NaN), lanzamos el error 400
    if (idsArray.some(isNaN)) {
      throw new HttpError(400, 'El parámetro ids debe ser una lista de enteros separados por comas');
    }
    filtros.ids = idsArray;
  }

  const pacientes = await pacienteService.listar(filtros);
  return res.status(200).json(pacientes);
}

// GET /pacientes/:id
async function obtener(req, res) {
  const paciente = await pacienteService.obtener(leerId(req));
  return res.status(200).json(paciente);
}

// POST /pacientes
async function crear(req, res) {
  const nuevo = await pacienteService.crear(req.body);
  return res.status(201).location(`${req.baseUrl}/${nuevo.id}`).json(nuevo);
}

// PUT /pacientes/:id
async function actualizar(req, res) {
  const nuevo = await pacienteService.actualizar(leerId(req), req.body);
  return res.status(200).json(nuevo);
}

// DELETE /pacientes/:id
async function eliminar(req, res) {
  await pacienteService.eliminar(leerId(req));
  return res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };