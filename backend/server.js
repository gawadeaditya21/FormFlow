import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import formsRoutes from './routes/forms.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MONGODB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/formflow')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/forms', formsRoutes);

// simple health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));