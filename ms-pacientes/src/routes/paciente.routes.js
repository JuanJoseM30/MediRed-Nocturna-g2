// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador
// y decide qué rutas exigen token y qué roles pueden usarlas.
// =====================================================================
const { Router } = require('express');
const pacienteController = require('../controllers/paciente.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

// Todas las rutas exigen un token válido (401 si falta, es inválido o venció)
router.use(verificarToken);

// Consultar: cualquier rol autenticado (administrador, medico, admisiones)
router.get('/', pacienteController.listar);       // listar / filtrar / ?ids=
router.get('/:id', pacienteController.obtener);   // obtener un paciente por id

// Crear, actualizar y eliminar: solo administrador (403 a los demás)
router.post('/', requiereRol('administrador'), pacienteController.crear);
router.put('/:id', requiereRol('administrador'), pacienteController.actualizar);
router.delete('/:id', requiereRol('administrador'), pacienteController.eliminar);

module.exports = router;