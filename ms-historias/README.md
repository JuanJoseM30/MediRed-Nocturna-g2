# ms-historias · Taller 1 (Módulo 3)

Redes y Servicios Multimedia · UAO · Microservicio de **historias clínicas** (registros de atención)
de MediRed IPS, con **Node.js + Express** organizado en capas.

Responsable: Juan Felipe Vega Reyes · Puerto: **3005**


## Cómo ejecutarlo

Requisitos: Node.js LTS 22 o superior (`node -v`).

```
npm install                 # descarga Express en node_modules
copy .env.example .env      # en Windows (en Linux/Mac: cp .env.example .env)
npm run dev                 # inicia y se reinicia solo al guardar cambios
```

Prueben en el navegador: http://localhost:3005/health y http://localhost:3005/historias

## Capas

| Archivo | Capa | Responsabilidad |
|---|---|---|
| src/index.js | Arranque | Lee PORT y HOST y pone el servidor a escuchar |
| src/app.js | Configuración | Middlewares, /health, montaje de rutas, manejo de errores |
| src/routes/historias.routes.js | Presentación | Método HTTP + URI → función del controlador |
| src/controllers/historias.controller.js | Presentación | Lee la petición, llama al servicio, arma la respuesta |
| src/services/historias.service.js | Lógica de negocio | Validaciones y reglas (fecha no futura); no conoce HTTP ni la base de datos |
| src/repositories/historias.repository.js | Acceso a datos | Guarda y consulta (en memoria en el Taller 1) |
| src/models/historia.js | Modelo | Atributos de la entidad y su validación |
| src/utils/http-error.js | Utilidad | Error con código de estado HTTP |

## Endpoints (Taller 1)

| Método | URI | Respuesta |
|---|---|---|
| GET | /health | 200 `{"servicio":"ms-historias","estado":"ok"}` |
| GET | /historias | 200 arreglo de historias |
| GET | /historias/:id | 200 historia · 400 id inválido · 404 no existe |
| POST | /historias | 201 historia creada · 400 datos inválidos o fecha futura |

Ejemplo de cuerpo para POST:
`{"paciente_id": 3, "medico_id": 2, "fecha": "2026-10-27", "motivo_consulta": "Dolor abdominal", "diagnostico": "Gastritis", "tratamiento": "Omeprazol 20 mg en ayunas"}`

## Relaciones

`paciente_id` y `medico_id` son referencias (ids) a **ms-pacientes** y **ms-medicos**. En el Taller 1 solo se
guardan; en el Taller 3 se validan al crear y la respuesta trae `paciente: {id, nombre}` y
`medico: {id, nombre, especialidad}`.
