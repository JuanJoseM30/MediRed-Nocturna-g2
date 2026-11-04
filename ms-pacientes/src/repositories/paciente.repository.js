// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos.
// Versión adaptada a MySQL con mysql2/promise.
// =====================================================================

const pool = require('../db');

function aPaciente(fila) {
  return {...fila, activo: Boolean(fila.activo)};
}

async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM pacientes';
  const condiciones = [];
  const valores = [];

  if (filtros.eps) {
    condiciones.push('LOWER(eps) = ?');
    valores.push(String(filtros.eps).toLowerCase());
  }

  if (filtros.ids) {
    condiciones.push('id IN (?)');
    valores.push(filtros.ids);
  }

  if (condiciones.length > 0) sql += ' WHERE ' + condiciones.join(' AND ');

  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas.map(aPaciente);
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  return filas.length > 0 ? aPaciente(filas[0]) : null;
}

async function findByDocumento(documento) {
  const [filas] = await pool.query('SELECT * FROM pacientes WHERE documento = ?', [documento]);
  return filas.length > 0 ? aPaciente(filas[0]) : null;
}

async function create(paciente) {
  const [resultado] = await pool.query(
    'INSERT INTO pacientes (nombre, documento, fecha_nacimiento, eps, telefono) VALUES (?, ?, ?, ?, ?)',
    [paciente.nombre, paciente.documento, paciente.fecha_nacimiento, paciente.eps, paciente.telefono]
  );
  if (resultado.affectedRows === 0) return null;
  return findById(resultado.insertId);
}

async function update(id, paciente) {
  const [resultado] = await pool.query(
    'UPDATE pacientes SET nombre = ?, documento = ?, fecha_nacimiento = ?, eps = ?, telefono = ? WHERE id = ?',
    [paciente.nombre, paciente.documento, paciente.fecha_nacimiento, paciente.eps, paciente.telefono, id]
  );
  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM pacientes WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, findByDocumento, create, update, remove };