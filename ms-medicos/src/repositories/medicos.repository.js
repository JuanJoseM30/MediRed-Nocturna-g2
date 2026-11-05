// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos.
// Versión del Taller 1: datos en memoria (se pierden al reiniciar).
// En el Taller 2 se reemplaza por MySQL SIN tocar las otras capas.
// Todas las funciones son async (devuelven promesas) para que el cambio
// a una base de datos real no obligue a modificar la capa de servicio.
// =====================================================================
// Capa de acceso a datos: todas las consultas usan MariaDB.
const pool = require('../db');

const COLUMNAS = 'id, nombre, registro_medico, especialidad, sede';

async function findAll({ especialidad, ids } = {}) {
  let sql = `SELECT ${COLUMNAS} FROM medicos`;
  const condiciones = [];
  const parametros = [];

  if (especialidad) {
    condiciones.push('especialidad = ?');
    parametros.push(especialidad);
  }

  if (ids) {
    if (ids.length === 0) return [];
    condiciones.push(`id IN (${ids.map(() => '?').join(', ')})`);
    parametros.push(...ids);
  }

  if (condiciones.length > 0) {
    sql += ` WHERE ${condiciones.join(' AND ')}`;
  }
  sql += ' ORDER BY id';

  const [filas] = await pool.execute(sql, parametros);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.execute(
    `SELECT ${COLUMNAS} FROM medicos WHERE id = ? LIMIT 1`,
    [id]
  );
  return filas[0] || null;
}

async function findByRegistroMedico(registro_medico) {
  const [filas] = await pool.execute(
    `SELECT ${COLUMNAS} FROM medicos WHERE registro_medico = ? LIMIT 1`,
    [registro_medico]
  );
  return filas[0] || null;
}

async function create(medico) {
  const [resultado] = await pool.execute(
    `INSERT INTO medicos (nombre, registro_medico, especialidad, sede)
     VALUES (?, ?, ?, ?)`,
    [medico.nombre, medico.registro_medico, medico.especialidad, medico.sede]
  );
  return findById(resultado.insertId);
}

async function update(id, medico) {
  if (!(await findById(id))) return null;

  await pool.execute(
    `UPDATE medicos
     SET nombre = ?, registro_medico = ?, especialidad = ?, sede = ?
     WHERE id = ?`,
    [medico.nombre, medico.registro_medico, medico.especialidad, medico.sede, id]
  );
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.execute(
    'DELETE FROM medicos WHERE id = ?',
    [id]
  );
  return resultado.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByRegistroMedico,
  create,
  update,
  remove,
};