import express from 'express'
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// app configuration
const app = express()
const port = process.env.PORT || 4000;

// Connect to database and cloudinary (with error handling)
connectDB();
connectCloudinary();

// Production security and performance middlewares
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });
}

// middlewares
app.use(express.json({ limit: '10mb' }))
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com', 'https://your-admin-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req,res)=>{
    res.send('Welcome to the Doctor Appointment API!')
})

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Visit http://localhost:${port} to check if the server is running`)
})
