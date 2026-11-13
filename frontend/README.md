# Frontend · MediRed

Inicio de sesión y pantallas de MediRed, conectadas directamente a cada microservicio.
HTML, CSS y JavaScript, sin framework. Basado en el frontend de usuarios de la docente.

## Cómo probarlo

1. Los microservicios corriendo (`npm run dev`), cada uno con CORS activo
   (`npm install cors` y `app.use(cors())` en `src/app.js`).
2. Doble clic en `login.html`.
3. Entrar con `admin@empresa.com` / `Admin2026*` (o con el médico o admisiones).

## Estructura

| Archivo | Qué hace |
|---|---|
| `login.html` | Inicio de sesión; lleva a cada usuario a la página de su rol |
| `pacientes.html` + `js/pacientes.js` | Lista y filtra pacientes (todos los roles); crea, edita y elimina (solo administrador) |
| `usuarios.html` + `js/usuarios.js` | Lista, crea, edita y elimina usuarios (solo administrador) |
| `perfil.html` + `js/perfil.js` | Los datos del usuario que inició sesión (`GET /usuarios/me`) |
| `js/config.js` | Dirección de cada microservicio, roles, menú y EPS |
| `js/api.js` | Todas las llamadas a los microservicios, con el token |
| `js/sesion.js` | Login, usuario actual, menú, cierre de sesión y control de acceso |
| `js/ui.js` | Mensajes y formularios |
| `css/estilos.css` | Estilos |

`api('/pacientes')` llama a ms-pacientes, `api('/usuarios')` a ms-usuarios, etc.:
la primera parte de la ruta elige el microservicio según `SERVICIOS` en `js/config.js`.

## Peticiones que hace

| Pantalla | Acción | Petición |
|---|---|---|
| Login | Iniciar sesión | `POST /usuarios/login` (3001) |
| Pacientes | Listar / filtrar | `GET /pacientes` · `GET /pacientes?eps=…` (3002) |
| Pacientes | Crear / editar / eliminar | `POST /pacientes` · `PUT /pacientes/:id` · `DELETE /pacientes/:id` (3002) |
| Usuarios | Listar / crear / editar / eliminar | `/usuarios` (3001) |
| Mi perfil | Ver mis datos | `GET /usuarios/me` (3001) |

## Cómo agregar una pantalla (médicos, citas, historias)

1. Copiar `pacientes.html` y `js/pacientes.js` con el nombre de la entidad.
2. Cambiar columnas, campos y rutas (`/medicos`, `/citas`…).
3. Agregar la página en `MENU` de `js/config.js` con los roles que pueden verla.

## En el Taller 3

En `js/config.js`, las direcciones de `SERVICIOS` pasan a ser `'/api'`: el frontend y la API
quedan en la misma dirección a través del gateway, y CORS ya no hace falta.
