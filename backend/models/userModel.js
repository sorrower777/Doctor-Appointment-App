import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    image: {
        type: String,
        default: ""
    },
    address: {
        line1: { type: String, default: "" },
        line2: { type: String, default: "" }
    },
    gender: {
        type: String,
        default: "Not Selected"
    },
    dob: {
        type: String,
        default: "Not Selected"
    },
    phone: {
        type: String,
        default: "000000000"
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
