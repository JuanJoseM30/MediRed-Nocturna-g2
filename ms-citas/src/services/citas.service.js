// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// =====================================================================
const repo = require('../repositories/citas.repository');
const { validarCita, construirCita } = require('../models/cita');
const HttpError = require('../utils/http-error');
const pacientesClient = require('../clients/pacientes.client');
const medicosClient = require('../clients/medicos.client');

async function validarReferencias(pacienteId, medicoId, token) {
  if (!(await pacientesClient.existePaciente(pacienteId, token))) {
    throw new HttpError(400, `No existe el paciente con id ${pacienteId}`);
  }
  if (!(await medicosClient.existeMedico(medicoId, token))) {
    throw new HttpError(400, `No existe el médico con id ${medicoId}`);
  }
}

async function componer(citas, token) {
  if (!citas || citas.length === 0) return [];

  const pacienteIds = [...new Set(citas.map((c) => c.paciente_id))];
  const medicoIds = [...new Set(citas.map((c) => c.medico_id))];

  const [mapPacientes, mapMedicos] = await Promise.all([
    pacientesClient.pacientesPorIds(pacienteIds, token),
    medicosClient.medicosPorIds(medicoIds, token)
  ]);

  return citas.map((cita) => {
    const pacienteObj = mapPacientes ? (mapPacientes.get(cita.paciente_id) || null) : null;
    const medicoObj = mapMedicos ? (mapMedicos.get(cita.medico_id) || null) : null;

    let aviso = undefined;
    if (!mapPacientes && !mapMedicos) aviso = 'ms-pacientes y ms-medicos no disponibles';
    else if (!mapPacientes) aviso = 'ms-pacientes no disponible';
    else if (!mapMedicos) aviso = 'ms-medicos no disponible';

    return {
      ...cita,
      paciente: pacienteObj,
      medico: medicoObj,
      ...(aviso && { aviso })
    };
  });
}

async function listar(filtros = {}, token) {
  const citas = await repo.findAll(filtros);
  return componer(citas, token);
}

async function obtener(id, token) {
  const cita = await repo.findById(id);
  if (!cita) {
    throw new HttpError(404, `No existe la cita con id ${id}`);
  }
  const [compuesta] = await componer([cita], token);
  return compuesta;
}

async function crear(datos, token) {
  const errores = validarCita(datos);
  if (errores.length > 0) {
    throw new HttpError(400, 'Datos inválidos', errores);
  }

  const cita = construirCita(datos);
  await validarReferencias(cita.paciente_id, cita.medico_id, token);

  const solapada = await repo.findByMedicoYFechaHora(cita.medico_id, cita.fecha_hora);
  if (solapada) {
    throw new HttpError(409, `El médico ya tiene una cita asignada en la fecha/hora ${cita.fecha_hora}`);
  }

  const nueva = await repo.create(cita);
  const [compuesta] = await componer([nueva], token);
  return compuesta;
}

async function actualizar(id, datos, token) {
  const errores = validarCita(datos);
  if (errores.length > 0) {
    throw new HttpError(400, 'Datos inválidos', errores);
  }

  const cita = construirCita(datos);
  const existe = await repo.findById(id);
  if (!existe) {
    throw new HttpError(404, `No existe la cita con id ${id}`);
  }

  await validarReferencias(cita.paciente_id, cita.medico_id, token);

  const solapada = await repo.findByMedicoYFechaHora(cita.medico_id, cita.fecha_hora);
  if (solapada && solapada.id !== id) {
    throw new HttpError(409, `El médico ya tiene una cita asignada en la fecha/hora ${cita.fecha_hora}`);
  }

  const actualizada = await repo.update(id, cita);
  const [compuesta] = await componer([actualizada], token);
  return compuesta;
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) {
    throw new HttpError(404, `No existe la cita con id ${id}`);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };