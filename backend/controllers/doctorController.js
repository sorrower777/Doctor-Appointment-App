
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const changeAvailability = async (req, res) => {
    try {
        const { doctorId} = req.body;
        const doctorData = await doctorModel.findById(doctorId);
        await doctorModel.findByIdAndUpdate(doctorId, {available: !doctorData.available})
        res.json({success: true, message: 'Availability changed successfully'})
    }
    catch (error) {
        console.error('Error changing availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email']);
        res.json({ success: true, doctors})
    }
    catch (error){
        console.error('Error fetching doctors:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

//API for doctor login
const loginDoctor = async (req, res) => {
    try{
        const { email, password} = req.body;
        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success: false, message: 'Invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password, doctor.password);

        if(isMatch) {
            const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        }
        else {
            res.json({success: false, message: error.message})
        }

    }
    catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// API to get doctor appointments
const appointmentsDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body
        const appointments = await appointmentModel.find({ doctorId }).populate('userId', 'name phone image address')
        
        // Map appointments to include proper field names for frontend
        const mappedAppointments = appointments.map(item => ({
            ...item._doc,
            userData: item.userId,
            slotDate: item.date,
            slotTime: item.time,
            amount: item.fee,
            isCompleted: item.status === 'completed',
            cancelled: item.status === 'cancelled'
        }))
        
        res.json({ success: true, appointments: mappedAppointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { doctorId, appointmentId } = req.body
        
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'completed' })
            return res.json({ success: true, message: 'Appointment completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { doctorId, appointmentId } = req.body
        
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'cancelled' })
            return res.json({ success: true, message: 'Appointment cancelled' })
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { doctorId } = req.body
        
        if (!doctorId) {
            return res.json({ success: false, message: 'Doctor ID not found in request' })
        }
        
        const appointments = await appointmentModel.find({ doctorId }).populate('userId', 'name image address phone')
        
        let earnings = 0
        appointments.map((item) => {
            if (item.status === 'completed' || item.payment) {
                earnings += item.fee
            }
        })

        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId._id.toString())) {
                patients.push(item.userId._id.toString())
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5).map(item => ({
                ...item._doc,
                userData: item.userId,
                slotDate: item.date,
                slotTime: item.time,
                amount: item.fee,
                isCompleted: item.status === 'completed',
                cancelled: item.status === 'cancelled'
            }))
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log('Doctor Dashboard Error:', error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.body
        const profileData = await doctorModel.findById(doctorId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile from doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { doctorId, fees, address, available, image } = req.body
        console.log(image)
        const updateData = { fees, address, available }
        if (image) {
            updateData.image = image
        }
        
        await doctorModel.findByIdAndUpdate(doctorId, updateData)
        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to upload doctor profile image
const uploadDoctorImage = async (req, res) => {
    try {
        // Try to get doctorId from multiple sources
        const doctorId = req.body.doctorId || req.doctorId
        
        if (!doctorId) {
            return res.json({ success: false, message: 'Doctor ID not found' })
        }
        
        if (!req.file) {
            return res.json({ success: false, message: 'No image file provided' })
        }
        
        // Upload to Cloudinary using buffer
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'doctor-images',
            width: 500,
            height: 500,
            crop: 'limit'
        })
        
        // Update doctor's image in database
        await doctorModel.findByIdAndUpdate(doctorId, { image: result.secure_url })
        
        res.json({ 
            success: true, 
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { 
    changeAvailability, 
    doctorList, 
    loginDoctor, 
    appointmentsDoctor, 
    appointmentComplete, 
    appointmentCancel, 
    doctorDashboard, 
    doctorProfile, 
    updateDoctorProfile,
    uploadDoctorImage
};