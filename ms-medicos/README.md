# ms-medicos — MediRed IPS

**Responsable:** Jhoan Esteban Burgos Guerrero  
**Módulo 3, Taller 2 — Semana 2**  
**Puerto:** 3003

API REST para administrar médicos de MediRed IPS. Está desarrollada con Node.js y Express, organizada en capas y guarda los datos en la base `medicos_db`. Otros microservicios pueden consultar varios médicos mediante `GET /medicos?ids=1,3`.

## Requisitos y puesta en marcha

- Node.js 22 o superior.
- MySQL o MariaDB disponible en el puerto 3306.
- Una base `medicos_db` y un usuario `medicos_user` con permisos sobre ella.

1. Crear la base y el usuario en el servidor de bases de datos.
2. Ejecutar `db/schema.sql` para crear la tabla y cargar tres médicos iniciales.
3. Copiar `.env.example` como `.env`. Escribir la contraseña real en
   `DB_PASSWORD` y poner en `JWT_SECRET` la misma clave privada configurada
   en `ms-usuarios`. El archivo `.env` está excluido de Git.
4. Desde la carpeta `ms-medicos`, ejecutar:

```powershell
npm.cmd install
npm.cmd run dev
```

El servicio queda disponible en `http://localhost:3003`. Para detenerlo, pulsar **Ctrl+C**.

## Modelo y reglas de negocio

| Atributo | Regla |
|---|---|
| `id` | Entero positivo generado por la base de datos |
| `nombre` | Texto obligatorio |
| `registro_medico` | Texto obligatorio y único; se guarda en mayúsculas |
| `especialidad` | Texto obligatorio |
| `sede` | Obligatoria; Bogotá, Cali o Medellín |

La base de datos también impone una restricción `UNIQUE` sobre `registro_medico`.

## Contrato de la API

Las peticiones con cuerpo usan `Content-Type: application/json`. Las respuestas son JSON, excepto `204 No Content`.

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/health` | `200`: estado del servicio |
| GET | `/medicos` | `200`: lista completa |
| GET | `/medicos?especialidad=Pediatría` | `200`: médicos de esa especialidad |
| GET | `/medicos?ids=1,3` | `200`: médicos cuyos IDs se solicitaron; `400` si la lista de IDs es inválida |
| GET | `/medicos/:id` | `200`: médico encontrado; `400`: ID inválido; `404`: no existe |
| POST | `/medicos` | `201`: creado, con encabezado `Location`; `400`: datos inválidos; `409`: registro repetido |
| PUT | `/medicos/:id` | `200`: actualizado; `400`: datos inválidos; `404`: no existe; `409`: registro repetido |
| DELETE | `/medicos/:id` | `204`: eliminado sin cuerpo; `400`: ID inválido; `404`: no existe |

`PUT` recibe el médico completo: `nombre`, `registro_medico`, `especialidad` y `sede`.

Ejemplo de cuerpo para POST o PUT:

```json
{
  "nombre": "Sofía Ramírez",
  "registro_medico": "RM-1004",
  "especialidad": "Neurología",
  "sede": "Bogotá"
}
```

Los errores incluyen `error`; los errores de validación también incluyen `detalles`:

```json
{
  "error": "Datos inválidos",
  "detalles": ["especialidad es obligatoria"]
}
```

## Organización en capas

| Archivo | Responsabilidad |
|---|---|
| `src/index.js` | Inicia el servidor |
| `src/app.js` | Configura Express, las rutas y el manejo de errores |
| `src/routes/medicos.routes.js` | Asocia métodos y rutas con el controlador |
| `src/controllers/medicos.controller.js` | Traduce peticiones y respuestas HTTP |
| `src/services/medicos.service.js` | Aplica las reglas de negocio |
| `src/models/medico.js` | Valida y construye los datos del médico |
| `src/repositories/medicos.repository.js` | Ejecuta consultas SQL parametrizadas |
| `src/db.js` | Configura el grupo de conexiones a la base |
| `db/schema.sql` | Define la tabla y los datos iniciales |

## Verificación en Postman

Se comprobaron listado, filtro por especialidad, consulta por varios IDs, consulta individual, creación, actualización y eliminación. También se verificaron las respuestas `400` por datos o ID inválidos, `404` por médico inexistente y `409` por registro repetido. Un médico creado permaneció disponible después de reiniciar Node.

## Seguridad y permisos

Las rutas `/medicos` requieren un token de `ms-usuarios` en la cabecera
`Authorization: Bearer <token>`. La variable `JWT_SECRET` del archivo
`.env` debe ser igual en ambos microservicios.

Cualquier usuario autenticado puede consultar médicos. Solo el rol
`administrador` puede crear, actualizar y eliminar. Un token ausente,
inválido o vencido recibe `401`; un rol sin permiso recibe `403`.

## Relaciones con otros microservicios

`ms-citas` y `ms-historias` guardan `medico_id` y consultan este servicio:

| Consulta | Uso |
|---|---|
| `GET /medicos/:id` | Verificar que un médico exista |
| `GET /medicos?ids=1,3` | Obtener varios médicos en una sola petición |

Ambas consultas requieren que esos microservicios reenvíen el token del
usuario. En las respuestas pueden usar `id`, `nombre` y `especialidad`
para mostrar los datos del médico.