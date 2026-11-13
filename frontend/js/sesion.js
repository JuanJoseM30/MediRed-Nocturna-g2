// =====================================================================
// SESIÓN: inicio de sesión, usuario actual y cierre de sesión.
// El token y el usuario se guardan en sessionStorage: se borran al
// cerrar la pestaña.
// =====================================================================
function usuarioActual() {
  try {
    return JSON.parse(sessionStorage.getItem('usuario'));
  } catch (error) {
    return null;
  }
}

async function iniciarSesion(email, password) {
  const { token, usuario } = await api('/usuarios/login', {
    method: 'POST',
    body: { email, password },
  });
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('usuario', JSON.stringify(usuario));   // nombre y rol
  location.href = PAGINA_POR_ROL[usuario.rol];
}

function cerrarSesion() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  location.href = 'login.html';
}

// Cada página llama a esto al cargar: sin sesión → login.
// Si se indican roles y el usuario no tiene uno de ellos → su propia página.
function exigirSesion(...roles) {
  const usuario = usuarioActual();
  if (!usuario) {
    location.href = 'login.html';
    return null;
  }
  if (roles.length && !roles.includes(usuario.rol)) {
    location.href = PAGINA_POR_ROL[usuario.rol];
    return null;
  }
  return usuario;
}

// Encabezado común: nombre, rol, menú del rol y botón de cerrar sesión
function pintarEncabezado(usuario) {
  document.getElementById('nombre-usuario').textContent = usuario.nombre;
  document.getElementById('rol-usuario').textContent = usuario.rol;
  document.getElementById('cerrar-sesion').onclick = cerrarSesion;

  // Menú: solo las páginas que el rol puede ver (MENU en config.js)
  const actual = location.pathname.split('/').pop();
  document.getElementById('menu').innerHTML = MENU
    .filter((m) => m.roles.includes(usuario.rol))
    .map((m) => `<a href="${m.pagina}"${m.pagina === actual ? ' aria-current="page"' : ''}>${m.texto}</a>`)
    .join('');
}
