const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    rut: String,
    nombre: String,
    edad: Number,
    sexo: String,
    fotoPersonal: String,
    fechaIngreso: { type: Date, default: Date.now },
    enfermedad: String,
    revisado: { type: Boolean, default: false },
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
