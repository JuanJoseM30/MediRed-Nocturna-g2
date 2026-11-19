# MEDIRED-NOCTURNO-G2

Aplicación de MediRed IPS construida con **microservicios**: cada microservicio gestiona una entidad, tiene su propia base de datos y se organiza en capas (rutas, controladores, servicios, modelos y repositorios). Los microservicios se comunican por HTTP, verifican el token JWT de ms-usuarios y se publican detrás de un **API Gateway** en Apache.

---

# Integrantes

* **Juan Jose Marin** - 2235452 - `JuanJoseM30` - `ms-pacientes`
* **Santiago Garzon** - 2235761 - `SantiGarGomez` - `ms-citas`
* **Jhoan Esteban Burgos** - 2225003 - `JhoanBurgos` - `ms-medicos`
* **Juan Felipe Vega** - 2225527 - `juan-felvega` - `ms-historias`

---

# Tabla de Microservicios

| Carpeta | Entidad | Responsable | Puerto | Base de datos | Dependencias |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ms-usuarios` | Usuarios / Autenticación | Plantilla de la docente | 3001 | `usuarios_db` | Ninguna |
| `ms-pacientes` | Pacientes | Juan José Marín | 3002 | `pacientes_db` | Ninguna |
| `ms-medicos` | Médicos | Jhoan Esteban Burgos | 3003 | `medicos_db` | Ninguna |
| `ms-citas` | Citas médicas | Santiago Garzón | 3004 | `citas_db` | `ms-pacientes`, `ms-medicos` |
| `ms-historias` | Historias clínicas | Juan Felipe Vega | 3005 | `historias_db` | `ms-pacientes`, `ms-medicos` |

Roles de la aplicación: `administrador`, `medico`, `admisiones`.

---

# Estructura del repositorio

```text
MediRed-Nocturna-g2/
├── README.md        # Documentación general del proyecto y del grupo
├── deploy/          # Archivos de despliegue: app.conf, servicios systemd y SQL de bases y usuarios
├── frontend/        # Pantallas HTML/JS de la aplicación (login y una pantalla por entidad)
├── ms-usuarios/     # Autenticación, usuarios y roles (proporcionado por la docente)
├── ms-pacientes/    # Gestión de pacientes
├── ms-medicos/      # Gestión de médicos y especialidades
├── ms-citas/        # Citas médicas (se relaciona con pacientes y médicos)
└── ms-historias/    # Historias clínicas (se relaciona con pacientes y médicos)
```

---

# Cómo ejecutar un microservicio en el PC (desarrollo)

1. Instalar Node.js 22 o superior y MySQL.
2. Crear la base de datos y el usuario del microservicio, y ejecutar su `db/schema.sql`.
3. En la carpeta del microservicio:
   ```
   cd ms-pacientes
   npm install
   copy .env.example .env
   ```
4. Ajustar el `.env` (contraseña de la base y `JWT_SECRET` del grupo).
5. Arrancar con `npm run dev` y probar `http://localhost:3002/health`.

---

# Despliegue en el ambiente (Taller 3)

## Ambiente

| Equipo | Hostname | IP | Qué corre |
| :--- | :--- | :--- | :--- |
| servidor1 | bog-srv-pacs1 | 172.16.0.234 | DNS (bind9), Squid, **MySQL** |
| servidor2 | bog-srv-hce1 | 172.16.0.235 | **Apache (gateway + frontend)** y los 5 microservicios |
| Windows | anfitrión | 172.16.0.233 | Navegador (cliente) |

La aplicación se abre en **http://app.medired.com**. Desde Windows solo se llega al puerto 80 de servidor2: MySQL (3306) y los microservicios (3001-3005) no son accesibles.

## Paso 1 · MySQL en servidor1

```
sudo apt update && sudo apt install -y mysql-server
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
#   bind-address = 127.0.0.1,172.16.0.234
sudo systemctl restart mysql
sudo ufw allow from 172.16.0.235 to any port 3306 proto tcp
sudo ss -tlnp | grep 3306
```

## Paso 2 · Bases de datos y usuarios (servidor1)

Ejecutar en `sudo mysql` los comandos de [`deploy/bases-de-datos.sql`](deploy/bases-de-datos.sql), reemplazando `<CLAVE>` por la contraseña de producción de cada base (solo letras y números). Cada usuario queda restringido a `@'172.16.0.235'`.

## Paso 3 · Node.js, código y usuario del servicio (servidor2)

```
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git mysql-client
sudo adduser --system --group --no-create-home nodeapps
sudo mkdir -p /srv/medired/app && sudo chown vagrant:vagrant /srv/medired/app
git clone https://github.com/JuanJoseM30/MediRed-Nocturna-g2.git /srv/medired/app
```

## Paso 4 · Preparar cada microservicio (servidor2)

Empezar por **ms-usuarios** (todos dependen de su token) y luego ms-pacientes, ms-medicos, ms-citas y ms-historias:

```
cd /srv/medired/app/ms-pacientes
mysql -h 172.16.0.234 -u pacientes_user -p pacientes_db < db/schema.sql
npm ci --omit=dev
cp .env.example .env && nano .env
chmod 640 .env && sudo chgrp nodeapps .env
```

Cambios del `.env` respecto al PC:

| Variable | Valor en servidor2 |
| :--- | :--- |
| `DB_HOST` | `172.16.0.234` |
| `DB_PASSWORD` | La contraseña de producción de esa base |
| `JWT_SECRET` | La frase de producción, **igual en los 5 microservicios** |
| `PORT`, `HOST`, `DB_NAME`, `DB_USER`, `*_URL` | Igual que en el PC |

## Paso 5 · Cada microservicio como servicio systemd (servidor2)

Copiar el archivo de [`deploy/`](deploy/) correspondiente a `/etc/systemd/system/` y activarlo:

```
sudo cp /srv/medired/app/deploy/ms-pacientes.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ms-pacientes
systemctl status ms-pacientes
curl http://127.0.0.1:3002/health
```

Si un servicio no arranca: `sudo journalctl -u ms-pacientes -n 20`.

## Paso 6 · Registro DNS `app` (servidor1)

En `/etc/bind/db.www.medired.com` (zona `medired.com`) incrementar el serial y agregar:

```
app     IN      A       172.16.0.235
```

```
sudo named-checkzone medired.com /etc/bind/db.www.medired.com
sudo systemctl restart bind9
```

## Paso 7 · API Gateway en Apache (servidor2)

```
sudo a2enmod proxy proxy_http
sudo mkdir -p /var/www/app
sudo cp /srv/medired/app/deploy/app.conf /etc/apache2/sites-available/
sudo a2ensite app.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

| Ruta pública | Microservicio | Destino interno |
| :--- | :--- | :--- |
| `/api/usuarios` | ms-usuarios | `http://127.0.0.1:3001/usuarios` |
| `/api/pacientes` | ms-pacientes | `http://127.0.0.1:3002/pacientes` |
| `/api/medicos` | ms-medicos | `http://127.0.0.1:3003/medicos` |
| `/api/citas` | ms-citas | `http://127.0.0.1:3004/citas` |
| `/api/historias` | ms-historias | `http://127.0.0.1:3005/historias` |

Con el gateway funcionando: cambiar la contraseña del administrador (`PUT /api/usuarios/1`) y crear un usuario por rol (`POST /api/usuarios`).

## Paso 8 · Publicar el frontend (servidor2)

En `frontend/js/config.js` todas las direcciones de `SERVICIOS` son `'/api'`. Para publicarlo:

```
cd /srv/medired/app && git pull
sudo cp -r /srv/medired/app/frontend/* /var/www/app/
```

## Actualizar un microservicio después de un cambio en GitHub

```
cd /srv/medired/app && git pull
cd ms-pacientes && npm ci --omit=dev
sudo systemctl restart ms-pacientes
```

## Verificación rápida

| Prueba | Resultado esperado |
| :--- | :--- |
| `nslookup app.medired.com` (Windows) | 172.16.0.235 |
| `curl.exe -i http://app.medired.com/api/pacientes` (Windows) | 401 (falta el token) |
| `curl.exe -m 5 http://172.16.0.235:3002/health` (Windows) | Falla |
| `Test-NetConnection 172.16.0.234 -Port 3306` (Windows) | `TcpTestSucceeded : False` |
| `sudo ss -tlnp \| grep 300` (servidor2) | 5 servicios en `127.0.0.1:3001-3005` |

> Las contraseñas de producción y la `JWT_SECRET` **nunca** se suben al repositorio: solo existen en los `.env` de servidor2.