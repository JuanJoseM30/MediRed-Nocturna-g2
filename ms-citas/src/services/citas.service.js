// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// =====================================================================
const repo = require('../repositories/citas.repository');
const { validarCita, construirCita } = require('../models/cita');
const HttpError = require('../utils/http-error');

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const cita = await repo.findById(id);
  if (!cita) throw new HttpError(404, `No existe la cita con id ${id}`);
  return cita;
}

async function crear(datos) {
  const errores = validarCita(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const cita = construirCita(datos);

  // Regla de negocio: Médico no disponible a esa fecha y hora (409 Conflict)
  const citaExistente = await repo.findByMedicoYFechaHora(cita.medico_id, cita.fecha_hora);
  if (citaExistente) {
    throw new HttpError(
      409,
      `El médico con id ${cita.medico_id} ya tiene una cita asignada para la fecha y hora ${cita.fecha_hora}`
    );
  }

  return repo.create(cita);
}

async function actualizar(id, datos) {
  const errores = validarCita(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const cita = construirCita(datos);

  // Regla de negocio: verificar si la nueva fecha/hora choca con otra cita del mismo médico
  const otraCita = await repo.findByMedicoYFechaHora(cita.medico_id, cita.fecha_hora);
  if (otraCita && otraCita.id !== id) {
    throw new HttpError(
      409,
      `El médico con id ${cita.medico_id} ya tiene una cita asignada para la fecha y hora ${cita.fecha_hora}`
    );
  }

  const actualizada = await repo.update(id, cita);
  if (!actualizada) throw new HttpError(404, `No existe la cita con id ${id}`);
  return actualizada;
}

async function eliminar(id) {
  const eliminada = await repo.remove(id);
  if (!eliminada) throw new HttpError(404, `No existe la cita con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
