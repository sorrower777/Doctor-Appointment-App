import 'dotenv/config';
import mongoose from 'mongoose';
import userModel from './models/userModel.js';

const testUserLogin = async () => {
    try {
        // Connect to database
        await mongoose.connect(`${process.env.MONGODB_URL}/docbook`);
        console.log("✅ Database Connected Successfully");

        // Test email that you're trying to login with
        const testEmail = "pankaj@gmail.com";
        
        console.log(`\n🔍 Searching for user with email: ${testEmail}`);
        
        // Try to find the user
        const user = await userModel.findOne({email: testEmail});
        
        if (user) {
            console.log("✅ User FOUND in database!");
            console.log("User details:");
            console.log({
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            });
            
            // Check if password field exists
            if (user.password) {
                console.log("✅ Password field exists");
                console.log("Password hash length:", user.password.length);
            } else {
                console.log("❌ Password field is missing!");
            }
        } else {
            console.log("❌ User NOT FOUND in database");
            
            // Let's check what users exist
            console.log("\n📋 Listing all users in database:");
            const allUsers = await userModel.find({}).select('email name');
            console.log("Total users:", allUsers.length);
            allUsers.forEach((u, index) => {
                console.log(`${index + 1}. Email: ${u.email}, Name: ${u.name}`);
            });
        }
        
        // Check the collection name being used
        console.log("\n📊 Collection Info:");
        console.log("Model collection name:", userModel.collection.name);
        console.log("Database name:", mongoose.connection.db.databaseName);
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Database Disconnected");
        process.exit(0);
    }
};

testUserLogin();
