// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene una Historia clínica y qué reglas deben cumplir.
// No sabe nada de HTTP ni de bases de datos.
// =====================================================================

const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/; // formato AAAA-MM-DD

function esIdValido(valor) {
  return Number.isInteger(valor) && valor > 0;
}

function esTextoValido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Devuelve una lista de errores de validación (vacía si todo está bien)
function validarHistoria(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos de la historia'];
  }
  if (!esIdValido(datos.paciente_id)) {
    errores.push('paciente_id es obligatorio y debe ser un entero positivo');
  }
  if (!esIdValido(datos.medico_id)) {
    errores.push('medico_id es obligatorio y debe ser un entero positivo');
  }
  if (typeof datos.fecha !== 'string' || !FECHA_VALIDA.test(datos.fecha)) {
    errores.push('fecha es obligatoria con formato AAAA-MM-DD');
  }
  if (!esTextoValido(datos.motivo_consulta)) {
    errores.push('motivo_consulta es obligatorio');
  }
  if (!esTextoValido(datos.diagnostico)) {
    errores.push('diagnostico es obligatorio');
  }
  if (!esTextoValido(datos.tratamiento)) {
    errores.push('tratamiento es obligatorio');
  }
  return errores;
}

// Construye una historia "limpia" solo con los campos permitidos
function construirHistoria(datos) {
  return {
    paciente_id: datos.paciente_id,
    medico_id: datos.medico_id,
    fecha: datos.fecha,
    motivo_consulta: datos.motivo_consulta.trim(),
    diagnostico: datos.diagnostico.trim(),
    tratamiento: datos.tratamiento.trim(),
  };
}

module.exports = { validarHistoria, construirHistoria };