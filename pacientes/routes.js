// pacientes/routes.js
const express = require('express');
const controllers = require('./controllers');
const multerConfig = require('./multer.config');

const router = express.Router();

router.get('/', (req, res)=> { return res.send('App Hospital - Test Conexion')})

router.post('/pacientes', controllers.guardar);
router.get('/pacientes', controllers.obtenerTodos);
router.get('/pacientes/:id', controllers.obtenerPorId);
router.get('/pacientes/buscar/:buscar', controllers.buscarPersonalizada);
router.put('/pacientes/:id', controllers.actualizar);
router.delete('/pacientes/:id', controllers.eliminar);

router.post('/pacientes/subirArchivo/:id', multerConfig, controllers.subirArchivo);
router.get('/pacientes/obtenerArchivo/:filename', controllers.obtenerArchivo);

module.exports = router;
