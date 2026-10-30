// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos.
// Versión del Taller 1: datos en memoria (se pierden al reiniciar).
// En el Taller 2 se reemplaza por MySQL SIN tocar las otras capas.
// Todas las funciones son async (devuelven promesas) para que el cambio
// a una base de datos real no obligue a modificar la capa de servicio.
// =====================================================================
const medicos = [
  { id: 1, nombre: 'Ana María Torres', registro_medico: 'RM-1001', especialidad: 'Pediatría', sede: 'Bogotá' },
  { id: 2, nombre: 'Carlos Rojas', registro_medico: 'RM-1002', especialidad: 'Cardiología', sede: 'Cali' },
  { id: 3, nombre: 'Lucía Gómez', registro_medico: 'RM-1003', especialidad: 'Medicina interna', sede: 'Medellín' },
];

let siguienteId = 4;

async function findAll() {
  return medicos;
}

async function findById(id) {
  return medicos.find((medico) => medico.id === id) || null;
}

async function findByRegistroMedico(registro_medico) {
  return medicos.find((medico) => medico.registro_medico === registro_medico) || null;
}

async function create(medico) {
  const nuevo = { id: siguienteId++, ...medico };
  medicos.push(nuevo);
  return nuevo;
}

module.exports = { findAll, findById, findByRegistroMedico, create };