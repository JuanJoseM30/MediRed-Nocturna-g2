// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/medicos.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');
const router = Router();
router.use(verificarToken);

router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;

// Ahora se necesita un Token que genera Usuarios para consultar medicos, es decir se deben mantener las 2 terminales encendidas
// El token se genera cambia cada vez que se le da en Send 
// en http://localhost:3001/usuarios/login