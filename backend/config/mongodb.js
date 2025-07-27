import mongoose from "mongoose";
const connectDb = async () => {
    mongoose.conncection.on('connnected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URL}/docbook`)
}

export default connectDb;