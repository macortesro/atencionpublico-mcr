const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const DailyCounter = require('../models/DailyCounter');

// Ruta GET para obtener todos los trámites
router.get('/', async (req, res) => {
    try {
        const tramites = await Tramite.find();
        res.json(tramites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta PUT para actualizar el estado de un trámite
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const tramite = await Tramite.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // Retorna el documento actualizado
        );

        if (!tramite) {
            return res.status(404).json({ message: 'Trámite no encontrado' });
        }

        // Emitir evento de actualización
        req.io.emit('actualizar-tramite', tramite);

        res.json(tramite);
    } catch (error) {
        console.error("Error al actualizar el trámite:", error);
        res.status(500).json({ message: 'Error al actualizar el estado del trámite' });
    }
});

// Ruta POST para crear un nuevo trámite
router.post('/', async (req, res) => {
    const { tipo_tramite, nombre, run, correo, domicilio, telefono, detalle, funcionario_citador } = req.body;

    try {
        const today = new Date().toISOString().split('T')[0];
        let counter = await DailyCounter.findOne({ date: today, tipo_tramite });
        if (!counter) {
            counter = await DailyCounter.create({ date: today, tipo_tramite, count: 0 });
        }

        counter.count += 1;
        await counter.save();

        const prefixMap = { Denuncia: 'D', Consulta: 'C', Citación: 'F' };
        const numero_tramite = `${prefixMap[tipo_tramite]}-${counter.count}`;

        const nuevoTramite = new Tramite({
            tipo_tramite,
            nombre,
            run,
            correo,
            domicilio,
            telefono,
            estado: false,
            numero_tramite,
            detalle: detalle || null,
            funcionario_citador: funcionario_citador || null,
        });

        const tramiteGuardado = await nuevoTramite.save();

        // Emitir evento de creación
        req.io.emit('nuevo-tramite', tramiteGuardado);

        res.status(201).json({
            message: 'Trámite creado exitosamente',
            numero_tramite,
            tramite: tramiteGuardado,
        });
    } catch (error) {
        console.error("Error al crear el trámite:", error);
        res.status(400).json({ message: error.message });
    }
});

// Ruta DELETE para eliminar un trámite
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tramiteEliminado = await Tramite.findByIdAndDelete(id);

        if (!tramiteEliminado) {
            return res.status(404).json({ message: 'Trámite no encontrado' });
        }

        // Emitir evento de eliminación
        req.io.emit('eliminar-tramite', id);

        res.status(200).json({ message: 'Trámite eliminado correctamente', tramiteEliminado });
    } catch (error) {
        console.error('Error al eliminar el trámite:', error);
        res.status(500).json({ message: 'Error al eliminar el trámite', error: error.message });
    }
});

module.exports = router;
