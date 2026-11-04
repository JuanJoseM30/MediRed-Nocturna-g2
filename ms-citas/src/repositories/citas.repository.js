// src/repositories/citas.repository.js — versión MySQL
const pool = require('../db');

async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM citas';
  const condiciones = [];
  const valores = [];

  if (filtros.estado) {
    condiciones.push('estado = ?');
    valores.push(filtros.estado);
  }

  if (filtros.sede) {
    condiciones.push('LOWER(sede) = LOWER(?)');
    valores.push(filtros.sede);
  }

  if (filtros.ids && filtros.ids.length > 0) {
    condiciones.push('id IN (?)');
    valores.push(filtros.ids); // mysql2 maneja el arreglo [1, 2] directamente para IN (?)
  }

  if (condiciones.length > 0) {
    sql += ' WHERE ' + condiciones.join(' AND ');
  }

  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
  return filas.length > 0 ? filas[0] : null;
}

async function findByMedicoYFechaHora(medico_id, fecha_hora) {
  const [filas] = await pool.query(
    'SELECT * FROM citas WHERE medico_id = ? AND fecha_hora = ? AND estado != ?',
    [medico_id, fecha_hora, 'cancelada']
  );
  return filas.length > 0 ? filas[0] : null;
}

async function create(cita) {
  const [resultado] = await pool.query(
    'INSERT INTO citas (paciente_id, medico_id, fecha_hora, sede, estado) VALUES (?, ?, ?, ?, ?)',
    [cita.paciente_id, cita.medico_id, cita.fecha_hora, cita.sede, cita.estado]
  );
  return findById(resultado.insertId);
}

async function update(id, cita) {
  const [resultado] = await pool.query(
    'UPDATE citas SET paciente_id = ?, medico_id = ?, fecha_hora = ?, sede = ?, estado = ? WHERE id = ?',
    [cita.paciente_id, cita.medico_id, cita.fecha_hora, cita.sede, cita.estado, id]
  );
  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM citas WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, findByMedicoYFechaHora, create, update, remove};