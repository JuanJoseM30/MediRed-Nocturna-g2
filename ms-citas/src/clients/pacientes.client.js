const HttpError = require('../utils/http-error');
const PACIENTES_URL = process.env.PACIENTES_URL || 'http://127.0.0.1:3002';

async function pedir(path, token) {
  try {
    const res = await fetch(`${PACIENTES_URL}${path}`, {
      headers: { Authorization: token || '' }
    });
    return res;
  } catch (error) {
    return null; // Servicio ms-pacientes caído
  }
}

async function existePaciente(id, token) {
  const res = await pedir(`/pacientes/${id}`, token);
  if (!res) throw new HttpError(503, `ms-pacientes no disponible`);
  return res.ok;
}

async function pacientesPorIds(ids, token) {
  if (!ids || ids.length === 0) return new Map();
  const res = await pedir(`/pacientes?ids=${ids.join(',')}`, token);
  if (!res || !res.ok) return null; // Degradación controlada

  const pacientes = await res.json();
  return new Map(pacientes.map((p) => [
    p.id, 
    { id: p.id, nombre: p.nombre, documento: p.documento }
  ]));
}

module.exports = { existePaciente, pacientesPorIds };