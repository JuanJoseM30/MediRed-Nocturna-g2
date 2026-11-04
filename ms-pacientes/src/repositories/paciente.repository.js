// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos.
// Versión del Taller 1: datos en memoria (se pierden al reiniciar).
// En el Taller 2 se reemplaza por MySQL SIN tocar las otras capas.
// =====================================================================

const pacientes = [
  { id: 1, nombre: 'Carlos Bacca', documento: 1010, fecha_nacimiento: '1990-10-15', eps: 'Nueva EPS', telefono: 123456789 },
  { id: 2, nombre: 'Miriam Lopez', documento: 2020, fecha_nacimiento: '1995-11-20', eps: 'Sura', telefono: 123456789 },
  { id: 3, nombre: 'Jhon Aponza', documento: 3030, fecha_nacimiento: '2000-12-05', eps: 'Colsanitas', telefono: 123456789 },
];
let siguienteId = 4;

async function findAll(filtros = {}) {
  return pacientes.filter((p) => {
    const coincideEps = !filtros.eps || String(p.eps || '').toLowerCase() === String(filtros.eps).toLowerCase();
    const coincideIds = !filtros.ids || filtros.ids.includes(Number(p.id));

    return coincideEps && coincideIds;
  });
}

async function findById(id) {
  // Busca estrictamente por id (clave para ms-citas y ms-historias)
  return pacientes.find((p) => Number(p.id) === Number(id)) || null;
}

async function findByDocumento(documento) {
  // El repositorio solo provee la consulta; el servicio decidirá qué hacer con esto
  return pacientes.find((p) => Number(p.documento) === Number(documento)) || null;
}

async function create(paciente) {
  // CORREGIDO: Se quitó el throw new HttpError(409). El repositorio solo guarda.
  const nuevo = { id: siguienteId++, ...paciente };
  pacientes.push(nuevo);
  return nuevo;
}

async function update(id, paciente) {
  const posicion = pacientes.findIndex((p) => Number(p.id) === Number(id));
  if (posicion === -1) return null;
  pacientes[posicion] = { id: Number(id), ...paciente };
  return pacientes[posicion];
}

async function remove(id) {
  const posicion = pacientes.findIndex((p) => Number(p.id) === Number(id));
  if (posicion === -1) return false;
  pacientes.splice(posicion, 1);
  return true;
}
async function findAll(filtros = {}) {
  
  return pacientes.filter((p) => {
    console.log(`Evaluando paciente ${p.nombre} con eps: '${p.eps}' frente al filtro: '${filtros.eps}'`);
    
    const coincideEps = !filtros.eps || String(p.eps || '').toLowerCase() === String(filtros.eps).toLowerCase();
    const coincideIds = !filtros.ids || filtros.ids.includes(Number(p.id));

    return coincideEps && coincideIds;
  });
}

module.exports = { findAll, findById, findByDocumento, create, update, remove };