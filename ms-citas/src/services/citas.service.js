// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// =====================================================================

const repo = require('../repositories/citas.repository');
const { validarCita, construirCita } = require('../models/cita');
const HttpError = require('../utils/http-error');

async function listar() {
  return repo.findAll();
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

  const citaExistente = await repo.findByMedicoYFechaHora(cita.medico_id, cita.fecha_hora);
  if (citaExistente) {
    throw new HttpError(
      409, 
      `El médico con id ${cita.medico_id} ya tiene una cita asignada para la fecha y hora ${cita.fecha_hora}`
    );
  }

  return repo.create(cita);
}

module.exports = { listar, obtener, crear };
