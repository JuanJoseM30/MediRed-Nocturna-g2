// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// El token llega como un dato más para reenviarlo a los otros microservicios.
// =====================================================================
const repo = require('../repositories/historias.repository');
const pacientesClient = require('../clients/pacientes.client');
const medicosClient = require('../clients/medicos.client');
const { validarHistoria, construirHistoria } = require('../models/historia');
const HttpError = require('../utils/http-error');

// Fecha de hoy en formato AAAA-MM-DD, según la hora local del equipo
function fechaDeHoy() {
  return new Date().toLocaleDateString('en-CA');
}

// Valida los datos, aplica las reglas de negocio y devuelve la historia limpia
async function prepararHistoria(datos, token) {
  const errores = validarHistoria(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const historia = construirHistoria(datos);

  // Regla de negocio: una atención no puede registrarse con fecha futura
  // (la historia clínica registra consultas que ya ocurrieron). 400.
  if (historia.fecha > fechaDeHoy()) {
    throw new HttpError(400, 'Datos inválidos', ['fecha no puede ser posterior a hoy']);
  }

  // Relaciones (validación): el paciente y el médico deben existir
  if (!(await pacientesClient.existePaciente(historia.paciente_id, token))) {
    throw new HttpError(400, `No existe el paciente con id ${historia.paciente_id}`);
  }
  if (!(await medicosClient.existeMedico(historia.medico_id, token))) {
    throw new HttpError(400, `No existe el médico con id ${historia.medico_id}`);
  }

  return historia;
}

// Relaciones (composición): agrega a cada historia su paciente y su médico,
// con UNA sola consulta a cada microservicio (?ids=)
async function componer(historias, token) {
  const idsPacientes = [...new Set(historias.map((h) => h.paciente_id))];
  const idsMedicos = [...new Set(historias.map((h) => h.medico_id))];
  const pacientes = await pacientesClient.pacientesPorIds(idsPacientes, token);
  const medicos = await medicosClient.medicosPorIds(idsMedicos, token);

  const avisos = [];                                  // degradación controlada
  if (!pacientes) avisos.push('ms-pacientes no disponible');
  if (!medicos) avisos.push('ms-medicos no disponible');

  return historias.map((h) => {
    const compuesta = {
      ...h,
      paciente: pacientes ? pacientes.get(h.paciente_id) || null : null,
      medico: medicos ? medicos.get(h.medico_id) || null : null,
    };
    if (avisos.length > 0) compuesta.aviso = avisos.join('; ');
    return compuesta;
  });
}

async function listar(filtros, token) {
  return componer(await repo.findAll(filtros), token);
}

async function obtener(id, token) {
  const historia = await repo.findById(id);
  if (!historia) throw new HttpError(404, `No existe la historia con id ${id}`);
  const [compuesta] = await componer([historia], token);
  return compuesta;
}

async function crear(datos, token) {
  const historia = await prepararHistoria(datos, token);
  const nueva = await repo.create(historia);
  const [compuesta] = await componer([nueva], token);
  return compuesta;
}

async function actualizar(id, datos, token) {
  const historia = await prepararHistoria(datos, token);   // misma validación y reglas que crear
  const actualizada = await repo.update(id, historia);
  if (!actualizada) throw new HttpError(404, `No existe la historia con id ${id}`);
  const [compuesta] = await componer([actualizada], token);
  return compuesta;
}

async function eliminar(id) {
  const eliminada = await repo.remove(id);
  if (!eliminada) throw new HttpError(404, `No existe la historia con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
