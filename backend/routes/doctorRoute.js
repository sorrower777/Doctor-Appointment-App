import express from 'express';
import { 
    doctorList, 
    loginDoctor, 
    appointmentsDoctor, 
    appointmentComplete, 
    appointmentCancel, 
    doctorDashboard, 
    doctorProfile, 
    updateDoctorProfile,
    uploadDoctorImage
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.post('/upload-image', authDoctor, upload.single('image'), uploadDoctorImage);

export default doctorRouter;