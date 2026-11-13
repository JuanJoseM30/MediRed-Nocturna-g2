// =====================================================================
// PANTALLA DE MÉDICOS (ms-medicos, puerto 3003)
// Consultar: cualquier rol. Crear, editar y eliminar: solo administrador
// (ms-medicos responde 403 a los demás roles).
// Usa: GET /medicos, GET /medicos?especialidad=…, POST /medicos,
//      PUT /medicos/:id, DELETE /medicos/:id
// =====================================================================
const yo = exigirSesion();
const puedeEditar = yo && yo.rol === 'administrador';
let medicos = [];

const camposMedico = [
  { nombre: 'nombre', etiqueta: 'Nombre' },
  { nombre: 'registro_medico', etiqueta: 'Registro médico', ayuda: 'Ej. RM-1004' },
  { nombre: 'especialidad', etiqueta: 'Especialidad' },
  { nombre: 'sede', etiqueta: 'Sede', tipo: 'select',
    opciones: SEDES.map((sede) => ({ valor: sede, texto: sede })) },
];

function pintar() {
  const especialidad = document.getElementById('filtro-especialidad').value.trim();
  document.getElementById('resumen').textContent =
    `${medicos.length} ${medicos.length === 1 ? 'médico' : 'médicos'}${especialidad ? ` de ${especialidad}` : ''}`;

  if (medicos.length === 0) {
    document.getElementById('lista').innerHTML =
      '<tr><td colspan="5" class="vacio">No hay médicos para mostrar.</td></tr>';
    return;
  }
  document.getElementById('lista').innerHTML = medicos.map((m) => `
    <tr>
      <td>${esc(m.nombre)}</td>
      <td>${esc(m.registro_medico)}</td>
      <td>${esc(m.especialidad)}</td>
      <td><span class="etiqueta-rol">${esc(m.sede)}</span></td>
      <td class="acciones">
        ${puedeEditar ? `
          <button class="boton boton-suave" data-editar="${m.id}">Editar</button>
          <button class="boton boton-peligro" data-eliminar="${m.id}">Eliminar</button>` : ''}
      </td>
    </tr>`).join('');
}

async function cargar() {
  const especialidad = document.getElementById('filtro-especialidad').value.trim();
  const ruta = especialidad ? `/medicos?especialidad=${encodeURIComponent(especialidad)}` : '/medicos';
  try {
    medicos = await api(ruta);
    if (medicos) pintar();
  } catch (error) {
    document.getElementById('resumen').textContent = 'No se pudo cargar la lista de médicos.';
    mostrarError(error);
  }
}

async function crear() {
  const datos = await pedirDatos('Crear médico', camposMedico, { sede: SEDES[0] }, 'Crear médico');
  if (!datos) return;
  try {
    await api('/medicos', { method: 'POST', body: datos });
    mostrarMensaje(`Médico creado: ${datos.nombre}`);
    cargar();
  } catch (error) { mostrarError(error); }
}

async function editar(m) {
  const datos = await pedirDatos('Editar médico', camposMedico, m);
  if (!datos) return;
  try {
    await api(`/medicos/${m.id}`, { method: 'PUT', body: datos });
    mostrarMensaje('Cambios guardados');
    cargar();
  } catch (error) { mostrarError(error); }
}

async function eliminar(m) {
  if (!(await confirmar(`¿Eliminar a ${m.nombre}?`, 'Eliminar médico'))) return;
  try {
    await api(`/medicos/${m.id}`, { method: 'DELETE' });
    mostrarMensaje(`Médico eliminado: ${m.nombre}`);
    cargar();
  } catch (error) { mostrarError(error); }
}

if (yo) {
  pintarEncabezado(yo);

  // Filtro por especialidad: se aplica al presionar Enter o al borrar el texto
  document.getElementById('filtro-especialidad').onchange = cargar;

  document.getElementById('nuevo').hidden = !puedeEditar;
  document.getElementById('nota-rol').hidden = puedeEditar;
  document.getElementById('nuevo').onclick = crear;
  document.getElementById('lista').onclick = (evento) => {
    const { editar: idEditar, eliminar: idEliminar } = evento.target.dataset;
    const m = medicos.find((x) => x.id === Number(idEditar || idEliminar));
    if (m && idEditar) editar(m);
    if (m && idEliminar) eliminar(m);
  };
  cargar();
}
