// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene un Paciente y qué reglas deben cumplir.
// No sabe nada de HTTP ni de bases de datos.
// =====================================================================

// Los roles válidos vienen del archivo .env (cada empresa tiene los suyos)
function rolesValidos() {
  return (process.env.ROLES || 'administrador')
    .split(',')
    .map((r) => r.trim())
    .filter((r) => r !== '');
}

const DOCUMENTO_VALIDO = /^[0-9]+$/;

// Devuelve una lista de errores de validación (vacía si todo está bien)
function validarPaciente(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos del paciente'];
  }
  if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    errores.push('nombre es obligatorio');
  }
  if (!datos.documento || (typeof datos.documento !== 'string' && typeof datos.documento !== 'number') || !DOCUMENTO_VALIDO.test(String(datos.documento).trim())) {
    errores.push('documento es obligatorio y debe tener un formato válido');
  }
  const roles = rolesValidos();
  if (!roles.includes(datos.rol)) {
    errores.push(`rol debe ser uno de: ${roles.join(', ')}`);
  }
  if (datos.activo !== undefined && typeof datos.activo !== 'boolean') {
    errores.push('activo debe ser true o false');
  }
  if (datos.telefono === undefined || datos.telefono === null || isNaN(Number(datos.telefono))) {
    errores.push('telefono es obligatorio y debe ser numérico');
  }
  return errores;
}

// Construye un paciente "limpio" solo con los campos permitidos y tipos correctos
function construirPaciente(datos) {
  return {
    nombre: datos.nombre.trim(),
    documento: String(datos.documento).trim(),
    fecha_nacimiento: datos.fecha_nacimiento.trim(),
    EPS: datos.EPS.trim(),
    telefono: Number(datos.telefono),
    rol: datos.rol
  };
}

module.exports = { validarPaciente, construirPaciente };