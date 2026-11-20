# Frontend · MediRed

Inicio de sesión y pantallas de MediRed, conectadas a los microservicios a traves del API Gateway (Apache).
HTML, CSS y JavaScript, sin framework. Basado en el frontend de usuarios de la docente.

## Cómo probarlo

1. El ambiente encendido: en `D:\MediRed-M2`, `vagrant up`. Los microservicios y Apache arrancan solos.
2. Abrir **http://app.medired.com** en el navegador (con `http://`).
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

Todas las rutas van por el gateway con el prefijo `/api` (por ejemplo `GET /api/pacientes`); el número entre paréntesis es el puerto interno del microservicio.

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


## Publicación (Taller 3)

En `js/config.js` todas las direcciones de `SERVICIOS` son `'/api'`: el frontend y la API se sirven
desde el mismo nombre (`app.medired.com`), así que CORS ya no hace falta. Para publicar un cambio en servidor2:

    cd /srv/medired/app && git pull
    sudo cp -r /srv/medired/app/frontend/* /var/www/app/
