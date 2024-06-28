import mongoose from 'mongoose';

const historialSchema = new mongoose.Schema({
  city: { type: String, required: true },
  timestamp: { type: String, required: true }
});

export const Historial = mongoose.model('Historial', historialSchema);
