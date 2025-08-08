import validator from 'validator'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'

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

        res.json({success:true, token})
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
            res.json({success:true, token})
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
        const imageFile = req.imageFile
        if(!name || !phone || !dob || !gender){
            return res.json({success:false, message:"Missing Data"})
        }
        await userModel.findByIdAndUpdate(userId, {name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: "image"})
            const imageURL = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, {image:imageURL})
        }
        res.json({success:true, message:"Profile updated successfully"})

    }catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error.message})
    }
}

export {registerUser, loginUser, getProfile, updateProfile}