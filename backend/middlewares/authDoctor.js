import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers
        
        if (!dtoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        
        // Ensure req.body exists before setting doctorId
        if (!req.body) {
            req.body = {}
        }
        req.body.doctorId = token_decode.id
        
        next()
    } catch (error) {
        console.log('AuthDoctor Error:', error)
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;
