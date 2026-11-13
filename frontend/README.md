# Frontend · MediRed

Inicio de sesión y pantallas de MediRed, conectadas directamente a cada microservicio.
HTML, CSS y JavaScript, sin framework. Basado en el frontend de usuarios de la docente.

## Cómo probarlo

1. Los microservicios corriendo (`npm run dev`), cada uno con CORS activo
   (`npm install cors` y `app.use(cors())` en `src/app.js`).
2. Doble clic en `login.html`.
3. Entrar con un usuario de ms-usuarios. Cada rol llega a su página:

| Rol | Página de inicio |
|---|---|
| administrador | Pacientes |
| medico | Historias clínicas |
| admisiones | Citas |

## Estructura

| Archivo | Qué hace |
|---|---|
| `login.html` | Inicio de sesión; lleva a cada usuario a la página de su rol |
| `pacientes.html` + `js/pacientes.js` | Pacientes: consultar (todos) · crear, editar, eliminar (administrador) |
| `medicos.html` + `js/medicos.js` | Médicos: consultar (todos) · crear, editar, eliminar (administrador) |
| `citas.html` + `js/citas.js` | Citas con su paciente y médico: consultar (todos) · agendar, editar, eliminar (administrador, admisiones) |
| `historias.html` + `js/historias.js` | Historias clínicas con su paciente y médico: consultar (todos) · registrar, editar, eliminar (administrador, médico) |
| `usuarios.html` + `js/usuarios.js` | Lista, crea, edita y elimina usuarios (solo administrador) |
| `perfil.html` + `js/perfil.js` | Los datos del usuario que inició sesión (`GET /usuarios/me`) |
| `js/config.js` | Dirección de cada microservicio, roles, página de inicio por rol, menú, EPS, sedes y estados de cita |
| `js/api.js` | Todas las llamadas a los microservicios, con el token |
| `js/sesion.js` | Login, usuario actual, menú, cierre de sesión y control de acceso |
| `js/ui.js` | Mensajes, formularios y ayudas para mostrar relaciones (paciente y médico) |
| `css/estilos.css` | Estilos |

`api('/pacientes')` llama a ms-pacientes, `api('/usuarios')` a ms-usuarios, etc.:
la primera parte de la ruta elige el microservicio según `SERVICIOS` en `js/config.js`.

## Peticiones que hace

| Pantalla | Acción | Petición |
|---|---|---|
| Login | Iniciar sesión | `POST /usuarios/login` (3001) |
| Pacientes | Listar / filtrar | `GET /pacientes` · `GET /pacientes?eps=…` (3002) |
| Pacientes | Crear / editar / eliminar | `POST /pacientes` · `PUT /pacientes/:id` · `DELETE /pacientes/:id` (3002) |
| Médicos | Listar / filtrar | `GET /medicos` · `GET /medicos?especialidad=…` (3003) |
| Médicos | Crear / editar / eliminar | `POST` · `PUT /medicos/:id` · `DELETE /medicos/:id` (3003) |
| Citas | Listar / filtrar por estado | `GET /citas` · `GET /citas?estado=…` (3004) |
| Citas | Agendar / editar / eliminar | `POST /citas` · `PUT /citas/:id` · `DELETE /citas/:id` (3004) |
| Historias | Listar / filtrar por paciente | `GET /historias` · `GET /historias?paciente_id=…` (3005) |
| Historias | Registrar / editar / eliminar | `POST /historias` · `PUT /historias/:id` · `DELETE /historias/:id` (3005) |
| Citas e historias | Elegir paciente y médico en el formulario | `GET /pacientes` (3002) · `GET /medicos` (3003) |
| Usuarios | Listar / crear / editar / eliminar | `/usuarios` (3001) |
| Mi perfil | Ver mis datos | `GET /usuarios/me` (3001) |

## Relaciones en pantalla

ms-citas y ms-historias devuelven cada registro **compuesto**, con su objeto `paciente` y `medico`.
La tabla muestra sus nombres. Si ms-pacientes o ms-medicos no responden, llegan como `null` con un
`aviso`: la tabla muestra el id ("Médico #2 (no disponible)") y el aviso arriba (degradación controlada).

## Cómo agregar una pantalla

1. Copiar `pacientes.html` y `js/pacientes.js` con el nombre de la entidad.
2. Cambiar columnas, campos y rutas.
3. Agregar la página en `MENU` de `js/config.js` con los roles que pueden verla.

## En el Taller 3

En `js/config.js`, las direcciones de `SERVICIOS` pasan a ser `'/api'`: el frontend y la API
quedan en la misma dirección a través del gateway, y CORS ya no hace falta.
