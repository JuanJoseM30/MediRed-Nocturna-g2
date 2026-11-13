// =====================================================================
// API: TODAS las llamadas a los microservicios pasan por aquí.
//   api('/pacientes')                                  → GET a ms-pacientes
//   api('/usuarios', { method: 'POST', body: {...} })  → POST a ms-usuarios
// La primera parte de la ruta (/usuarios, /pacientes, /medicos…) decide a
// qué microservicio se llama (ver SERVICIOS en config.js).
// Agrega el token, convierte la respuesta en JSON y, si hay error,
// lanza un ErrorApi con el código y el mensaje del microservicio.
// =====================================================================
class ErrorApi extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles || [];
  }
}

async function api(ruta, opciones = {}) {
  const servicio = ruta.split('/')[1].split('?')[0];   // '/pacientes?eps=Sura' → 'pacientes'
  const base = SERVICIOS[servicio];

  const token = sessionStorage.getItem('token');
  const cabeceras = { 'Content-Type': 'application/json' };
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      method: opciones.method || 'GET',
      headers: cabeceras,
      body: opciones.body ? JSON.stringify(opciones.body) : undefined,
    });
  } catch (error) {
    // No hubo respuesta: el microservicio está apagado o CORS no está activo
    throw new ErrorApi(0, `No hay conexión con ms-${servicio}. ¿Está corriendo en ${base}?`);
  }

  if (respuesta.status === 401 && ruta !== '/usuarios/login') {
    cerrarSesion();                    // sin sesión o token vencido: volver a entrar
    return null;
  }
  const datos = respuesta.status === 204 ? null : await respuesta.json();
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, datos.error, datos.detalles);
  return datos;
}
