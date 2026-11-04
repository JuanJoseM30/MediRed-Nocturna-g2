# ms-pacientes · Contrato de la API

## Cómo ejecutarlo

1. Crear la base de datos y su usuario (como root):

CREATE DATABASE pacientes_db;
CREATE USER 'pacientes_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON pacientes_db.* TO 'pacientes_user'@'localhost';

Crear la tabla: en la consola mysql -u pacientes_user -p pacientes_db y luego SOURCE db/schema.sql;

npm install

Copiar .env.example como .env y ajustar la contraseña de la base de datos.

npm run dev

## Representación

{ "id": 4, "nombre": "Laura Tula", "documento": 7070, "fecha_nacimiento": "2006-10-30", "EPS": "Colsanitas", "telefono": 123456789, "activo": false }

## Atributos

| Atributo | Tipo | Reglas y Obligatoriedad |
|---|---|---|
| id | entero | No: lo asigna el servicio (positivo y único) |
| nombre | texto | Sí (no vacío) |
| documento | entero | Sí (numérico; único - 409) |
| fecha_nacimiento | texto (YYYY-MM-DD) | Sí (formato de fecha válido) |
| EPS | texto | Sí (no vacío) |
| telefono | entero | Sí (numérico válido) |
| activo | booleano | No, por defecto `false` (`true` o `false`) |

## Endpoints

| Operación | Método + URI | Respuesta y Errores |
|---|---|---|
| Listar | GET `/pacientes` | 200 arreglo |
| Filtrar | GET `/pacientes?EPS=Colsanitas` | 200 arreglo |
| Consultar por lotes | GET `/pacientes?ids=1,3` | 200 arreglo · 400 |
| Obtener | GET `/pacientes/:id` | 200 objeto · 400 · 404 |
| Crear | POST `/pacientes` | 201 objeto + Location · 400 · 409 |
| Actualizar | PUT `/pacientes/:id` | 200 objeto · 400 · 404 · 409 |
| Eliminar | DELETE `/pacientes/:id` | 204 · 400 · 404 |

## Ejemplo para crear:

{ "nombre": "Laura Tula", "documento": 7070, "fecha_nacimiento": "2006-10-30", "EPS": "Colsanitas", "telefono": 123456789 }

## Relaciones
Consulto a: ninguno.

Me consultan: ms-citas (para validar la existencia y datos del paciente al agendar).

## Pruebas
Colección de Postman en [`docs/ms-pacientes.postman_collection.json`](./docs/ms-pacientes.postman_collection.json) (13 casos).