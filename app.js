// app.js
const express = require('express');
const cors = require('cors');
const routes = require('./pacientes/routes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Configuración de CORS

app.get('/', (req, res) => {
    res.send('Ruta de prueba. El servidor está en funcionamiento.');
});
// Rutas
app.use('/api', routes);

module.exports = app;
