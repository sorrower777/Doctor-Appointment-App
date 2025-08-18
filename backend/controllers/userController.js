import validator from 'validator'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import mongoose from 'mongoose'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'

// API to register user
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password) {
            return res.status(400).json({success:false, message:"Missing details"})
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({success:false, message:"Invalid email format"})
        }
        if(password.length < 7) {
            return res.status(400).json({success:false, message:"Password must be at least 7 characters long"})
        }

        // hashing user password
         const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(password, salt)

         const userData = {
            name,
            email,
            password: hashedPassword
         }

         const newUser = new userModel(userData)
         const user = await newUser.save()

        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET)
        
        // Return user data without password for registration
        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            dob: user.dob,
            gender: user.gender
        }

        res.json({success:true, token, user: userInfo})
    }
    catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success:false, message:'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch) {
            const token = JWT.sign({id: user._id}, process.env.JWT_SECRET)
            // Return user data without password
            const userInfo = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                dob: user.dob,
                gender: user.gender
            }
            res.json({success:true, token, user: userInfo})
        }else {
            res.json({success:false, message:'Invalid credentials'})
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true, userData})
    }catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        const {userId, name, phone, address, dob, gender} = req.body
        const imageFile = req.file  // Changed from req.imageFile to req.file
        
        // Check if userId exists (required for authentication)
        if(!userId){
            return res.json({success:false, message:"User not authenticated"})
        }

        // Build update object with only provided fields
        const updateData = {};
        if(name) updateData.name = name;
        if(phone) updateData.phone = phone;
        if(address) {
            // Handle address - it can be either a string (JSON) or an object
            if(typeof address === 'string') {
                try {
                    updateData.address = JSON.parse(address);
                } catch (error) {
                    return res.json({success:false, message:"Invalid address format"});
                }
            } else if(typeof address === 'object') {
                updateData.address = address;
            }
        }
        if(dob) updateData.dob = dob;
        if(gender) updateData.gender = gender;

        // Only update if there's data to update
        if(Object.keys(updateData).length > 0) {
            await userModel.findByIdAndUpdate(userId, updateData);
        }

        if(imageFile) {
            console.log('Image file received:', imageFile); // Add debug log
            const imageUpload = await cloudinary.uploader.upload(imageFile.originalname ,{resource_type: "image"})
            const imageURL = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, {image:imageURL})
        }
        res.json({success:true, message:"Profile updated successfully"})

    }catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, fee, speciality, address, doctorName, doctorImage } = req.body
        const userId = req.body.userId

        // Validate required fields
        if (!doctorId || !date || !time || !fee || !speciality || !address || !doctorName || !doctorImage) {
            return res.status(400).json({success:false, message:"Missing required appointment details"})
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({success:false, message:"Doctor not found"})
        }

        // Check if user already has appointment with this doctor at this time
        const existingAppointment = await appointmentModel.findOne({
            userId,
            doctorId,
            date,
            time,
            status: { $in: ['pending_payment', 'confirmed'] }
        })

        if (existingAppointment) {
            return res.status(400).json({success:false, message:"You already have an appointment with this doctor at this time"})
        }

        // Create new appointment
        const appointmentData = {
            userId,
            doctorId,
            doctorName,
            doctorImage,
            speciality,
            date,
            time,
            fee,
            address,
            status: 'pending_payment'
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        res.json({success:true, message:"Appointment booked successfully", appointment: newAppointment})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to get user appointments
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.body.userId

        // Only return appointments that are not cancelled
        const appointments = await appointmentModel.find({ 
            userId,
            status: { $ne: 'cancelled' } // Exclude cancelled appointments
        })
            .populate('doctorId', 'name speciality image fees available')
            .sort({ createdAt: -1 })

        res.json({success:true, appointments})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        console.log('Cancel appointment request body:', req.body);
        const { appointmentId } = req.body
        const userId = req.body.userId

        console.log('Extracted appointmentId:', appointmentId);
        console.log('Extracted userId:', userId);

        if (!appointmentId) {
            return res.status(400).json({success:false, message:"Appointment ID is required"})
        }

        if (!userId) {
            return res.status(400).json({success:false, message:"User authentication required"})
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({success:false, message:"Invalid appointment ID format"})
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({success:false, message:"Invalid user ID format"})
        }

        // Find the appointment
        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            userId
        })

        console.log('Found appointment:', appointment);

        if (!appointment) {
            return res.status(404).json({success:false, message:"Appointment not found"})
        }

        // Check if appointment can be cancelled
        if (appointment.status === 'cancelled') {
            return res.status(400).json({success:false, message:"Appointment is already cancelled"})
        }

        if (appointment.status === 'completed') {
            return res.status(400).json({success:false, message:"Cannot cancel completed appointment"})
        }

        // Update appointment status
        appointment.status = 'cancelled'
        await appointment.save()

        res.json({success:true, message:"Appointment cancelled successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to permanently remove appointment (for completed/cancelled appointments)
const removeAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.body.userId

        if (!appointmentId) {
            return res.status(400).json({success:false, message:"Appointment ID is required"})
        }

        if (!userId) {
            return res.status(400).json({success:false, message:"User ID is required"})
        }

        // Find the appointment
        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            userId
        })

        if (!appointment) {
            return res.status(404).json({success:false, message:"Appointment not found"})
        }

        // Check if appointment is in the past
        const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
        const now = new Date();
        
        // Only allow removal of past appointments or cancelled appointments
        if (appointmentDateTime >= now && appointment.status !== 'cancelled') {
            return res.status(400).json({success:false, message:"Can only remove past appointments or cancelled appointments"})
        }

        // Delete the appointment permanently
        await appointmentModel.findByIdAndDelete(appointmentId)

        res.json({success:true, message:"Appointment removed successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to process payment for appointment
const processAppointmentPayment = async (req, res) => {
    try {
        const { appointmentId, paymentData } = req.body
        const userId = req.body.userId

        // Find the appointment
        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            userId
        })

        if (!appointment) {
            return res.status(404).json({success:false, message:"Appointment not found"})
        }

        // Check if appointment is pending payment
        if (appointment.status !== 'pending_payment') {
            return res.status(400).json({success:false, message:"Appointment payment is not pending"})
        }

        // Update appointment with payment details
        appointment.payment = {
            paymentId: paymentData.paymentId,
            method: paymentData.method,
            cardLast4: paymentData.cardLast4,
            amount: paymentData.amount
        }
        appointment.status = 'confirmed'
        appointment.paidAt = new Date()

        await appointment.save()

        res.json({success:true, message:"Payment processed successfully", appointment})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

// API to update appointment slots in doctor model (for slot blocking)
const updateDoctorSlots = async (doctorId, date, time, action = 'book') => {
    try {
        const doctor = await doctorModel.findById(doctorId)
        if (!doctor) return false

        let slotsBooked = doctor.slots_booked || {}
        
        if (!slotsBooked[date]) {
            slotsBooked[date] = []
        }

        if (action === 'book') {
            if (!slotsBooked[date].includes(time)) {
                slotsBooked[date].push(time)
            }
        } else if (action === 'cancel') {
            slotsBooked[date] = slotsBooked[date].filter(slot => slot !== time)
        }

        await doctorModel.findByIdAndUpdate(doctorId, { slots_booked: slotsBooked })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, getUserAppointments, cancelAppointment, removeAppointment, processAppointmentPayment, updateDoctorSlots}