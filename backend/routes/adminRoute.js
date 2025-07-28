import express from 'express'
import { addDoctor, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';
import validator from 'validator';

const adminRouter = express.Router()

// Test endpoint
adminRouter.get('/test', (req, res) => {
    res.json({ success: true, message: "Admin route is working!" })
})

adminRouter.post('/add-doctor',authAdmin , upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)

export default adminRouter