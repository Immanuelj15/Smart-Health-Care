import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

// Import all your route files
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import surgeryRoutes from './routes/surgeryRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
// ❌ The import for 'orderRoutes.js' has been removed

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

// Load environment variables


// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/surgeries', surgeryRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/reviews', reviewRoutes);
// ❌ The app.use() for 'orderRoutes' has been removed

// --- Socket.IO Logic ---
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Signaling for WebRTC (Video Call)
  socket.on("call_user", (data) => {
    socket.to(data.room).emit("incoming_call", data);
  });

  socket.on("answer_call", (data) => {
    socket.to(data.room).emit("call_accepted", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start the server (Using httpServer instead of app)
httpServer.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});