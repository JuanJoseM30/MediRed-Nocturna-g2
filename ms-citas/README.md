# ms-citas · Taller 2 (Completo)

Redes y Servicios Multimedia · UAO · Microservicio de **citas médicas** de la aplicación **MediRed IPS**, organizado bajo **Clean Architecture** (Arquitectura Limpia).

**Responsable:** Santiago Garzón  
**Puerto predeterminado:** 3004  
**Entidad gestionada:** Citas Médicas  

Esta versión completa del Taller 2 incluye la persistencia en **MySQL (XAMPP)** mediante `mysql2/promise`, validación de integridad referencial y composición de datos por lotes (`?ids=`) consumiendo `ms-pacientes` y `ms-medicos`, autenticación sin estado mediante **JWT** con control de acceso basado en roles (**RBAC**), manejo de tolerancia a fallos (`503 Service Unavailable`) y la colección de **24 casos de prueba** en Postman.

---

## Cómo ejecutarlo

### Requisitos previos
1. Node.js LTS 22 o superior (`node -v`).
2. XAMPP Control Panel con el servicio de **MySQL** iniciado.
3. Tener en ejecución los microservicios de apoyo para autenticación y relaciones:
   - `ms-usuarios` en puerto **3001**
   - `ms-pacientes` en puerto **3002**
   - `ms-medicos` en puerto **3003**

### 1. Preparar la Base de Datos en MySQL (XAMPP)

Ejecuta las siguientes instrucciones en la consola (Shell de XAMPP o CMD) para crear la base de datos, el usuario y poblar la tabla inicial:

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS citas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'citas_user'@'localhost' IDENTIFIED BY 'una-clave-segura'; GRANT ALL PRIVILEGES ON citas_db.* TO 'citas_user'@'localhost'; FLUSH PRIVILEGES;"
mysql -u root citas_db < db/schema.sql
```

### 2. Configuración e Instalación del Microservicio

```bash
npm install                 # descarga Express, mysql2 y jsonwebtoken en node_modules
copy .env.example .env      # en Windows (en Linux/Mac: cp .env.example .env)
npm run dev                 # inicia el servidor en http://127.0.0.1:3004
```

**Variables de entorno requeridas (`.env`):**
```env
PORT=3004
HOST=127.0.0.1
DB_HOST=localhost
DB_PORT=3306
DB_USER=citas_user
DB_PASSWORD=una-clave-segura
DB_NAME=citas_db
PACIENTES_URL=http://localhost:3002/pacientes
MEDICOS_URL=http://localhost:3003/medicos
JWT_SECRET=Frase-de-prueba-no-real
```

Comprueba el estado del servicio en: `http://localhost:3004/health` (público, no exige token).

---

## Capas

| Archivo / Carpeta | Capa | Responsabilidad |
| :--- | :--- | :--- |
| `src/index.js` | Arranque | Lee `PORT` y `HOST` desde `.env` y levanta el servidor Express |
| `src/app.js` | Configuración | Middlewares (`express.json`, logger), `/health`, montaje de rutas y manejo global de errores |
| `src/db.js` | Conexión DB | Crea y exporta el pool de conexiones asíncronas con `mysql2/promise` |
| `src/middlewares/auth.js` | Seguridad | Valida el token JWT (`verificarToken` -> `401`) y restringe por rol (`requiereRol` -> `403`) |
| `src/routes/citas.routes.js` | Presentación | Asocia método HTTP + URI con middlewares de seguridad y controlador |
| `src/controllers/citas.controller.js` | Presentación | Extrae `params`, `query` y `body`, valida IDs enteros positivos y arma la respuesta HTTP |
| `src/services/citas.service.js` | Lógica de negocio | Orquesta clientes REST, aplica regla de horario único por médico (`409`) y compone respuestas |
| `src/clients/pacientes.client.js` | Integración REST | Consume `ms-pacientes` (`GET /:id` y `GET ?ids=`) reenviando el token `Authorization` |
| `src/clients/medicos.client.js` | Integración REST | Consume `ms-medicos` (`GET /:id` y `GET ?ids=`) reenviando el token `Authorization` |
| `src/repositories/citas.repository.js` | Acceso a datos | Consulta y persiste en `citas_db` mediante sentencias SQL parametrizadas |
| `src/models/cita.js` | Modelo | Define la estructura de la entidad cita y validaciones de campos obligatorios |
| `src/utils/http-error.js` | Utilidad | Clase de error personalizado con código de estado HTTP |
| `db/schema.sql` | Persistencia | DDL de creación de la tabla `citas` e inserciones iniciales de prueba |
| `docs/ms-citas.postman_collection.json` | Pruebas | Colección completa de 24 casos de prueba (CRUD, Seguridad y Relaciones) |

---

## Representación JSON

### Petición (`POST /citas` o `PUT /citas/:id`)
```json
{
  "paciente_id": 1,
  "medico_id": 1,
  "fecha_hora": "2026-11-20T09:00:00",
  "sede": "Cali"
}
```

### Respuesta Exitosa (`201 Created` — compuesta con datos de servicios externos)
```json
{
  "id": 1,
  "paciente_id": 1,
  "medico_id": 1,
  "fecha_hora": "2026-11-20T09:00:00",
  "sede": "Cali",
  "estado": "programada",
  "paciente": {
    "id": 1,
    "nombre": "Carlos Bacca",
    "documento": 1010
  },
  "medico": {
    "id": 1,
    "nombre": "Dra. Ana Gomez",
    "especialidad": "Medicina General"
  }
}
```

---

## Atributos del Recurso (Cita)

| Atributo | Tipo | Obligatorio | Reglas / Descripción |
| :--- | :--- | :--- | :--- |
| `id` | Entero | No | Autogenerado por MySQL (`AUTO_INCREMENT`) |
| `paciente_id` | Entero | Sí | Entero positivo. Debe existir en `ms-pacientes` (si no existe -> `400`) |
| `medico_id` | Entero | Sí | Entero positivo. Debe existir en `ms-medicos` (si no existe -> `400`) |
| `fecha_hora` | Texto | Sí | Fecha y hora en formato ISO (ej. `2026-11-03T08:00:00`). Un médico no puede tener dos citas activas a la misma hora (`409 Conflict`) |
| `sede` | Texto | Sí | Sede de atención (ej. `Cali`, `Bogotá`, `Medellín`) |
| `estado` | Texto | No | Estado de la cita: `programada` (por defecto), `atendida` o `cancelada` |

---

## Endpoints

| Operación | Método | URI | Cuerpo | Respuesta exitosa | Errores posibles |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Salud del servicio | `GET` | `/health` | — | `200` objeto estado | — (Público) |
| Listar citas | `GET` | `/citas` | — | `200` arreglo compuesto | `401` |
| Filtrar por estado | `GET` | `/citas?estado=programada` | — | `200` arreglo filtrado | `400` · `401` |
| Consultar por lotes | `GET` | `/citas?ids=1,2` | — | `200` arreglo compuesto | `400` · `401` |
| Obtener cita | `GET` | `/citas/:id` | — | `200` objeto compuesto | `400` · `401` · `404` |
| Agendar cita | `POST` | `/citas` | JSON sin `id` | `201` objeto + `Location` | `400` · `401` · `403` · `409` · `503` |
| Actualizar cita | `PUT` | `/citas/:id` | JSON completo | `200` objeto actualizado | `400` · `401` · `403` · `404` · `409` · `503` |
| Eliminar cita | `DELETE` | `/citas/:id` | — | `204` sin cuerpo | `400` · `401` · `403` · `404` |

---

## Seguridad (JWT y Control por Roles)

Todas las rutas bajo `/citas` exigen un token JWT válido en la cabecera `Authorization: Bearer <token>` emitido por `ms-usuarios` (`POST http://localhost:3001/usuarios/login`) y firmado con la clave compartida `JWT_SECRET`.

### Matriz de Permisos (RBAC)

| Operación | `administrador` | `admisiones` | `medico` | Sin token / Token inválido |
| :--- | :--- | :--- | :--- | :--- |
| **Consultar (`GET /citas`, `GET /citas/:id`)** | Permitido (`200`) | Permitido (`200`) | Permitido (`200`) | Denegado (`401`) |
| **Crear (`POST /citas`)** | Permitido (`201`) | Permitido (`201`) | Prohibido (`403`) | Denegado (`401`) |
| **Actualizar (`PUT /citas/:id`)** | Permitido (`200`) | Permitido (`200`) | Prohibido (`403`) | Denegado (`401`) |
| **Eliminar (`DELETE /citas/:id`)** | Permitido (`204`) | Permitido (`204`) | Prohibido (`403`) | Denegado (`401`) |

`GET /health` es público (no requiere token).

---

## Relaciones Inter-Microservicios

`ms-citas` actúa como un **microservicio consumidor / orquestador**: almacena las llaves lógicas `paciente_id` y `medico_id` y se comunica vía REST con los servicios maestros reenviando el token `Authorization` del usuario autenticado:

| Atributo | Microservicio consultado | Validación al escribir (`POST` / `PUT`) | Composición al leer (`GET`) | Campos consumidos |
| :--- | :--- | :--- | :--- | :--- |
| `paciente_id` | `ms-pacientes` (Puerto `3002`) | `GET /pacientes/:id` | `GET /pacientes?ids=...` | `id`, `nombre`, `documento` |
| `medico_id` | `ms-medicos` (Puerto `3003`) | `GET /medicos/:id` | `GET /medicos?ids=...` | `id`, `nombre`, `especialidad` |

### Manejo de errores y resiliencia
- **Referencia inexistente (`404` remoto):** Si `ms-pacientes` o `ms-medicos` indican que el ID no existe al crear o actualizar una cita, `ms-citas` rechaza la operación con **`400 Bad Request`**.
- **Servicio externo caído (`503`):** Si `ms-pacientes` o `ms-medicos` no responden durante la validación de escritura (`POST`/`PUT`), `ms-citas` retorna **`503 Service Unavailable`**.
- **Degradación controlada en lectura:** Si un microservicio remoto falla al listar citas (`GET /citas`), el listado continúa funcionando devolviendo la cita con el objeto relacionado en `null`.

---

## Pruebas

La colección completa se encuentra en `docs/ms-citas.postman_collection.json` e incluye **24 casos de prueba** organizados en:
- **Casos 1 – 13:** Operaciones CRUD, filtros, validación de IDs y regla de negocio de agenda única por médico (`409 Conflict`).
- **Casos 14 – 18:** Seguridad JWT y permisos por rol (`401` sin token / token alterado, `200` lectura con rol `medico`, `403` escritura con rol `medico`, `201` escritura con `admisiones`).
- **Casos 19 – 24:** Integración entre microservicios (validación cruzada de `paciente_id` y `medico_id`, error `400` con IDs inexistentes, composición por lotes `?ids=` y respuesta `503` al detener `ms-medicos`).