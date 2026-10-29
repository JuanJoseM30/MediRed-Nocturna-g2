// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos.
// Versión del Taller 1: datos en memoria (se pierden al reiniciar).
// En el Taller 2 se reemplaza por MySQL SIN tocar las otras capas.
// Todas las funciones son async (devuelven promesas) para que el cambio
// a una base de datos real no obligue a modificar la capa de servicio.
// =====================================================================
const HttpError = require('../utils/http-error');

const pacientes = [
  { id: 1, nombre: 'Administrador General', documento: 1, fecha_nacimiento: '1990-10-15', EPS: 'Nueva EPS', telefono: 123456789 },
  { id: 2, nombre: 'Laura Gómez', documento: 2, fecha_nacimiento: '1995-11-20', EPS: 'Sura', telefono: 123456789 },
  { id: 3, nombre: 'Andrés Castillo', documento: 3, fecha_nacimiento: '2000-12-05', EPS: 'Colsanitas', telefono: 123456789 },
];
let siguienteId = 4;

async function findAll() {
  return pacientes;
}

async function findById(id) {
  return pacientes.find((p) => Number(p.id) === Number(id)) || null;
}

async function findByDocumento(documento) {
  return pacientes.find((p) => Number(p.documento) === Number(documento)) || null;
}

async function create(paciente) {
  const existe = await findByDocumento(paciente.documento);
  if (existe) {
    throw new HttpError(409, 'El documento del paciente ya se encuentra registrado');
  }

  const nuevo = { id: siguienteId++, ...paciente };
  pacientes.push(nuevo);
  return nuevo;
}

module.exports = { findAll, findById, findByDocumento, create };