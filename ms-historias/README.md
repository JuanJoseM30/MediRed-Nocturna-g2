# ms-historias · MediRed IPS

Microservicio de **historias clínicas** (registros de atención) de MediRed IPS.
Redes y Servicios Multimedia · UAO · Módulo 3 · Taller 1.
Responsable: Juan Felipe Vega Reyes · Puerto: **3005**

## Cómo ejecutarlo

```
npm install
copy .env.example .env
npm run dev
```

## Endpoints

| Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|
| GET | /health | 200 `{"servicio":"ms-historias","estado":"ok"}` | — |
| GET | /historias | 200, arreglo de historias | — |
| GET | /historias/:id | 200, la historia | 400 id no numérico · 404 no existe |
| POST | /historias | 201, la historia creada + cabecera Location | 400 datos inválidos |

## Ejemplo de historia

```json
{
  "id": 1,
  "paciente_id": 1,
  "medico_id": 1,
  "fecha": "2026-10-05",
  "motivo_consulta": "Dolor de cabeza frecuente",
  "diagnostico": "Migraña",
  "tratamiento": "Acetaminofén 500 mg cada 8 horas por 5 días"
}
```

`paciente_id` y `medico_id` son referencias a ms-pacientes y ms-medicos.