# ms-pacientes · Taller 1 (Módulo 3)

Redes y Servicios Multimedia · UAO · Microservicio de **pacientes** de la aplicación,
organizado en arquitectura limpia por capas.

## Cómo ejecutarlo

Requisitos: Node.js LTS 22 o superior (`node -v`).

```bash
npm install               # descarga dependencias en node_modules
copy .env.example .env      # en Windows (en Linux/Mac: cp .env.example .env)
npm run dev               # inicia y se reinicia solo al guardar cambios
```

Prueben en el navegador: http://localhost:3002/health y http://localhost:3002/pacientes

## Capas

## Capas

| Archivo | Capa | Responsabilidad |
|---|---|---|
| src/index.js | Arranque | Lee PORT y HOST y pone el servidor a escuchar |
| src/app.js | Configuración | Middlewares, /health, montaje de rutas, manejo de errores |
| src/routes/paciente.routes.js | Presentación | Método HTTP + URI → función del controlador |
| src/controllers/paciente.controller.js | Presentación | Lee la petición, llama al servicio, arma la respuesta |
| src/services/paciente.service.js | Lógica de negocio | Validaciones y reglas (documento único); no conoce HTTP ni la base de datos |
| src/repositories/paciente.repository.js | Acceso a datos | Guarda y consulta (en memoria en el Taller 1) |
| src/models/paciente.js | Modelo | Atributos de la entidad y su validación |
| src/utils/http-error.js | Utilidad | Error con código de estado HTTP |


## Endpoints (Taller 1)

| Método | URI | Respuesta |
|---|---|---|
| GET | /health | 200 `{"servicio":"ms-pacientes","estado":"ok"}` |
| GET | /pacientes | 200 arreglo de pacientes |
| GET | /pacientes/:id | 200 paciente · 400 id inválido · 404 no existe |
| POST | /pacientes | 201 paciente creado · 400 datos inválidos · 409 documento repetido |

Ejemplo de cuerpo para POST:
`{"nombre": "Juliana Chavarro", "documento": 4, "fecha_nacimiento": "1995-08-12", "EPS": "Colsanitas", "telefono": 23456789}`

Los roles válidos se configuran en el archivo .env (`ROLES=administrador,admisiones,medico`).
