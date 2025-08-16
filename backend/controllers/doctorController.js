
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

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

export { changeAvailability, doctorList, loginDoctor };