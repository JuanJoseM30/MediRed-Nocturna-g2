# ms-citas · Taller 2 (Semana 1)

Redes y Servicios Multimedia · UAO · Microservicio de **citas médicas** de la aplicación **MediRed IPS**, organizado bajo **Clean Architecture** (Arquitectura Limpia).

**Responsable:** Santiago Garzón  
**Puerto predeterminado:** 3004  
**Entidad gestionada:** Citas Médicas  

Esta versión incluye la implementación de la capa de persistencia mediante **MySQL (XAMPP)** con el conector `mysql2`, el CRUD completo en base de datos con consultas parametrizadas, filtrado avanzado, soporte de consulta por lotes (`?ids=`), y la suite de pruebas automatizadas exportada para Postman.

---

## Cómo ejecutarlo

### Requisitos previos
1. Node.js LTS 22 o superior (`node -v`).
2. XAMPP Control Panel con el servicio de **MySQL** iniciado.

### 1. Preparar la Base de Datos en MySQL (XAMPP)

Ejecuta las siguientes instrucciones en la consola (Shell de XAMPP o CMD) para crear la base de datos, el usuario y poblar la tabla inicial:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS citas_db; CREATE USER IF NOT EXISTS 'citas_user'@'localhost' IDENTIFIED BY 'citas123'; GRANT ALL PRIVILEGES ON citas_db.* TO 'citas_user'@'localhost'; FLUSH PRIVILEGES;"
mysql -u citas_user -pcitas123 citas_db < db/schema.sql
```

### 2. Configuración e Instalación del Microservicio

```
npm install                 # descarga Express y mysql2 en node_modules
copy .env.example .env      # en Windows (en Linux/Mac: cp .env.example .env)
npm run dev                 # inicia y se reinicia solo al guardar cambios
```

Prueben en el navegador: http://localhost:3004/health y http://localhost:3004/citas

## Capas

| Archivo / Carpeta | Capa | Responsabilidad |
|---|---|---|
| `src/index.js` | Arranque | Lee PORT y HOST desde .env y levanta el servidor Express |
| `src/app.js` | Configuración | Middlewares (JSON parser), /health, montaje de rutas y manejo de errores |
| `src/db.js` | Conexión DB | Crea y exporta el pool de conexiones asíncronas con mysql2/promise |
| `src/routes/citas.routes.js` | Presentación | Método HTTP + URI → función del controlador |
| `src/controllers/citas.controller.js` | Presentación | Lee la petición (params, body, query), llama al servicio y arma la respuesta |
| `src/services/citas.service.js` | Lógica de negocio | Validaciones y reglas (médico sin citas solapadas); lanza HttpError |
| `src/repositories/citas.repository.js` | Acceso a datos | Consulta y persiste mediante sentencias SQL parametrizadas en MySQL |
| `src/models/cita.js` | Modelo | Atributos de la entidad cita y su función de validación |
| `src/utils/http-error.js` | Utilidad | Error personalizado con código de estado HTTP |
| `db/schema.sql` | Persistencia | DDL de creación de la tabla citas e inserciones iniciales |
| `docs/ms-citas.postman_collection.json` | Pruebas | Colección de 13 casos de prueba exportados desde Postman |

## Atributos del Recurso (Cita)

| Atributo | Tipo | Obligatorio | Reglas / Descripción |
|---|---|---|---|
| `id` | Entero | No | Autogenerado por MySQL (Auto Increment) |
| `paciente_id` | Entero | Sí | Entero positivo. Referencia lógica a ms-pacientes |
| `medico_id` | Entero | Sí | Entero positivo. Referencia lógica a ms-medicos |
| `fecha_hora` | Texto | Sí | Cadena de texto en formato ISO (ej. 2026-11-03T08:00) |
| `sede` | Texto | Sí | Sede de la atención (ej. Cali, Bogotá, Medellín) |
| `estado` | Texto | No | Estado de la cita: programada (por defecto), atendida, cancelada |

## Endpoints (Taller 2)

| Método | URI | Estado HTTP | Descripción / Parámetros |
|---|---|---|---|
| GET | /health | 200 OK | Endpoint de salud para verificación del microservicio |
| GET | /citas | 200 OK | Lista todas las citas. Soporta filtros opcionales (?estado=programada, ?sede=Cali) |
| GET | /citas?ids=1,2 | 200 OK | Consulta por lotes recuperando las citas cuyos IDs coincidan con la lista expuesta |
| GET | /citas/:id | 200 OK / 400 / 404 | Consulta una cita por ID |
| POST | /citas | 201 Created / 400 / 409 | Crea una nueva cita. Valida requeridos y evita cruce de horario por médico (409 Conflict) |
| PUT | /citas/:id | 200 OK / 400 / 404 / 409 | Actualización completa de una cita existente |
| DELETE | /citas/:id | 204 No Content / 400 / 404 | Elimina una cita de la base de datos por su ID |

## Subsección de Relaciones Inter-Microservicios

### Como microservicio que consulta:

| Atributo | Microservicio consultado | Para validar (POST/PUT) | Para componer (GET) | Datos consumidos |
|---|---|---|---|---|
| `paciente_id` | ms-pacientes (Puerto 3002) | GET /pacientes/:id | GET /pacientes?ids=... | id, nombre, documento |
| `medico_id` | ms-medicos (Puerto 3003) | GET /medicos/:id | GET /medicos?ids=... | id, nombre, especialidad |

### Ejemplo de cuerpo para postman
`{"paciente_id": 1, "medico_id": 2, "fecha_hora": "2026-11-10T10:30:00", "sede": "Cali"}`

