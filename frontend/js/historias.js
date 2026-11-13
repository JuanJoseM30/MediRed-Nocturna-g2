// =====================================================================
// PANTALLA DE HISTORIAS CLÍNICAS (ms-historias, puerto 3005)
// Consultar: cualquier rol. Registrar, editar y eliminar: administrador y
// médico (ms-historias responde 403 a los demás roles).
// Cada historia llega COMPUESTA por ms-historias: con su paciente y médico.
// Usa: GET /historias, GET /historias?paciente_id=…, POST /historias,
//      PUT /historias/:id, DELETE /historias/:id
//      y GET /pacientes, GET /medicos para el filtro y el formulario
// =====================================================================
const yo = exigirSesion();
const puedeEditar = yo && ['administrador', 'medico'].includes(yo.rol);
let historias = [];

const hoy = () => new Date().toLocaleDateString('en-CA');   // AAAA-MM-DD

const camposHistoria = (opciones) => [
  { nombre: 'paciente_id', etiqueta: 'Paciente', tipo: 'select', opciones: opciones.pacientes },
  { nombre: 'medico_id', etiqueta: 'Médico', tipo: 'select', opciones: opciones.medicos },
  { nombre: 'fecha', etiqueta: 'Fecha de la atención', tipo: 'date' },
  { nombre: 'motivo_consulta', etiqueta: 'Motivo de consulta' },
  { nombre: 'diagnostico', etiqueta: 'Diagnóstico' },
  { nombre: 'tratamiento', etiqueta: 'Tratamiento' },
];

// El formulario entrega texto; la API espera los ids como números
const aCuerpo = (datos) => ({
  ...datos,
  paciente_id: Number(datos.paciente_id),
  medico_id: Number(datos.medico_id),
});

function pintar() {
  const filtro = document.getElementById('filtro-paciente');
  const nombre = filtro.value ? filtro.options[filtro.selectedIndex].text : '';
  document.getElementById('resumen').textContent =
    `${historias.length} ${historias.length === 1 ? 'registro' : 'registros'}${nombre ? ` de ${nombre}` : ''}`;
  pintarAvisos(historias);

  if (historias.length === 0) {
    document.getElementById('lista').innerHTML =
      '<tr><td colspan="6" class="vacio">No hay historias clínicas para mostrar.</td></tr>';
    return;
  }
  document.getElementById('lista').innerHTML = historias.map((h) => `
    <tr>
      <td class="fecha">${esc(h.fecha)}</td>
      <td>${celdaRelacion(h.paciente, h.paciente_id, 'Paciente')}</td>
      <td>${celdaRelacion(h.medico, h.medico_id, 'Médico', 'especialidad')}</td>
      <td>${esc(h.motivo_consulta)}</td>
      <td>${esc(h.diagnostico)}<span class="sub">${esc(h.tratamiento)}</span></td>
      <td class="acciones">
        ${puedeEditar ? `
          <button class="boton boton-suave" data-editar="${h.id}">Editar</button>
          <button class="boton boton-peligro" data-eliminar="${h.id}">Eliminar</button>` : ''}
      </td>
    </tr>`).join('');
}

async function cargar() {
  const pacienteId = document.getElementById('filtro-paciente').value;
  const ruta = pacienteId ? `/historias?paciente_id=${pacienteId}` : '/historias';
  try {
    historias = await api(ruta);
    if (historias) pintar();
  } catch (error) {
    document.getElementById('resumen').textContent = 'No se pudo cargar la lista de historias clínicas.';
    mostrarError(error);
  }
}

// Llena el filtro con los pacientes de ms-pacientes
async function cargarFiltroPacientes() {
  try {
    const pacientes = await api('/pacientes');
    if (!pacientes) return;
    document.getElementById('filtro-paciente').innerHTML =
      '<option value="">Todos los pacientes</option>' +
      pacientes.map((p) => `<option value="${p.id}">${esc(p.nombre)}</option>`).join('');
  } catch (error) { mostrarError(error); }
}

async function crear() {
  try {
    const opciones = await opcionesPacientesYMedicos();
    const datos = await pedirDatos('Registrar atención', camposHistoria(opciones),
      { fecha: hoy(), paciente_id: document.getElementById('filtro-paciente').value }, 'Registrar');
    if (!datos) return;
    await api('/historias', { method: 'POST', body: aCuerpo(datos) });
    mostrarMensaje('Atención registrada');
    cargar();
  } catch (error) { mostrarError(error); }
}

async function editar(h) {
  try {
    const opciones = await opcionesPacientesYMedicos();
    const datos = await pedirDatos('Editar historia clínica', camposHistoria(opciones), h);
    if (!datos) return;
    await api(`/historias/${h.id}`, { method: 'PUT', body: aCuerpo(datos) });
    mostrarMensaje('Cambios guardados');
    cargar();
  } catch (error) { mostrarError(error); }
}

async function eliminar(h) {
  const quien = h.paciente ? h.paciente.nombre : `paciente #${h.paciente_id}`;
  if (!(await confirmar(`¿Eliminar el registro del ${h.fecha} de ${quien}?`, 'Eliminar registro'))) return;
  try {
    await api(`/historias/${h.id}`, { method: 'DELETE' });
    mostrarMensaje('Registro eliminado');
    cargar();
  } catch (error) { mostrarError(error); }
}

if (yo) {
  pintarEncabezado(yo);
  document.getElementById('filtro-paciente').onchange = cargar;

  document.getElementById('nuevo').hidden = !puedeEditar;
  document.getElementById('nota-rol').hidden = puedeEditar;
  document.getElementById('nuevo').onclick = crear;
  document.getElementById('lista').onclick = (evento) => {
    const { editar: idEditar, eliminar: idEliminar } = evento.target.dataset;
    const h = historias.find((x) => x.id === Number(idEditar || idEliminar));
    if (h && idEditar) editar(h);
    if (h && idEliminar) eliminar(h);
  };
  cargarFiltroPacientes();
  cargar();
}
