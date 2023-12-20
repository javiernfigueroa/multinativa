const Paciente = require('./models');
const validator = require('validator');

const { existsSync } = require('fs');
const path = require('path');



const controllers = {
    guardar: async (req, res) => {
        try {
            const { rut, nombre, edad, sexo, enfermedad } = req.body;

            if (!rut || !nombre || !edad || !sexo || !enfermedad) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Los campos rut, nombre, edad, sexo y enfermedad son obligatorios.',
                });
            }

            if (!validator.isNumeric(rut)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El campo rut debe ser numérico.',
                });
            }


            const paciente = new Paciente({
                rut,
                nombre,
                edad,
                sexo,
                enfermedad,
            });

            await paciente.save();

            const pacienteSinFoto = paciente.toObject();
            delete pacienteSinFoto.fotoPersonal;

            return res.status(200).send({
                status: 'success',
                message: 'Paciente guardado correctamente.',
                paciente: pacienteSinFoto,
            });
        } catch (error) {
            console.error('Error al guardar paciente:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al guardar paciente.',
            });
        }
    },

    obtenerTodos: async (req, res) => {
        try {
            const pacientes = await Paciente.find();
            return res.status(200).send({
                status: 'success',
                pacientes,
            });
        } catch (error) {
            console.error('Error al obtener todos los pacientes:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al obtener todos los pacientes.',
            });
        }
    },

    obtenerPorId: async (req, res) => {
        const { id } = req.params;

        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                return res.status(404).send({
                    status: 'error',
                    message: `Paciente con _id ${id} no encontrado.`,
                });
            }

            return res.status(200).send({
                status: 'success',
                paciente,
            });
        } catch (error) {
            console.error('Error al obtener paciente por _id:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al obtener paciente por _id.',
            });
        }
    },

    buscarPersonalizada: async (req, res) => {
        const { buscar } = req.params;
        const filtro = {
            $or: [
                { sexo: buscar },
                { enfermedad: buscar },
            ],
        };


        const fechaIngreso = new Date(buscar);
        if (!isNaN(fechaIngreso.getTime())) {
            filtro.$or.push({ fechaIngreso });
        }
        try {
            const pacientes = await Paciente.find(filtro);
            if (!pacientes || pacientes.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontraron pacientes con los criterios de búsqueda.',
                });
            }
            return res.status(200).send({
                status: 'success',
                pacientes,
            });
        } catch (error) {
            console.error('Error al realizar búsqueda personalizada:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al realizar búsqueda personalizada.',
            });
        }
    },

    actualizar: async (req, res) => {
        const { id } = req.params;
        const nuevosDatos = req.body;

        try {
            const pacienteActualizado = await Paciente.findByIdAndUpdate(id, nuevosDatos, { new: true });

            if (!pacienteActualizado) {
                return res.status(404).send({
                    status: 'error',
                    message: `Paciente con ID ${id} no encontrado.`,
                });
            }

            return res.status(200).send({
                status: 'success',
                paciente: pacienteActualizado,
            });
        } catch (error) {
            console.error('Error al actualizar paciente:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al actualizar paciente.',
            });
        }
    },


    eliminar: async (req, res) => {
        const { id } = req.params;

        try {
            const pacienteEliminado = await Paciente.findByIdAndDelete(id);

            if (!pacienteEliminado) {
                return res.status(404).send({
                    status: 'error',
                    message: `Paciente con ID ${id} no encontrado.`,
                });
            }

            return res.status(200).send({
                status: 'success',
                message: 'Paciente eliminado correctamente.',
                paciente: pacienteEliminado,
            });
        } catch (error) {
            console.error('Error al eliminar paciente:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al eliminar paciente.',
            });
        }
    },

    subirArchivo: async (req, res) => {
        try {
            const file = req.file;
            const { id } = req.params;

            if (!file) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El archivo no puede estar vacío o la extensión del archivo no está permitida.',
                });
            }

            const pacienteConArchivo = await Paciente.findByIdAndUpdate(
                id,
                { fotoPersonal: file.filename },
                { new: true }
            );

            if (!pacienteConArchivo) {
                return res.status(400).send({
                    status: 'error',
                    message: `No se pudo asociar la imagen al paciente con ID ${id}.`,
                });
            }

            return res.status(200).send({
                status: 'success',
                message: 'Archivo subido y asociado al paciente correctamente.',
                filename: file.filename,
                paciente: pacienteConArchivo,
            });
        } catch (error) {
            console.error('Error al subir archivo y asociar al paciente:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al subir archivo y asociar al paciente.',
            });
        }
    },

    obtenerArchivo: async (req, res) => {
        try {
            const { filename } = req.params;
            const pathFile = `uploads/${filename}`;

            if (existsSync(pathFile)) {
                console.log(`Archivo encontrado: ${pathFile}`);
                return res.sendFile(path.resolve(pathFile));
            } else {
                console.error(`El archivo no existe: ${pathFile}`);
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró la imagen con el nombre especificado.',
                });
            }
        } catch (error) {
            console.error('Error al obtener archivo del paciente:', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error interno del servidor al obtener archivo del paciente.',
                error: error.message,
            });
        }
    }

};

module.exports = controllers;
