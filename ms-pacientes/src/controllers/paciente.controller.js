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
  const pacientes = await pacienteService.listar();
  res.status(200).json(pacientes);
}

// GET /pacientes/:id
async function obtener(req, res) {
  const paciente = await pacienteService.obtener(leerId(req));
  res.status(200).json(paciente);
}

// POST /pacientes
async function crear(req, res) {
  const nuevo = await pacienteService.crear(req.body);
  res.status(201).location(`${req.baseUrl}/${nuevo.id}`).json(nuevo);
}

module.exports = { listar, obtener, crear };