-- db/schema.sql — base de datos de ms-pacientes
SET NAMES utf8mb4;            -- para que las tildes y la ñ se guarden bien

CREATE TABLE IF NOT EXISTS pacientes (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL,
  documento         BIGINT       NOT NULL UNIQUE,
  fecha_nacimiento  DATE         NOT NULL,
  eps               VARCHAR(50)  NOT NULL,
  telefono          BIGINT       NOT NULL,
  activo            BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Registros iniciales de prueba
INSERT INTO pacientes (nombre, documento, fecha_nacimiento, eps, telefono, activo) VALUES
  ('Carlos Bacca', 1010, '1990-10-15', 'Nueva EPS',  3001234567, TRUE),
  ('Miriam Lopez', 2020, '1995-11-20', 'Sura',       3109876543, TRUE),
  ('Jhon Aponza',  3030, '2000-12-05', 'Colsanitas', 3205551234, TRUE);