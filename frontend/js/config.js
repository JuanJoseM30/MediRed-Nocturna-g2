// =====================================================================
// CONFIGURACIÓN DEL FRONTEND · MediRed
// Dirección de cada microservicio. En el Taller 3, detrás del gateway,
// todas pasan a ser '/api' (misma dirección que el frontend) y CORS
// deja de hacer falta.
// =====================================================================
const SERVICIOS = {
  usuarios:  'http://localhost:3001',
  pacientes: 'http://localhost:3002',
  medicos:   'http://localhost:3003',
  citas:     'http://localhost:3004',
  historias: 'http://localhost:3005',
};

const ROLES = ['administrador', 'medico', 'admisiones'];

// Página de inicio de cada rol (a dónde lleva el login)
const PAGINA_POR_ROL = {
  administrador: 'pacientes.html',
  medico: 'pacientes.html',
  admisiones: 'pacientes.html',
};

// Menú superior: cada rol ve solo las páginas que tiene permitidas.
// Cada integrante agrega aquí la línea de su página (medicos.html, citas.html…).
const MENU = [
  { pagina: 'pacientes.html', texto: 'Pacientes', roles: ROLES },
  { pagina: 'usuarios.html',  texto: 'Usuarios',  roles: ['administrador'] },
  { pagina: 'perfil.html',    texto: 'Mi perfil', roles: ROLES },
];

// EPS que acepta ms-pacientes (las mismas de EPS en su .env)
const EPS = ['Sura', 'Colsanitas', 'Nueva EPS'];
