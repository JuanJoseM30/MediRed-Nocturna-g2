SET NAMES utf8mb4;
USE medicos_db;

CREATE TABLE IF NOT EXISTS medicos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  registro_medico VARCHAR(40) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  sede VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_medicos_registro_medico (registro_medico)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO medicos
  (id, nombre, registro_medico, especialidad, sede)
VALUES
  (1, 'Ana María Torres', 'RM-1001', 'Pediatría', 'Bogotá'),
  (2, 'Carlos Rojas', 'RM-1002', 'Cardiología', 'Cali'),
  (3, 'Lucía Gómez', 'RM-1003', 'Medicina interna', 'Medellín');