// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/historias.controller');

const router = Router();

router.get('/', controller.listar);      // listar todas las historias
router.get('/:id', controller.obtener);  // obtener una historia por id
router.post('/', controller.crear);      // crear una historia
router.put('/:id', controller.actualizar);    // actualizar una historia
router.delete('/:id', controller.eliminar);   // eliminar una historia

module.exports = router;