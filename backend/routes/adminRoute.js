import express from 'express'
import { addDoctor, loginAdmin, allDoctors, changeAvailability, appointmentsAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js'
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
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter