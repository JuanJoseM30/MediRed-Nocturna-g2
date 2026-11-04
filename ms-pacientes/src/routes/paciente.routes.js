// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const pacienteController = require('../controllers/paciente.controller');

const router = Router();

router.get('/', pacienteController.listar);      // listar todos los pacientes
router.get('/:id', pacienteController.obtener);  // obtener un paciente por id
router.post('/', pacienteController.crear);      // crear un paciente
router.put('/:id', pacienteController.actualizar); // actualizar un paciente por id
router.delete('/:id', pacienteController.eliminar); // eliminar un paciente por id

module.exports = router;