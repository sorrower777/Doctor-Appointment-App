

const changeAvailability = async (req, res) => {
    try {
        const { doctorId} = req.body;
        const doctorData = await doctorModel.findById(doctorId);
        await doctorModel.findByIdAndUpdate(doctorId, {available: !doctorData.available})
        res.json({success: false, message: error.message})
    }
    catch (error) {
        console.error('Error changing availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export { changeAvailability };