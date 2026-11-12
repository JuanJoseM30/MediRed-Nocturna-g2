# ms-pacientes · Contrato de la API

## Descripción
* **Entidad que gestiona:** Pacientes del sistema MediRed.
* **Responsable:** Juan José Marín Orejuela (Código: 2235452).
* **Puerto en el que escucha:** 3002.

## Cómo ejecutarlo

1. Crear la base de datos y su usuario (en MySQL, como root):

```sql
CREATE DATABASE pacientes_db;
CREATE USER 'pacientes_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON pacientes_db.* TO 'pacientes_user'@'localhost';
USE pacientes_db;
SOURCE ruta/completa/ms-pacientes/db/schema.sql;
```

2. Instalar dependencias y configurar:

```
npm install
copy .env.example .env
```

En el `.env` ajustar `DB_PASSWORD` y poner la `JWT_SECRET` del grupo (la misma en todos los microservicios).

3. Arrancar:

```
npm run dev
```

## Representación

```json
{ "id": 1, "nombre": "Carlos Bacca", "documento": 1010, "fecha_nacimiento": "1990-10-15", "eps": "Nueva EPS", "telefono": 3001234567, "activo": true }
```

## Atributos

| Atributo | Tipo | Reglas y obligatoriedad |
|---|---|---|
| id | entero | No: lo asigna el servicio (positivo y único) |
| nombre | texto | Sí (no vacío) |
| documento | entero | Sí (numérico; único → 409) |
| fecha_nacimiento | texto (YYYY-MM-DD) | Sí (fecha válida y no futura) |
| eps | texto | Sí: una de las EPS definidas en `EPS` del `.env` (Sura, Colsanitas, Nueva EPS) |
| telefono | entero | Sí (numérico) |
| activo | booleano | No: lo asigna el servicio, por defecto `true` |

## Endpoints

| Operación | Método + URI | Respuesta y errores |
|---|---|---|
| Listar | GET `/pacientes` | 200 arreglo |
| Filtrar por EPS | GET `/pacientes?eps=Colsanitas` | 200 arreglo |
| Consultar por lotes | GET `/pacientes?ids=1,3` | 200 arreglo · 400 |
| Obtener | GET `/pacientes/:id` | 200 objeto · 400 · 404 |
| Crear | POST `/pacientes` | 201 objeto + Location · 400 · 409 |
| Actualizar | PUT `/pacientes/:id` | 200 objeto · 400 · 404 · 409 |
| Eliminar | DELETE `/pacientes/:id` | 204 · 400 · 404 |

Todos los endpoints pueden responder además **401** y **403** (ver Seguridad).

## Ejemplo para crear

```json
{ "nombre": "Laura Tula", "documento": 7070, "fecha_nacimiento": "2006-10-30", "eps": "Colsanitas", "telefono": 3001112233 }
```

## Seguridad

Todas las rutas de `/pacientes` exigen la cabecera `Authorization: Bearer <token>`.
El token se obtiene con el login de ms-usuarios (`POST http://localhost:3001/usuarios/login`)
y ms-pacientes lo verifica con la `JWT_SECRET` del `.env`, sin preguntarle a ms-usuarios.

| Operación | Roles permitidos |
|---|---|
| GET `/pacientes`, GET `/pacientes/:id` | administrador, medico, admisiones |
| POST, PUT, DELETE | solo administrador |

| Caso | Respuesta |
|---|---|
| Sin token, token alterado o vencido | 401 |
| Token válido pero con un rol sin permiso | 403 |

`GET /health` es público (no pide token).

## Relaciones

ms-pacientes es un microservicio **consultado**: no guarda referencias a otros
microservicios, pero otros guardan `paciente_id` y le preguntan por REST.

| Me consulta | Peticiones que me hace | Campos que no puedo cambiar sin avisar |
|---|---|---|
| ms-citas | `GET /pacientes/:id` · `GET /pacientes?ids=…` | id, nombre, documento |
| ms-historias | `GET /pacientes/:id` · `GET /pacientes?ids=…` | id, nombre, documento |

El microservicio que consulta reenvía el token del usuario en la cabecera `Authorization`.

## Pruebas

Colección de Postman en [`docs/ms-pacientes.postman_collection.json`](./docs/ms-pacientes.postman_collection.json):
2 logins (0a administrador, 0b médico) y 18 casos.

Antes de correrla: hacer el login 0a y 0b y guardar cada token en las variables
`token_admin` y `token_medico` de la colección (seleccionar el token → **Set as variable**).
En los casos 12 y 13 cambiar el id por el del paciente creado en el caso 7.