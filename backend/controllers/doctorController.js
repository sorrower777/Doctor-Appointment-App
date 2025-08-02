

import doctorModel from "../models/doctorModel.js";

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

export { changeAvailability, doctorList };