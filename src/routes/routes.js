import express from 'express';
import { Historial } from '../models/historial.js';

const router = express.Router();

// GET all history
router.get('/', async (req, res) => {
  try {
    const history = await Historial.find();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new history
router.post('/', async (req, res) => {
  const historial = new Historial({
    city: req.body.city,
    timestamp: req.body.timestamp // Asegúrate de enviar timestamp desde el frontend
  });
  try {
    const newHistorial = await historial.save();
    res.status(201).json(newHistorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all history
router.delete('/', async (req, res) => {
  try {
    await Historial.deleteMany();
    res.json({ message: 'Historial eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
