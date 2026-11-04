// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio en memoria)
// =====================================================================
let citas = [
  { id: 1, paciente_id: 1, medico_id: 1, fecha_hora: '2026-11-03T08:00', sede: 'Cali', estado: 'programada' },
  { id: 2, paciente_id: 2, medico_id: 2, fecha_hora: '2026-11-03T09:30', sede: 'Bogotá', estado: 'atendida' },
  { id: 3, paciente_id: 3, medico_id: 1, fecha_hora: '2026-11-04T10:00', sede: 'Cali', estado: 'cancelada' },
];
let siguienteId = 4;

async function findAll(filtros = {}) {
  let resultado = [...citas];
  if (filtros.estado) {
    resultado = resultado.filter((c) => c.estado === filtros.estado);
  }
  if (filtros.sede) {
    resultado = resultado.filter((c) => c.sede.toLowerCase() === filtros.sede.toLowerCase());
  }
  return resultado;
}

async function findById(id) {
  return citas.find((c) => c.id === id) || null;
}

async function findByMedicoYFechaHora(medico_id, fecha_hora) {
  return citas.find(
    (c) => c.medico_id === medico_id && 
           c.fecha_hora === fecha_hora && 
           c.estado !== 'cancelada'
  ) || null;
}

async function create(cita) {
  const nueva = { id: siguienteId++, ...cita };
  citas.push(nueva);
  return nueva;
}

async function update(id, datosCita) {
  const indice = citas.findIndex((c) => c.id === id);
  if (indice === -1) return null;
  citas[indice] = { id, ...datosCita };
  return citas[indice];
}

async function remove(id) {
  const indice = citas.findIndex((c) => c.id === id);
  if (indice === -1) return false;
  citas.splice(indice, 1);
  return true;
}

module.exports = { findAll, findById, findByMedicoYFechaHora, create, update, remove };