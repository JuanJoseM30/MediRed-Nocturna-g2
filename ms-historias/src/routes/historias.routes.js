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

// Taller 2: agregar PUT /:id (actualizar) y DELETE /:id (eliminar)

module.exports = router;