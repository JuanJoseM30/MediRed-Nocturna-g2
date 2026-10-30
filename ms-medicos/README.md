# ms-medicos — MediRed IPS

**Responsable:** Jhoan Esteban Burgos Guerrero  
**Taller:** Módulo 3, Taller 1  
**Puerto:** 3003

Microservicio de médicos desarrollado con Node.js y Express. Está organizado en capas y, en esta etapa, guarda los datos en memoria.

## Requisitos y ejecución

Se requiere Node.js 22 o superior. Desde la carpeta `ms-medicos`, ejecutar en CMD:

```cmd
npm install
copy .env.example .env
npm run dev
```

El servicio queda disponible en `http://localhost:3003`. Para detenerlo, presionar **Ctrl+C**.

## Modelo de médico

| Atributo | Descripción |
|---|---|
| `id` | Identificador numérico asignado por el repositorio |
| `nombre` | Nombre del médico; obligatorio |
| `registro_medico` | Registro profesional; obligatorio y único |
| `especialidad` | Especialidad médica; obligatoria |
| `sede` | Bogotá, Cali o Medellín; obligatoria |

## Rutas de la API

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/health` | 200: estado del servicio |
| GET | `/medicos` | 200: lista de médicos |
| GET | `/medicos/:id` | 200: médico encontrado; 404: no existe |
| POST | `/medicos` | 201: médico creado; 400: datos inválidos; 409: registro médico repetido |

Ejemplo de cuerpo JSON para `POST /medicos`:

```json
{
  "nombre": "Sofía Ramírez",
  "registro_medico": "RM-1004",
  "especialidad": "Neurología",
  "sede": "Bogotá"
}
```

En Postman, seleccionar **Body → raw → JSON** para enviar la petición POST.

## Organización en capas

| Archivo | Responsabilidad |
|---|---|
| `src/index.js` | Inicia el servidor en el puerto configurado |
| `src/app.js` | Configura Express, las rutas y el manejo de errores |
| `src/routes/medicos.routes.js` | Asocia cada método y ruta con el controlador |
| `src/controllers/medicos.controller.js` | Lee la petición y construye la respuesta HTTP |
| `src/services/medicos.service.js` | Aplica las validaciones y evita registros médicos repetidos |
| `src/models/medico.js` | Define los atributos y valida los datos |
| `src/repositories/medicos.repository.js` | Consulta y guarda los médicos en memoria |
| `src/utils/http-error.js` | Representa errores con código de estado HTTP |

El repositorio inicia con tres médicos. Los registros creados mediante POST se pierden al reiniciar el servicio, porque todavía no se utiliza una base de datos.