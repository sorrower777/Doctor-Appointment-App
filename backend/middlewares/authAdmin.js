import jwt from 'jsonwebtoken';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const {atoken} = req.headers;
        if(!atoken){
            return res.json({success: false, message: "Admin token is required"});
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if(token_decode.email !== process.env.ADMIN_EMAIL){
            return res.json({success: false, message: "Admin token is invalid"});
        }
        next(); // Proceed to the next middleware or route handler
    }
    catch(error){
        console.log(error)
        res.json({success: false, message:error.message})
    }
}
export default authAdmin;