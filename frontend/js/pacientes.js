// =====================================================================
// PANTALLA DE PACIENTES (ms-pacientes, puerto 3002)
// Consultar: cualquier rol. Crear, editar y eliminar: solo administrador
// (ms-pacientes responde 403 a los demás roles).
// Usa: GET /pacientes, GET /pacientes?eps=…, POST /pacientes,
//      PUT /pacientes/:id, DELETE /pacientes/:id
// =====================================================================
const yo = exigirSesion();
const esAdmin = yo && yo.rol === 'administrador';
let pacientes = [];

const camposPaciente = [
  { nombre: 'nombre', etiqueta: 'Nombre' },
  { nombre: 'documento', etiqueta: 'Documento', tipo: 'number' },
  { nombre: 'fecha_nacimiento', etiqueta: 'Fecha de nacimiento', tipo: 'date' },
  { nombre: 'eps', etiqueta: 'EPS', tipo: 'select',
    opciones: EPS.map((eps) => ({ valor: eps, texto: eps })) },
  { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'number' },
];

// El formulario entrega texto; la API espera documento y teléfono como números
const aCuerpo = (datos) => ({
  ...datos,
  documento: Number(datos.documento),
  telefono: Number(datos.telefono),
});

function pintar() {
  const eps = document.getElementById('filtro-eps').value;
  document.getElementById('resumen').textContent =
    `${pacientes.length} ${pacientes.length === 1 ? 'paciente' : 'pacientes'}${eps ? ` de ${eps}` : ''}`;

  if (pacientes.length === 0) {
    document.getElementById('lista').innerHTML =
      '<tr><td colspan="7" class="vacio">No hay pacientes para mostrar.</td></tr>';
    return;
  }
  document.getElementById('lista').innerHTML = pacientes.map((p) => `
    <tr>
      <td>${esc(p.nombre)}</td>
      <td>${esc(p.documento)}</td>
      <td>${esc(p.fecha_nacimiento)}</td>
      <td><span class="etiqueta-rol">${esc(p.eps)}</span></td>
      <td>${esc(p.telefono)}</td>
      <td>${p.activo ? 'Activo' : '<span class="sub">Inactivo</span>'}</td>
      <td class="acciones">
        ${esAdmin ? `
          <button class="boton boton-suave" data-editar="${p.id}">Editar</button>
          <button class="boton boton-peligro" data-eliminar="${p.id}">Eliminar</button>` : ''}
      </td>
    </tr>`).join('');
}

async function cargar() {
  const eps = document.getElementById('filtro-eps').value;
  const ruta = eps ? `/pacientes?eps=${encodeURIComponent(eps)}` : '/pacientes';
  try {
    pacientes = await api(ruta);
    if (pacientes) pintar();
  } catch (error) {
    document.getElementById('resumen').textContent = 'No se pudo cargar la lista de pacientes.';
    mostrarError(error);
  }
}

async function crear() {
  const datos = await pedirDatos('Crear paciente', camposPaciente, { eps: EPS[0] }, 'Crear paciente');
  if (!datos) return;
  try {
    await api('/pacientes', { method: 'POST', body: aCuerpo(datos) });
    mostrarMensaje(`Paciente creado: ${datos.nombre}`);
    cargar();
  } catch (error) { mostrarError(error); }
}

async function editar(p) {
  const datos = await pedirDatos('Editar paciente', camposPaciente, p);
  if (!datos) return;
  try {
    await api(`/pacientes/${p.id}`, { method: 'PUT', body: aCuerpo(datos) });
    mostrarMensaje('Cambios guardados');
    cargar();
  } catch (error) { mostrarError(error); }
}

async function eliminar(p) {
  if (!(await confirmar(`¿Eliminar a ${p.nombre}?`, 'Eliminar paciente'))) return;
  try {
    await api(`/pacientes/${p.id}`, { method: 'DELETE' });
    mostrarMensaje(`Paciente eliminado: ${p.nombre}`);
    cargar();
  } catch (error) { mostrarError(error); }
}

if (yo) {
  pintarEncabezado(yo);

  // Filtro por EPS: "Todas" o una de las EPS de config.js
  const filtro = document.getElementById('filtro-eps');
  filtro.innerHTML = '<option value="">Todas las EPS</option>' +
    EPS.map((eps) => `<option value="${esc(eps)}">${esc(eps)}</option>`).join('');
  filtro.onchange = cargar;

  // Solo el administrador ve el botón de crear y las acciones de cada fila
  document.getElementById('nuevo').hidden = !esAdmin;
  document.getElementById('nota-rol').hidden = esAdmin;
  document.getElementById('nuevo').onclick = crear;
  document.getElementById('lista').onclick = (evento) => {
    const { editar: idEditar, eliminar: idEliminar } = evento.target.dataset;
    const p = pacientes.find((x) => x.id === Number(idEditar || idEliminar));
    if (p && idEditar) editar(p);
    if (p && idEliminar) eliminar(p);
  };
  cargar();
}
