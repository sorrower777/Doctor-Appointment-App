import express from 'express'
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';

// app configuration
const app = express()
const port = process.env.PORT || 4000;

// Connect to database and cloudinary (with error handling)
connectDB();
connectCloudinary();

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)

app.get('/', (req,res)=>{
    res.send('Welcome to the API!')
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
    console.log(`Visit http://localhost:${port} to check if the server is running`)
})
