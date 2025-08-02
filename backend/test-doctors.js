import mongoose from 'mongoose';
import doctorModel from './models/doctorModel.js';
import { config } from 'dotenv';

config();

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/docbook`);
}

const testDoctors = async () => {
    try {
        await connectDB();
        const doctors = await doctorModel.find({});
        console.log('Total doctors in database:', doctors.length);
        console.log('Doctor names:');
        doctors.forEach((doctor, index) => {
            console.log(`${index + 1}. ${doctor.name} - ${doctor.speciality}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testDoctors();
