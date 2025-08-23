import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http'; // <-- Use import instead of require
import { Server } from 'socket.io'; // <-- Correct ES Module import for socket.io

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// --- App and Server Configuration ---
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app); // Create the HTTP server with your express app

// --- Socket.IO Setup ---
const io = new Server(server, { // Use new Server() and attach it to your http server
    cors: {
        origin: '*', // For development, you can restrict this in production
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// REMOVED: server.listen(5000, ...) -> Do not start the server here

// --- Database and Cloudinary Connections ---
connectDB();
connectCloudinary();

// --- Middlewares ---
// Production security headers
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });
}

// General middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? true // Consider specifying your production domain(s) here for better security
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// --- API Endpoints ---
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Doctor Appointment API!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// --- Start the Server (Single point of start) ---
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Socket.IO is attached and listening.`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Visit http://localhost:${port} to check the API`);
});