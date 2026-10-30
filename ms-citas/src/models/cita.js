// =====================================================================
// CAPA DE MODELO (entidad Cita)
// Define los atributos de una Cita y sus reglas de validación.
// =====================================================================

const ESTADOS_VALIDOS = ['programada', 'atendida', 'cancelada'];

function validarCita(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos de la cita'];
  }

  // paciente_id obligatorio y entero positivo
  if (!Number.isInteger(datos.paciente_id) || datos.paciente_id <= 0) {
    errores.push('paciente_id es obligatorio y debe ser un entero positivo');
  }

  // medico_id obligatorio y entero positivo
  if (!Number.isInteger(datos.medico_id) || datos.medico_id <= 0) {
    errores.push('medico_id es obligatorio y debe ser un entero positivo');
  }

  // fecha_hora obligatoria (cadena no vacía)
  if (!datos.fecha_hora || typeof datos.fecha_hora !== 'string' || datos.fecha_hora.trim() === '') {
    errores.push('fecha_hora es obligatoria');
  }

  // sede obligatoria (cadena no vacía)
  if (!datos.sede || typeof datos.sede !== 'string' || datos.sede.trim() === '') {
    errores.push('sede es obligatoria');
  }

  // estado opcional al crear (por defecto 'programada'), pero si viene debe ser uno válido
  if (datos.estado !== undefined && !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  return errores;
}

function construirCita(datos) {
  return {
    paciente_id: datos.paciente_id,
    medico_id: datos.medico_id,
    fecha_hora: datos.fecha_hora.trim(),
    sede: datos.sede.trim(),
    estado: datos.estado || 'programada',
  };
}

module.exports = { validarCita, construirCita };