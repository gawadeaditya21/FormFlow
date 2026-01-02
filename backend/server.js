import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

//MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI || `mongodb://localhost:27017/formflow`)
.then(() => {console.log("✅ MongoDB connected")})
.catch((err) => {console.log("❌ MongoDB connection error:", err)})

const PORT = process.env.PORT || 8080
app.listen(PORT, console.log("Server is running on port 8080"));