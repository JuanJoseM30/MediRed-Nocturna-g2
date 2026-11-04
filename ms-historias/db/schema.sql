-- db/schema.sql · ms-historias
SET NAMES utf8mb4;              -- para que las tildes y la ñ se guarden bien

CREATE TABLE historias (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id     INT          NOT NULL,   -- referencia a ms-pacientes (sin FOREIGN KEY)
  medico_id       INT          NOT NULL,   -- referencia a ms-medicos (sin FOREIGN KEY)
  fecha           DATE         NOT NULL,
  motivo_consulta VARCHAR(255) NOT NULL,
  diagnostico     VARCHAR(255) NOT NULL,
  tratamiento     TEXT         NOT NULL
);

INSERT INTO historias (paciente_id, medico_id, fecha, motivo_consulta, diagnostico, tratamiento) VALUES
  (1, 1, '2026-10-05', 'Dolor de cabeza frecuente', 'Migraña', 'Acetaminofén 500 mg cada 8 horas por 5 días'),
  (2, 2, '2026-10-12', 'Tos y fiebre', 'Infección respiratoria aguda', 'Reposo, hidratación y control en 3 días'),
  (1, 3, '2026-10-20', 'Control de presión arterial', 'Hipertensión controlada', 'Continuar losartán 50 mg diarios');
