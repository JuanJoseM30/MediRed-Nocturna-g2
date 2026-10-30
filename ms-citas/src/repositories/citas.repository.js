// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// =====================================================================

const citas = [
  { id: 1, paciente_id: 1, medico_id: 1, fecha_hora: '2026-11-03T08:00', sede: 'Cali', estado: 'programada' },
  { id: 2, paciente_id: 2, medico_id: 2, fecha_hora: '2026-11-03T09:30', sede: 'Bogotá', estado: 'atendida' },
  { id: 3, paciente_id: 3, medico_id: 1, fecha_hora: '2026-11-04T10:00', sede: 'Cali', estado: 'cancelada' },
];
let siguienteId = 4;

async function findAll() {
  return citas;
}

async function findById(id) {
  return citas.find((c) => c.id === id) || null;
}

async function create(cita) {
  const nueva = { id: siguienteId++, ...cita };
  citas.push(nueva);
  return nueva;
}

// Busca si ya existe una cita programada para el mismo médico a la misma fecha y hora
async function findByMedicoYFechaHora(medico_id, fecha_hora) {
  return citas.find(
    (c) => c.medico_id === medico_id && 
           c.fecha_hora === fecha_hora && 
           c.estado !== 'cancelada'
  ) || null;
}

// Actualiza el module.exports agregando la nueva función:
module.exports = { findAll, findById, create, findByMedicoYFechaHora };
