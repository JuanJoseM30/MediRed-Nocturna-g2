// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// =====================================================================

const { Router } = require('express');
const controller = require('../controllers/citas.controller');

const router = Router();

router.get('/', controller.listar);      // Listar citas
router.get('/:id', controller.obtener);  // Obtener cita por id
router.post('/', controller.crear);      // Crear cita

module.exports = router;
