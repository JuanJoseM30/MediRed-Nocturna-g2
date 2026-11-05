// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/historias.repository');
const { validarHistoria, construirHistoria } = require('../models/historia');
const HttpError = require('../utils/http-error');

// Fecha de hoy en formato AAAA-MM-DD, según la hora local del equipo
function fechaDeHoy() {
  return new Date().toLocaleDateString('en-CA');
}

// Valida los datos, aplica la regla de negocio y devuelve la historia limpia
function prepararHistoria(datos) {
  const errores = validarHistoria(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const historia = construirHistoria(datos);

  // Regla de negocio: una atención no puede registrarse con fecha futura
  // (la historia clínica registra consultas que ya ocurrieron). 400.
  if (historia.fecha > fechaDeHoy()) {
    throw new HttpError(400, 'Datos inválidos', ['fecha no puede ser posterior a hoy']);
  }

  return historia;
}

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const historia = await repo.findById(id);
  if (!historia) throw new HttpError(404, `No existe la historia con id ${id}`);
  return historia;
}

async function crear(datos) {
  const historia = prepararHistoria(datos);
  return repo.create(historia);
}

async function actualizar(id, datos) {
  const historia = prepararHistoria(datos);   // misma validación y regla que crear
  const actualizada = await repo.update(id, historia);
  if (!actualizada) throw new HttpError(404, `No existe la historia con id ${id}`);
  return actualizada;
}

async function eliminar(id) {
  const eliminada = await repo.remove(id);
  if (!eliminada) throw new HttpError(404, `No existe la historia con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
