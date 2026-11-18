-- deploy/bases-de-datos.sql
-- Se ejecuta en servidor1 (172.16.0.234) con: sudo mysql
-- Cada usuario solo puede conectarse desde servidor2 (172.16.0.235).
-- Reemplace <CLAVE> por la contraseña de producción (solo letras y números).
-- Las contraseñas NO se guardan en el repositorio.

-- ms-usuarios
CREATE DATABASE usuarios_db;
CREATE USER 'usuarios_user'@'172.16.0.235' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON usuarios_db.* TO 'usuarios_user'@'172.16.0.235';

-- ms-pacientes
CREATE DATABASE pacientes_db;
CREATE USER 'pacientes_user'@'172.16.0.235' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON pacientes_db.* TO 'pacientes_user'@'172.16.0.235';

-- ms-medicos
CREATE DATABASE medicos_db;
CREATE USER 'medicos_user'@'172.16.0.235' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON medicos_db.* TO 'medicos_user'@'172.16.0.235';

-- ms-citas
CREATE DATABASE citas_db;
CREATE USER 'citas_user'@'172.16.0.235' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON citas_db.* TO 'citas_user'@'172.16.0.235';

-- ms-historias
CREATE DATABASE historias_db;
CREATE USER 'historias_user'@'172.16.0.235' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON historias_db.* TO 'historias_user'@'172.16.0.235';

-- Las tablas se crean DESDE servidor2, en la carpeta de cada microservicio:
--   mysql -h 172.16.0.234 -u <recurso>_user -p <recurso>_db < db/schema.sql