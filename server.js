import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import historialRoute from './src/routes/routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Ajusta aquí la configuración de CORS
  optionsSuccessStatus: 200 // Para algún navegador antiguo (legacy browser)
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error de conexión a MongoDB:', error));

// Rutas
app.use('/historial', historialRoute);

// Iniciar servidor
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
