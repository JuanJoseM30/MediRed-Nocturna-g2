// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición (params, body, query),
// llama al servicio y arma la respuesta (código de estado + JSON).
// =====================================================================
const service = require('../services/citas.service');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'El id debe ser un entero positivo');
  }
  return id;
}

async function listar(req, res) {
  const filtros = {};

  if (req.query.estado !== undefined) {
    if (typeof req.query.estado !== 'string' || !req.query.estado.trim()) {
      throw new HttpError(400, 'El estado debe ser un texto no vacío');
    }
    filtros.estado = req.query.estado.trim();
  }

  if (req.query.sede !== undefined) {
    if (typeof req.query.sede !== 'string' || !req.query.sede.trim()) {
      throw new HttpError(400, 'La sede debe ser un texto no vacío');
    }
    filtros.sede = req.query.sede.trim();
  }

  if (req.query.ids !== undefined) {
    if (typeof req.query.ids !== 'string') {
      throw new HttpError(400, 'ids debe ser una lista de enteros positivos');
    }

    const valores = req.query.ids.split(',').map((valor) => valor.trim());
    if (
      valores.some(
        (valor) =>
          !/^[1-9]\d*$/.test(valor) ||
          !Number.isSafeInteger(Number(valor))
      )
    ) {
      throw new HttpError(400, 'ids debe contener enteros positivos separados por comas');
    }

    filtros.ids = valores.map(Number);
  }

  const citas = await service.listar(filtros, req.headers.authorization);
  res.status(200).json(citas);
}

async function obtener(req, res) {
  const cita = await service.obtener(leerId(req), req.headers.authorization);
  res.status(200).json(cita);
}

async function crear(req, res) {
  const nueva = await service.crear(req.body, req.headers.authorization);
  res.status(201).location(`${req.baseUrl}/${nueva.id}`).json(nueva);
}

async function actualizar(req, res) {
  const actualizada = await service.actualizar(leerId(req), req.body, req.headers.authorization);
  res.status(200).json(actualizada);
}

async function eliminar(req, res) {
  await service.eliminar(leerId(req));
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };