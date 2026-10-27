// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos.
// Versión del Taller 1: datos en memoria (se pierden al reiniciar).
// En el Taller 2 se reemplaza por MySQL SIN tocar las otras capas.
// Todas las funciones son async (devuelven promesas) para que el cambio
// a una base de datos real no obligue a modificar la capa de servicio.
// =====================================================================
const pacientes = [
  { id: 1, nombre: 'Administrador General', documento: '1', fecha_nacimiento: 'octubre', EPS: 'Suramericana', telefono: 123456789, "rol": "admisiones" },
  { id: 2, nombre: 'Laura Gómez', documento: '2', fecha_nacimiento: 'noviembre', EPS: 'Sura', telefono: 123456789, "rol": "administrador" },
  { id: 3, nombre: 'Andrés Castillo', documento: '3', fecha_nacimiento: 'diciembre', EPS: 'Sura', telefono: 123456789, "rol": "medico" },
];
let siguienteId = 4;

async function findAll() {
  return pacientes;
}

async function findById(id) {
  return pacientes.find((p) => String(p.id) === String(id)) || null;
}

async function findByDocumento(documento) {
  return pacientes.find((p) => String(p.documento) === String(documento)) || null;
}

async function create(paciente) {
  const nuevo = { id: siguienteId++, ...paciente };
  pacientes.push(nuevo);
  return nuevo;
}

module.exports = { findAll, findById, findByDocumento, create };