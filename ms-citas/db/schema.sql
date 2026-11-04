-- db/schema.sql
SET NAMES utf8mb4;            -- para que las tildes y la ñ se guarden bien

CREATE TABLE citas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  medico_id   INT NOT NULL,
  fecha_hora  VARCHAR(30) NOT NULL,
  sede        VARCHAR(50) NOT NULL,
  estado      VARCHAR(20) NOT NULL DEFAULT 'programada'
);

INSERT INTO citas (paciente_id, medico_id, fecha_hora, sede, estado) VALUES
  (1, 1, '2026-11-03T08:00', 'Cali', 'programada'),
  (2, 2, '2026-11-03T09:30', 'Bogotá', 'atendida'),
  (3, 1, '2026-11-04T10:00', 'Cali', 'cancelada');
