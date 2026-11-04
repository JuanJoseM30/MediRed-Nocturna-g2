// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio) — versión MySQL
// Única capa que sabe DÓNDE se guardan los datos.
// Las funciones conservan el mismo nombre, parámetros y resultado que la
// versión en memoria: por eso el servicio y el controlador no cambian.
// =====================================================================
const pool = require('../db');

// Filtro: ?paciente_id=1 → WHERE paciente_id = 1
async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM historias';
  const condiciones = [];
  const valores = [];
  if (filtros.paciente_id) {
    condiciones.push('paciente_id = ?');
    valores.push(filtros.paciente_id);
  }
  if (condiciones.length > 0) sql += ' WHERE ' + condiciones.join(' AND ');
  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas;
}

async function findById(id) {
  // ? es un parámetro: el valor viaja aparte de la consulta (evita inyección SQL)
  const [filas] = await pool.query('SELECT * FROM historias WHERE id = ?', [id]);
  return filas.length > 0 ? filas[0] : null;
}

async function create(historia) {
  const [resultado] = await pool.query(
    'INSERT INTO historias (paciente_id, medico_id, fecha, motivo_consulta, diagnostico, tratamiento) VALUES (?, ?, ?, ?, ?, ?)',
    [historia.paciente_id, historia.medico_id, historia.fecha,
      historia.motivo_consulta, historia.diagnostico, historia.tratamiento]);
  return findById(resultado.insertId);     // MySQL devuelve el id generado
}

async function update(id, historia) {
  const [resultado] = await pool.query(
    'UPDATE historias SET paciente_id = ?, medico_id = ?, fecha = ?, motivo_consulta = ?, diagnostico = ?, tratamiento = ? WHERE id = ?',
    [historia.paciente_id, historia.medico_id, historia.fecha,
      historia.motivo_consulta, historia.diagnostico, historia.tratamiento, id]);
  if (resultado.affectedRows === 0) return null;   // no existía
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM historias WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
