const HttpError = require('../utils/http-error');
const MEDICOS_URL = process.env.MEDICOS_URL || 'http://127.0.0.1:3003';

async function pedir(path, token) {
  try {
    const res = await fetch(`${MEDICOS_URL}${path}`, {
      headers: { Authorization: token || '' }
    });
    return res;
  } catch (error) {
    return null; // Servicio ms-medicos caído
  }
}

async function existeMedico(id, token) {
  const res = await pedir(`/medicos/${id}`, token);
  if (!res) throw new HttpError(503, `ms-medicos no disponible`);
  return res.ok;
}

async function medicosPorIds(ids, token) {
  if (!ids || ids.length === 0) return new Map();
  const res = await pedir(`/medicos?ids=${ids.join(',')}`, token);
  if (!res || !res.ok) return null; // Degradación controlada

  const medicos = await res.json();
  return new Map(medicos.map((m) => [
    m.id, 
    { id: m.id, nombre: m.nombre, especialidad: m.especialidad }
  ]));
}

module.exports = { existeMedico, medicosPorIds };