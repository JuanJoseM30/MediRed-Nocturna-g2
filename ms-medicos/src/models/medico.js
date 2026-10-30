
const SEDES_VALIDAS = ['Bogotá', 'Cali', 'Medellín'];

function validarMedico(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return ['Se esperaba un objeto JSON con los datos del médico'];
  }

  const errores = [];

  if (typeof datos.nombre !== 'string' || !datos.nombre.trim()) {
    errores.push('nombre es obligatorio');
  }
  if (typeof datos.registro_medico !== 'string' || !datos.registro_medico.trim()) {
    errores.push('registro_medico es obligatorio');
  }
  if (typeof datos.especialidad !== 'string' || !datos.especialidad.trim()) {
    errores.push('especialidad es obligatoria');
  }
  if (typeof datos.sede !== 'string' || !SEDES_VALIDAS.includes(datos.sede.trim())) {
    errores.push(`sede debe ser una de: ${SEDES_VALIDAS.join(', ')}`);
  }

  return errores;
}

function construirMedico(datos) {
  return {
    nombre: datos.nombre.trim(),
    registro_medico: datos.registro_medico.trim().toUpperCase(),
    especialidad: datos.especialidad.trim(),
    sede: datos.sede.trim(),
  };
}

module.exports = { validarMedico, construirMedico };