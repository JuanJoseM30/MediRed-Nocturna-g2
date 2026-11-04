SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS pacientes_db;
USE pacientes_db;

CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  documento INT NOT NULL UNIQUE,
  fecha_nacimiento DATE NOT NULL,
  eps VARCHAR(50) NOT NULL,
  telefono INT NOT NULL
);

-- Registros iniciales de prueba
INSERT INTO pacientes (nombre, documento, fecha_nacimiento, eps, telefono) VALUES
('Carlos Bacca', 1010, '1990-10-15', 'Nueva EPS', 123456789),
('Miriam Lopez', 2020, '1995-11-20', 'Sura', 123456789),
('Jhon Aponza', 3030, '2000-12-05', 'Colsanitas', 123456789);