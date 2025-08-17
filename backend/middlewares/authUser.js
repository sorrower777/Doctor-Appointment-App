import jwt from 'jsonwebtoken';


// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        console.log('authUser middleware called');
        console.log('Request headers:', req.headers);
        console.log('Request body before auth:', req.body);
        
        const {token} = req.headers;
        if(!token){
            console.log('No token provided');
            return res.status(401).json({success: false, message: "User token is required"});
        }

        console.log('Token received:', token.substring(0, 20) + '...');
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully, user ID:', token_decode.id);
        
        // Ensure req.body exists before setting userId
        if (!req.body) {
            req.body = {};
        }
        req.body.userId = token_decode.id;
        console.log('Request body after adding userId:', req.body);

        next(); // Proceed to the next middleware or route handler
    }
    catch(error){
        console.log('Token verification error:', error.message)
        return res.status(401).json({success: false, message: "Invalid token"})
    }
}
export default authUser;