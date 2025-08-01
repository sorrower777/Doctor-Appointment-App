import bcrypt from "bcrypt";
import validator from "validator";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from '../models/doctorModel.js';
import JWT from "jsonwebtoken";
// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, available, fees, address } = req.body;
        const imageFile = req.file;

        // check for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }
        // validate email format
        if(!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }
        // validate password length
        if(password.length < 6) {
            return res.json({success:false, message:"Please enter a strong password"})
        }
        // hashing doctor's password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            available: available === 'true', // Convert string to boolean
            fees: Number(fees), // Convert string to number
            address: JSON.parse(address),
            date: Date.now(),
            slots_booked: {} // Initialize as empty object
        }
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success: true, message: "Doctor added successfully", doctor: newDoctor});
    } catch (error) {
        console.error("Error in addDoctor:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
}
// API for getting all doctors
const loginAdmin = async(req,res) => {
    try{
        const { email, password} = req.body;
        if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
            const token = JWT.sign({email}, process.env.JWT_SECRET)
            res.json({success: true, message: "Login successful", token: token})
            // console.log("Login successful");
        }
        else{
            // console.log("Invalid credentials");
            res.json({success: false, message: "Invalid credentials"})
        }
    }
    catch(error){
        console.log(error)
        res.json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
// API for getting all doctors
const allDoctors = async (req, res) => {
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success: true, doctors})
    }
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// API for changing doctor availability
const changeAvailability = async (req, res) => {
    try {
        const { doctorId } = req.body;
        
        // Find the doctor and toggle availability
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        
        // Toggle the availability status
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId, 
            { available: !doctor.available }, 
            { new: true }
        );
        
        res.json({ 
            success: true, 
            message: `Doctor availability ${updatedDoctor.available ? 'enabled' : 'disabled'}`,
            doctor: updatedDoctor 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addDoctor, loginAdmin, allDoctors, changeAvailability };