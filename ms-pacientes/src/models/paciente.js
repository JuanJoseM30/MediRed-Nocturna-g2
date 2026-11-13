// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene un Paciente y qué reglas deben cumplir.
// =====================================================================

function epsValidas() {
  return (process.env.EPS || 'Sura,Colsanitas,Nueva EPS')
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e !== '');
}

const NUMERO_VALIDO = /^[0-9]+(\.[0-9]+)?$/;
// Expresión regular para validar formato estándar YYYY-MM-DD
const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

function validarPaciente(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos del paciente'];
  }

  // nombre: texto obligatorio
  if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    errores.push('nombre es obligatorio y debe ser de tipo texto');
  }

  // documento: float obligatorio
  const docStr = String(datos.documento || '').trim();
  if (datos.documento === undefined || datos.documento === null || !NUMERO_VALIDO.test(docStr)) {
    errores.push('documento es obligatorio y debe ser de tipo float (numérico)');
  }

  // fecha_nacimiento: tipo date (validando formato YYYY-MM-DD, fecha real y que no sea futura)
  const fechaStr = String(datos.fecha_nacimiento || '').trim();
  if (!fechaStr || !FECHA_VALIDA.test(fechaStr) || isNaN(Date.parse(fechaStr))) {
    errores.push('fecha_nacimiento es obligatoria y debe tener un formato de fecha válido (YYYY-MM-DD)');
  } else {
    // Añadimos 'T00:00:00' para que JavaScript interprete la fecha correctamente en la zona horaria local
    const fechaNacimiento = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizamos las horas para comparar solo el día

    if (fechaNacimiento > hoy) {
      errores.push('la fecha de nacimiento no puede ser una fecha futura');
    }
  }

  // eps: texto obligatorio dentro de las permitidas
  const listaEps = epsValidas();
  const epsIngresada = datos.EPS || datos.eps;
  const esEpsValida = listaEps.some(
    (e) => e.toLowerCase() === String(epsIngresada || '').trim().toLowerCase()
  );
  if (!epsIngresada || !esEpsValida) {
    errores.push(`eps debe ser una de: ${listaEps.join(', ')}`);
  }

  // teléfono: float obligatorio
  const telStr = String(datos.telefono || '').trim();
  if (datos.telefono === undefined || datos.telefono === null || !NUMERO_VALIDO.test(telStr)) {
    errores.push('telefono es obligatorio y debe ser de tipo float (numérico)');
  }

  return errores;
}

function construirPaciente(datos) {
  return {
    nombre: String(datos.nombre).trim(),
    documento: Number(datos.documento),
    fecha_nacimiento: String(datos.fecha_nacimiento).trim(),
    eps: String(datos.eps || datos.EPS || '').trim(),
    telefono: Number(datos.telefono)
  };
}

module.exports = { validarPaciente, construirPaciente };