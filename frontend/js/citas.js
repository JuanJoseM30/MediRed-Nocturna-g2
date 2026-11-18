// =====================================================================
// PANTALLA DE CITAS (ms-citas, puerto 3004)
// Consultar: cualquier rol. Agendar, editar y eliminar: administrador y
// admisiones (ms-citas responde 403 a los demás roles).
// Cada cita llega COMPUESTA por ms-citas: con su objeto paciente y médico.
// Usa: GET /citas, GET /citas?estado=…, POST /citas,
//      PUT /citas/:id, DELETE /citas/:id
//      y GET /pacientes, GET /medicos para llenar el formulario
// =====================================================================
const yo = exigirSesion();
const puedeEditar = yo && ['administrador', 'admisiones'].includes(yo.rol);
let citas = [];
let estadoFiltro = '';

const camposCita = (opciones) => [
  { nombre: 'paciente_id', etiqueta: 'Paciente', tipo: 'select', opciones: opciones.pacientes },
  { nombre: 'medico_id', etiqueta: 'Médico', tipo: 'select', opciones: opciones.medicos },
  { nombre: 'fecha_hora', etiqueta: 'Fecha y hora', tipo: 'datetime-local' },
  { nombre: 'sede', etiqueta: 'Sede', tipo: 'select',
    opciones: SEDES.map((sede) => ({ valor: sede, texto: sede })) },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'select',
    opciones: ESTADOS_CITA.map((e) => ({ valor: e, texto: e })) },
];

// El formulario entrega texto; la API espera los ids como números
const aCuerpo = (datos) => ({
  ...datos,
  paciente_id: Number(datos.paciente_id),
  medico_id: Number(datos.medico_id),
});

function pintar() {
  document.getElementById('resumen').textContent =
    `${citas.length} ${citas.length === 1 ? 'cita' : 'citas'}${estadoFiltro ? ` en estado ${estadoFiltro}` : ''}`;
  pintarAvisos(citas);

  if (citas.length === 0) {
    document.getElementById('lista').innerHTML =
      '<tr><td colspan="6" class="vacio">No hay citas para mostrar.</td></tr>';
    return;
  }
  document.getElementById('lista').innerHTML = citas.map((c) => `
    <tr>
      <td>${celdaRelacion(c.paciente, c.paciente_id, 'Paciente', 'documento')}</td>
      <td>${celdaRelacion(c.medico, c.medico_id, 'Médico', 'especialidad')}</td>
      <td class="fecha">${esc(String(c.fecha_hora).replace('T', ' '))}</td>
      <td>${esc(c.sede)}</td>
      <td><span class="sello sello-${esc(c.estado)}">${esc(c.estado)}</span></td>
      <td class="acciones">
        ${puedeEditar ? `
          <button class="boton boton-suave" data-editar="${c.id}">Editar</button>
          <button class="boton boton-peligro" data-eliminar="${c.id}">Eliminar</button>` : ''}
      </td>
    </tr>`).join('');
}

async function cargar() {
  const ruta = estadoFiltro ? `/citas?estado=${encodeURIComponent(estadoFiltro)}` : '/citas';
  try {
    citas = await api(ruta);
    if (citas) pintar();
  } catch (error) {
    document.getElementById('resumen').textContent = 'No se pudo cargar la lista de citas.';
    mostrarError(error);
  }
}

async function crear() {
  try {
    const opciones = await opcionesPacientesYMedicos();
    const datos = await pedirDatos('Agendar cita', camposCita(opciones),
      { sede: SEDES[0], estado: 'programada' }, 'Agendar cita');
    if (!datos) return;
    await api('/citas', { method: 'POST', body: aCuerpo(datos) });
    mostrarMensaje('Cita agendada');
    cargar();
  } catch (error) { mostrarError(error); }
}

async function editar(c) {
  try {
    const opciones = await opcionesPacientesYMedicos();
    const datos = await pedirDatos('Editar cita', camposCita(opciones), c);
    if (!datos) return;
    await api(`/citas/${c.id}`, { method: 'PUT', body: aCuerpo(datos) });
    mostrarMensaje('Cambios guardados');
    cargar();
  } catch (error) { mostrarError(error); }
}

async function eliminar(c) {
  const quien = c.paciente ? c.paciente.nombre : `paciente #${c.paciente_id}`;
  if (!(await confirmar(`¿Eliminar la cita de ${quien}?`, 'Eliminar cita'))) return;
  try {
    await api(`/citas/${c.id}`, { method: 'DELETE' });
    mostrarMensaje('Cita eliminada');
    cargar();
  } catch (error) { mostrarError(error); }
}

if (yo) {
  pintarEncabezado(yo);

  // Filtro por estado: Todas · programada · atendida · cancelada
  const filtro = document.getElementById('filtro-estado');
  filtro.innerHTML = ['', ...ESTADOS_CITA].map((e) =>
    `<button type="button" data-estado="${e}" aria-pressed="${e === ''}">${e || 'Todas'}</button>`).join('');
  filtro.onclick = (evento) => {
    if (evento.target.dataset.estado === undefined) return;
    estadoFiltro = evento.target.dataset.estado;
    filtro.querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.estado === estadoFiltro)));
    cargar();
  };

  document.getElementById('nuevo').hidden = !puedeEditar;
  document.getElementById('nota-rol').hidden = puedeEditar;
  document.getElementById('nuevo').onclick = crear;
  document.getElementById('lista').onclick = (evento) => {
    const { editar: idEditar, eliminar: idEliminar } = evento.target.dataset;
    const c = citas.find((x) => x.id === Number(idEditar || idEliminar));
    if (c && idEditar) editar(c);
    if (c && idEliminar) eliminar(c);
  };
  cargar();
}
