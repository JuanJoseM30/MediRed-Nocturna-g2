# ms-historias · Contrato de la API

Microservicio de **historias clínicas** (registros de atención) de MediRed IPS.
Responsable: Juan Felipe Vega Reyes. Puerto: **3005**.

## Cómo ejecutarlo

Requisitos: Node.js 22 o superior y MySQL (o MariaDB de XAMPP).

1. Crear la base de datos y su usuario (como root):

```sql
CREATE DATABASE historias_db;
CREATE USER 'historias_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON historias_db.* TO 'historias_user'@'localhost';
```

2. Crear la tabla: en la consola `mysql -u historias_user -p historias_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env` y poner la contraseña de la base de datos.
5. `npm run dev`

Variables del `.env`:

| Variable | Ejemplo | Para qué |
|---|---|---|
| PORT | 3005 | Puerto del microservicio |
| HOST | 127.0.0.1 | Dirección donde escucha |
| DB_HOST | localhost | Servidor de MySQL |
| DB_PORT | 3306 | Puerto de MySQL |
| DB_NAME | historias_db | Base de datos |
| DB_USER | historias_user | Usuario de la base de datos |
| DB_PASSWORD | (la clave) | Contraseña del usuario |
| JWT_SECRET | (la frase del grupo) | Clave para verificar los tokens; la misma de ms-usuarios |

## Seguridad

Todas las peticiones a `/historias` exigen la cabecera `Authorization: Bearer <token>`, con el token
que entrega `POST /usuarios/login` de ms-usuarios. Sin token, o con un token inválido o vencido: **401**.

| Operación | Roles permitidos |
|---|---|
| Consultar (GET) | Cualquier rol autenticado |
| Crear, actualizar y eliminar (POST, PUT, DELETE) | administrador, medico (los demás: **403**) |

## Representación

```json
{ "id": 2, "paciente_id": 2, "medico_id": 2, "fecha": "2026-10-12", "motivo_consulta": "Tos y fiebre", "diagnostico": "Infección respiratoria aguda", "tratamiento": "Reposo, hidratación y control en 3 días" }
```

## Atributos

| Atributo | Tipo | ¿Obligatorio al crear? | Reglas |
|---|---|---|---|
| id | entero | No: lo asigna el servicio | Positivo y único |
| paciente_id | entero | Sí | Entero positivo; id de un paciente de ms-pacientes |
| medico_id | entero | Sí | Entero positivo; id de un médico de ms-medicos |
| fecha | texto (AAAA-MM-DD) | Sí | No puede ser posterior a hoy (400) |
| motivo_consulta | texto | Sí | No vacío |
| diagnostico | texto | Sí | No vacío |
| tratamiento | texto | Sí | No vacío |

## Endpoints

| Operación | Método | URI | Cuerpo | Respuesta exitosa | Errores |
|---|---|---|---|---|---|
| Listar | GET | /historias | — | 200 arreglo | — |
| Filtrar | GET | /historias?paciente_id=1 | — | 200 arreglo filtrado | 400 paciente_id inválido |
| Obtener | GET | /historias/:id | — | 200 objeto | 400 · 404 |
| Crear | POST | /historias | JSON sin id | 201 objeto + Location | 400 |
| Actualizar | PUT | /historias/:id | JSON completo sin id | 200 objeto | 400 · 404 |
| Eliminar | DELETE | /historias/:id | — | 204 | 400 · 404 |

Ejemplo para crear: `POST /historias`

```json
{ "paciente_id": 3, "medico_id": 2, "fecha": "2026-10-27", "motivo_consulta": "Dolor abdominal", "diagnostico": "Gastritis", "tratamiento": "Omeprazol 20 mg en ayunas" }
```

Respuesta: `201 Created`, cabecera `Location: /historias/4`

```json
{ "id": 4, "paciente_id": 3, "medico_id": 2, "fecha": "2026-10-27", "motivo_consulta": "Dolor abdominal", "diagnostico": "Gastritis", "tratamiento": "Omeprazol 20 mg en ayunas" }
```

Ejemplo para listar: `GET /historias?paciente_id=1`

Respuesta: `200 OK`

```json
[
  { "id": 1, "paciente_id": 1, "medico_id": 1, "fecha": "2026-10-05", "motivo_consulta": "Dolor de cabeza frecuente", "diagnostico": "Migraña", "tratamiento": "Acetaminofén 500 mg cada 8 horas por 5 días" },
  { "id": 3, "paciente_id": 1, "medico_id": 3, "fecha": "2026-10-20", "motivo_consulta": "Control de presión arterial", "diagnostico": "Hipertensión controlada", "tratamiento": "Continuar losartán 50 mg diarios" }
]
```

Errores: `{ "error": "mensaje", "detalles": ["..."] }` (detalles solo en errores de validación).

## Relaciones

**Consulto a:** ms-pacientes y ms-medicos.

| Atributo | Microservicio consultado | Para validar (al crear y actualizar) | Para componer (al consultar) | Datos que usa |
|---|---|---|---|---|
| paciente_id | ms-pacientes | GET /pacientes/:id | GET /pacientes?ids=… | id, nombre |
| medico_id | ms-medicos | GET /medicos/:id | GET /medicos?ids=… | id, nombre, especialidad |

**Me consultan:** ninguno.

## Pruebas

Colección de Postman en `docs/ms-historias.postman_collection.json`: carpeta 00 de preparación (login y usuarios de prueba), casos 1 a 13 (el 3, consulta por lotes, no aplica) y casos de seguridad 14 a 18.
