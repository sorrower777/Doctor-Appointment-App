import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // check for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    // validate password length
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    // hashing doctor's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      available: available === "true", // Convert string to boolean
      fees: Number(fees), // Convert string to number
      address: JSON.parse(address),
      date: Date.now(),
      slots_booked: {}, // Initialize as empty object
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Error in addDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// API for getting all doctors
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const token = JWT.sign({ email }, process.env.JWT_SECRET);
      res.json({ success: true, message: "Login successful", token: token });
      // console.log("Login successful");
    } else {
      // console.log("Invalid credentials");
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// API for getting all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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
      message: `Doctor availability ${
        updatedDoctor.available ? "enabled" : "disabled"
      }`,
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).populate('userId', 'name email image phone gender dob');
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for admin
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'cancelled' });
    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to permanently delete cancelled/completed appointments
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Only allow deletion of cancelled or completed appointments
    if (appointment.status !== 'cancelled' && appointment.status !== 'completed') {
      return res.json({ success: false, message: "Can only delete cancelled or completed appointments" });
    }

    await appointmentModel.findByIdAndDelete(appointmentId);
    res.json({ success: true, message: "Appointment deleted permanently" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cleanup old appointments (completed/cancelled older than 30 days)
const cleanupOldAppointments = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await appointmentModel.deleteMany({
      $and: [
        {
          $or: [
            { status: 'cancelled' },
            { status: 'completed' }
          ]
        },
        {
          date: { $lt: thirtyDaysAgo.toISOString().split('T')[0] }
        }
      ]
    });

    res.json({ 
      success: true, 
      message: `Cleaned up ${result.deletedCount} old appointments`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark past appointments as completed
const markPastAppointmentsCompleted = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await appointmentModel.updateMany({
      date: { $lt: today },
      status: 'confirmed'
    }, {
      status: 'completed'
    });

    res.json({ 
      success: true, 
      message: `Marked ${result.modifiedCount} past appointments as completed`,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const  adminDashboard = async (req, res) => {
  try {
     const doctors = await doctorModel.find({})
     const users = await userModel.find({})
     const appointments = await appointmentModel.find({})

     const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5)
     }
     res.json({success: true, dashData})
  }catch(error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  changeAvailability,
  appointmentsAdmin,
  appointmentCancel,
  deleteAppointment,
  cleanupOldAppointments,
  markPastAppointmentsCompleted,
  adminDashboard
};
