# ms-citas · Taller 1 (Módulo 3)

Redes y Servicios Multimedia · UAO · Microservicio de **citas médicas** de la aplicación **MediRed IPS**,
con **Node.js + Express** organizado en capas.

Esta es la versión del Taller 1: datos en memoria y tres operaciones básicas (listar, obtener por id y crear). La versión completa (MySQL, integración con Apache API Gateway, autenticación JWT y validación REST de `paciente_id` y `medico_id`) se despliega en el Taller 3.

## Cómo ejecutarlo

Requisitos: Node.js LTS 22 o superior (`node -v`).

```
npm install                 # descarga Express en node_modules
copy .env.example .env      # en Windows (en Linux/Mac: cp .env.example .env)
npm run dev                 # inicia y se reinicia solo al guardar cambios
```

Prueben en el navegador: http://localhost:3004/health y http://localhost:3004/citas

## Capas

| Archivo | Capa | Responsabilidad |
|---|---|---|
| src/index.js | Arranque | Lee PORT y HOST y pone el servidor a escuchar |
| src/app.js | Configuración | Middlewares, /health, montaje de rutas, manejo de errores |
| src/routes/citas.routes.js | Presentación | Método HTTP + URI → función del controlador |
| src/controllers/citas.controller.js | Presentación | Lee la petición, llama al servicio, arma la respuesta |
| src/services/citas.service.js | Lógica de negocio | Validaciones y reglas (médico sin citas solapadas); no conoce HTTP ni la base de datos |
| src/repositories/citas.repository.js | Acceso a datos | Guarda y consulta (en memoria en el Taller 1) |
| src/models/cita.js | Modelo | Atributos de la entidad y su validación |
| src/utils/http-error.js | Utilidad | Error con código de estado HTTP |

## Endpoints (Taller 1)

| Método | URI | Respuesta |
|---|---|---|
| GET | /health | 200 `{"servicio":"ms-citas","estado":"ok"}` |
| GET | /citas | 200 arreglo de citas |
| GET | /citas/:id | 200 cita · 400 id inválido · 404 no existe |
| POST | /citas | 201 cita creada · 400 datos inválidos · 409 médico ocupado a esa hora |

Ejemplo de cuerpo para POST:
`{"paciente_id": 1, "medico_id": 2, "fecha_hora": "2026-11-10T10:30:00", "sede": "Cali"}`

Los roles válidos se configuran en el archivo .env (`ROLES=administrador,admisiones,medico`).
