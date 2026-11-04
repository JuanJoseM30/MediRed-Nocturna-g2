// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/citas.controller');

const router = Router();

router.get('/', controller.listar);        // Listar y filtrar citas (?estado=... o ?sede=...)
router.get('/:id', controller.obtener);    // Obtener cita por id
router.post('/', controller.crear);        // Crear cita

router.put('/:id', controller.actualizar); // Actualizar cita completa
router.delete('/:id', controller.eliminar);// Eliminar cita

module.exports = router;
