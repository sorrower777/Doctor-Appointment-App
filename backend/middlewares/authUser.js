import jwt from 'jsonwebtoken';


// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if(!token){
            return res.json({success: false, message: "User token is required"});
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure req.body exists before setting userId
        if (!req.body) {
            req.body = {};
        }
        req.body.userId = token_decode.id;

        // Remove admin email check - this is user authentication, not admin
        next(); // Proceed to the next middleware or route handler
    }
    catch(error){
        console.log(error)
        res.json({success: false, message:error.message})
    }
}
export default authUser;