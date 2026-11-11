// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador
// y decide qué rutas exigen token y qué roles pueden usarlas.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/historias.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

// Todas las rutas exigen un token válido (401 si falta, es inválido o venció)
router.use(verificarToken);

// Consultar: cualquier rol autenticado
router.get('/', controller.listar);      // listar todas las historias (filtro ?paciente_id=)
router.get('/:id', controller.obtener);  // obtener una historia por id

// Crear, actualizar y eliminar: solo administrador y medico (403 a los demás)
router.post('/', requiereRol('administrador', 'medico'), controller.crear);
router.put('/:id', requiereRol('administrador', 'medico'), controller.actualizar);
router.delete('/:id', requiereRol('administrador', 'medico'), controller.eliminar);

module.exports = router;
